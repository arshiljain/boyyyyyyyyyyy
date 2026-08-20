/**
 * Sairish Maritime Solutions - Global Interactive Effects
 * Features:
 * - Fixed-Size Luminous Blue Cursor on Hover (No scale/expansion)
 * - Event-Delegated Hover for 100% Reliability Across All Pages
 * - Interactive Team Member Image Swap on Hover
 * - 3D Tilt on Cards & Sliders
 * - 3D Canvas Wave Animation
 */

(function () {
  let cursor = null;
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let cursorX = mouseX, cursorY = mouseY;
  let isHovering = false;

  function initCursor() {
    if (window.innerWidth < 768) return;

    cursor = document.querySelector(".mousefollower");
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.className = "mousefollower";
      document.body.appendChild(cursor);
    }

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Global Event Delegation for 100% Reliable Hover on All Pages
    const interactiveSelector = "a, button, input, select, textarea, .btn, .vacancy-card, .career-3d-card, .slider-card, .card, .team-mem, .home-prob__main-item, .home-solu__main-item, .footer__link, .header__link, .abt-event__item, h1, h2, h3, .apply-role-btn, .hover-un, .tech-demo__card";

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(interactiveSelector)) {
        isHovering = true;
        if (cursor) cursor.classList.add("cursor-hover");
      }
    });

    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(interactiveSelector)) {
        isHovering = false;
        if (cursor) cursor.classList.remove("cursor-hover");
      }
    });
  }

  // Team Member Image Hover Swap in about.html
  function initTeamHover() {
    document.addEventListener("mouseover", function (e) {
      const teamMem = e.target.closest(".team-mem");
      if (!teamMem) return;

      const idx = teamMem.getAttribute("data-team-index");
      if (idx === null) return;

      document.querySelectorAll(".team-mem").forEach(tm => tm.classList.remove("active"));
      teamMem.classList.add("active");

      const imgItems = document.querySelectorAll(".abt-team__main-img-item");
      imgItems.forEach((item, i) => {
        if (i.toString() === idx) {
          item.classList.add("active");
          item.style.opacity = "1";
          item.style.visibility = "visible";
          item.style.transform = "scale(1)";
        } else {
          item.classList.remove("active");
          item.style.opacity = "0";
          item.style.visibility = "hidden";
          item.style.transform = "scale(0.96)";
        }
      });
    });
  }

  // 3D Tilt on Cards
  function init3DTilt() {
    document.addEventListener("mousemove", function (e) {
      const card = e.target.closest(".vacancy-card, .career-3d-card, .home-prob__main-item, .tech-3d-card, .slider-card");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transformStyle = "preserve-3d";
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    document.addEventListener("mouseout", function (e) {
      const card = e.target.closest(".vacancy-card, .career-3d-card, .home-prob__main-item, .tech-3d-card, .slider-card");
      if (card && !card.contains(e.relatedTarget)) {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
        setTimeout(() => card.style.transition = "", 500);
      }
    });
  }

  // 3D Canvas
  function init3DCanvas() {
    const canvas = document.getElementById("careers-3d-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener("resize", () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    let step = 0;
    const lines = 18;
    const pointsPerLine = 48;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      step += 0.02;

      for (let j = 0; j < lines; j++) {
        ctx.beginPath();
        const lineY = (height / (lines + 2)) * (j + 1);
        const depth = j / lines;
        
        ctx.lineWidth = 1.2 + depth * 2.2;
        ctx.strokeStyle = `rgba(0, 136, 255, ${0.12 + depth * 0.35})`;

        for (let i = 0; i <= pointsPerLine; i++) {
          const x = (width / pointsPerLine) * i;
          const wave1 = Math.sin(step + i * 0.16 + j * 0.28) * (18 + depth * 22);
          const wave2 = Math.cos(step * 0.75 + i * 0.1 - j * 0.22) * (12 + depth * 15);
          const y = lineY + wave1 + wave2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // Sliders
  function initSliders() {
    const track = document.getElementById("fleet-slider-track");
    const prevBtn = document.getElementById("slider-prev-btn");
    const nextBtn = document.getElementById("slider-next-btn");

    if (track && prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => track.scrollBy({ left: -380, behavior: "smooth" }));
      nextBtn.addEventListener("click", () => track.scrollBy({ left: 380, behavior: "smooth" }));
    }
  }

  function initAll() {
    initCursor();
    initTeamHover();
    init3DTilt();
    init3DCanvas();
    initSliders();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  if (window.barba) {
    window.barba.hooks.after(initAll);
    window.barba.hooks.afterEnter(initAll);
  }
})();