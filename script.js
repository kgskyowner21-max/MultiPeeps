/* Multi Peeps behaviours. Called by index.html after the page content has been drawn. */
window.initSite = function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }));
  }

  // Scroll reveals
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Welcome popup and follow-up toast (both optional: they can be deleted in the editor)
  const modal = document.getElementById("welcome-modal");
  const toast = document.getElementById("toast");
  let toastTimer;
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    window.clearTimeout(toastTimer);
    if (toast) toastTimer = window.setTimeout(() => toast.classList.add("show"), 6500);
  };
  if (modal) {
    window.setTimeout(() => { modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); }, 1700);
    modal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
    document.getElementById("modal-explore")?.addEventListener("click", closeModal);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  } else if (toast) {
    window.setTimeout(() => toast.classList.add("show"), 6500);
  }
  document.getElementById("toast-close")?.addEventListener("click", () => toast.classList.remove("show"));

  // Service cards preselect the relevant inquiry topic.
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const select = document.getElementById("service");
      if (select) select.value = link.dataset.service;
      if (modal && modal.classList.contains("is-open")) closeModal();
    });
  });

  // Demo-only inquiry form. Connect Formspree, Netlify Forms, or a backend before launch.
  const form = document.getElementById("inquiry-form");
  const status = document.getElementById("form-status");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (status) status.textContent = "Thanks for testing the form! This demo does not send your inquiry yet. Connect a form service before publishing.";
    form.reset();
  });
};
