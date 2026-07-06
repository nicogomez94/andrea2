const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const artworks = [...document.querySelectorAll(".artwork")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCounter = document.querySelector("#lightbox-counter");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
let slideshowItems = [];
let currentSlideIndex = 0;

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -30px" }
);

document.querySelectorAll(".fade-in").forEach((element) => revealObserver.observe(element));

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function getVisibleArtworks() {
  return artworks.filter((artwork) => !artwork.hidden);
}

function renderSlide(index) {
  if (!slideshowItems.length) return;

  const boundedIndex = (index + slideshowItems.length) % slideshowItems.length;
  currentSlideIndex = boundedIndex;
  const artwork = slideshowItems[boundedIndex];
  const sourceImage = artwork.querySelector("img");

  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = artwork.dataset.title;
  lightboxCounter.textContent = `${String(boundedIndex + 1).padStart(2, "0")} / ${String(slideshowItems.length).padStart(2, "0")}`;
}

function openLightbox(artwork) {
  slideshowItems = getVisibleArtworks();
  currentSlideIndex = slideshowItems.indexOf(artwork);
  if (currentSlideIndex < 0) currentSlideIndex = 0;
  renderSlide(currentSlideIndex);
  lightbox.showModal();
  body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.close();
  body.classList.remove("lightbox-open");
  lightboxImage.src = "";
}

function showNextSlide() {
  if (!slideshowItems.length) return;
  renderSlide(currentSlideIndex + 1);
}

function showPreviousSlide() {
  if (!slideshowItems.length) return;
  renderSlide(currentSlideIndex - 1);
}

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    artworks.forEach((artwork) => {
      const shouldShow = filter === "all" || artwork.dataset.series === filter;
      artwork.hidden = !shouldShow;
      if (shouldShow) {
        artwork.classList.add("is-visible");
      }
    });

    closeMenu();

    if (window.scrollY > 120) {
      document.querySelector("#top").scrollIntoView({ behavior: "smooth" });
    }
  });
});

artworks.forEach((artwork) => {
  artwork.addEventListener("click", () => openLightbox(artwork));
  artwork.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(artwork);
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPreviousSlide);
lightboxNext.addEventListener("click", showNextSlide);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("cancel", () => {
  body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxCounter.textContent = "";
});
document.addEventListener("keydown", (event) => {
  if (!body.classList.contains("lightbox-open")) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPreviousSlide();
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showNextSlide();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
