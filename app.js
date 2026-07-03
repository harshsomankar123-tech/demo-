let currentSlideIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupPresentation();
});

function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".content-view");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.getAttribute("data-target");
      navItems.forEach(n => n.classList.remove("active"));
      views.forEach(v => v.classList.remove("active"));
      item.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });
}

function setupPresentation() {
  renderSlide(0);
}

function renderSlide(idx) {
  const slide = slidesData[idx];
  document.getElementById("slide-title").innerText = slide.title;
  document.getElementById("slide-subtitle").innerText = slide.subtitle;
  document.getElementById("slide-body-content").innerHTML = slide.content;
}
