const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const artworks = [...document.querySelectorAll(".artwork")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

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

function openLightbox(artwork) {
  const sourceImage = artwork.querySelector("img");
  lightboxImage.src = sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCaption.textContent = artwork.dataset.title;
  lightbox.showModal();
  body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.close();
  body.classList.remove("lightbox-open");
  lightboxImage.src = "";
}

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
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("cancel", () => body.classList.remove("lightbox-open"));

document.querySelector("#year").textContent = new Date().getFullYear();
