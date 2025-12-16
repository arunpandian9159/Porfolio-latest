// ==================== Anime Portfolio Main JS ====================

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNavigation();
  initHeroToggle();
  initScrollAnimations();
  initCounters();
  initParticles();
});

// ==================== Loader Animation ====================
function initLoader() {
  const loader = document.getElementById("loader");
  const letters = document.querySelectorAll(".loader-letter");
  const progress = document.querySelector(".loader-progress");

  // Animate letters
  anime({
    targets: letters,
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutExpo",
  });

  // Animate progress bar
  anime({
    targets: progress,
    width: "100%",
    duration: 2000,
    easing: "easeInOutQuart",
    complete: () => {
      // Hide loader
      anime({
        targets: loader,
        opacity: 0,
        duration: 500,
        easing: "easeOutExpo",
        complete: () => {
          loader.classList.add("hidden");
          initHeroAnimation();
        },
      });
    },
  });
}

// ==================== Hero Animation ====================
function initHeroAnimation() {
  const activeHero = document.querySelector(".hero.active");

  if (activeHero.classList.contains("hero-a")) {
    animateHeroA();
  } else {
    animateHeroB();
  }
}

function animateHeroA() {
  const timeline = anime.timeline({ easing: "easeOutExpo" });

  // Animate tag
  timeline.add({
    targets: ".hero-a .hero-tag",
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800,
  });

  // Animate name characters with stagger
  timeline.add(
    {
      targets: ".hero-a .char",
      opacity: [0, 1],
      translateY: [50, 0],
      rotateX: [90, 0],
      delay: anime.stagger(50),
      duration: 800,
    },
    "-=400"
  );

  // Animate subtitle
  timeline.add(
    {
      targets: ".hero-a .hero-subtitle",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
    },
    "-=400"
  );

  // Animate stats
  timeline.add(
    {
      targets: ".hero-a .stat-item",
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(100),
      duration: 600,
    },
    "-=400"
  );

  // Animate buttons
  timeline.add(
    {
      targets: ".hero-a .hero-cta .btn",
      opacity: [0, 1],
      translateX: [-30, 0],
      delay: anime.stagger(150),
      duration: 600,
    },
    "-=300"
  );

  // Animate scroll indicator
  timeline.add(
    {
      targets: ".hero-a .scroll-indicator",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
    },
    "-=200"
  );

  // Animate hero stat numbers
  animateHeroStats();
}

function animateHeroB() {
  const timeline = anime.timeline({ easing: "easeOutExpo" });

  // Profile frame animation
  timeline.add({
    targets: ".hero-b .profile-frame",
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 1000,
  });

  // Frame border pulse
  timeline.add(
    {
      targets: ".hero-b .frame-border",
      opacity: [0, 1],
      scale: [1.2, 1],
      duration: 600,
    },
    "-=600"
  );

  // Quick stats
  timeline.add(
    {
      targets: ".hero-b .quick-stat",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      duration: 600,
    },
    "-=300"
  );

  // Intro text
  timeline.add(
    {
      targets: ".hero-b .intro-line",
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 600,
    },
    "-=400"
  );

  // Name
  timeline.add(
    {
      targets: ".hero-b .hero-name-b",
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 800,
    },
    "-=400"
  );

  // Role
  timeline.add(
    {
      targets: ".hero-b .hero-role",
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 600,
    },
    "-=500"
  );

  // Role underline
  timeline.add(
    {
      targets: ".hero-b .role-underline",
      width: [0, 100],
      duration: 600,
    },
    "-=400"
  );

  // Bio
  timeline.add(
    {
      targets: ".hero-b .hero-bio",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
    },
    "-=300"
  );

  // CTA
  timeline.add(
    {
      targets: ".hero-b .hero-cta-b",
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
    },
    "-=200"
  );
}

function animateHeroStats() {
  const heroStats = document.querySelectorAll(".hero-a .stat-number");

  heroStats.forEach((stat) => {
    const target = parseInt(stat.dataset.count);
    anime({
      targets: stat,
      innerHTML: [0, target],
      round: 1,
      duration: 2000,
      easing: "easeInOutExpo",
    });
  });
}

// ==================== Navigation ====================
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile toggle
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    // Animate hamburger
    const spans = navToggle.querySelectorAll("span");
    if (navMenu.classList.contains("active")) {
      anime({
        targets: spans[0],
        rotate: 45,
        translateY: 7,
        duration: 300,
      });
      anime({
        targets: spans[1],
        opacity: 0,
        duration: 300,
      });
      anime({
        targets: spans[2],
        rotate: -45,
        translateY: -7,
        duration: 300,
      });
    } else {
      anime({
        targets: spans,
        rotate: 0,
        translateY: 0,
        opacity: 1,
        duration: 300,
      });
    }
  });

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const spans = navToggle.querySelectorAll("span");
      anime({
        targets: spans,
        rotate: 0,
        translateY: 0,
        opacity: 1,
        duration: 300,
      });
    });
  });

  // Smooth scroll with offset
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          const targetPosition =
            target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// ==================== Hero Toggle ====================
function initHeroToggle() {
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const heroA = document.querySelector(".hero-a");
  const heroB = document.querySelector(".hero-b");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const heroNum = btn.dataset.hero;

      // Update active button
      toggleBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Toggle heroes with animation
      if (heroNum === "1") {
        anime({
          targets: heroB,
          opacity: 0,
          duration: 300,
          easing: "easeOutExpo",
          complete: () => {
            heroB.classList.remove("active");
            heroA.classList.add("active");
            anime({
              targets: heroA,
              opacity: [0, 1],
              duration: 300,
              easing: "easeInExpo",
              complete: () => animateHeroA(),
            });
          },
        });
      } else {
        anime({
          targets: heroA,
          opacity: 0,
          duration: 300,
          easing: "easeOutExpo",
          complete: () => {
            heroA.classList.remove("active");
            heroB.classList.add("active");
            anime({
              targets: heroB,
              opacity: [0, 1],
              duration: 300,
              easing: "easeInExpo",
              complete: () => animateHeroB(),
            });
          },
        });
      }
    });
  });
}

// ==================== Scroll Animations ====================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  // Section headers animation
  const sectionHeaders = document.querySelectorAll(".section-header");
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target.querySelector(".section-tag"),
          opacity: [0, 1],
          translateY: [-20, 0],
          duration: 600,
          easing: "easeOutExpo",
        });
        anime({
          targets: entry.target.querySelector(".section-title"),
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          delay: 200,
          easing: "easeOutExpo",
        });
        anime({
          targets: entry.target.querySelector(".title-decoration"),
          width: [0, 80],
          duration: 600,
          delay: 400,
          easing: "easeOutExpo",
        });
        headerObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sectionHeaders.forEach((header) => headerObserver.observe(header));

  // Stat cards animation
  const statCards = document.querySelectorAll(".stat-card");
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add("visible");
          // Animate counter
          const valueEl = entry.target.querySelector(".stat-value");
          if (valueEl) {
            const target = parseInt(valueEl.dataset.count);
            anime({
              targets: valueEl,
              innerHTML: [0, target],
              round: 1,
              duration: 1500,
              easing: "easeInOutExpo",
            });
          }
        }, delay);
        statObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statCards.forEach((card) => statObserver.observe(card));

  // Timeline items animation
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 800,
          easing: "easeOutExpo",
        });
        entry.target.classList.add("visible");
        timelineObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach((item) => timelineObserver.observe(item));

  // Skill categories animation
  const skillCategories = document.querySelectorAll(".skill-category");
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 600,
          easing: "easeOutExpo",
        });

        // Animate skill tags with stagger
        const tags = entry.target.querySelectorAll(".skill-tag");
        anime({
          targets: tags,
          opacity: [0, 1],
          scale: [0.8, 1],
          delay: anime.stagger(50, { start: 300 }),
          duration: 400,
          easing: "easeOutExpo",
        });

        skillObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  skillCategories.forEach((cat) => skillObserver.observe(cat));

  // Project cards animation
  const projectCards = document.querySelectorAll(
    ".project-card, .project-card-mini"
  );
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 800,
          easing: "easeOutExpo",
        });
        projectObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  projectCards.forEach((card) => projectObserver.observe(card));

  // Education cards animation
  const eduCards = document.querySelectorAll(".education-card");
  const eduObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.95, 1],
            duration: 700,
            easing: "easeOutExpo",
          });
          eduObserver.unobserve(entry.target);
        }
      });
    },
    { ...observerOptions, threshold: 0.2 }
  );

  eduCards.forEach((card) => eduObserver.observe(card));

  // Certification cards animation
  const certCards = document.querySelectorAll(".cert-card");
  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          rotateY: [45, 0],
          duration: 800,
          easing: "easeOutExpo",
        });
        certObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  certCards.forEach((card) => certObserver.observe(card));

  // Achievement items animation
  const achievements = document.querySelectorAll(".achievement-item");
  const achieveObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 600,
          easing: "easeOutExpo",
        });
        achieveObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  achievements.forEach((item) => achieveObserver.observe(item));

  // Contact section animation
  const contactSection = document.querySelector(".contact-section");
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: ".contact-method",
          opacity: [0, 1],
          translateX: [-30, 0],
          delay: anime.stagger(100),
          duration: 600,
          easing: "easeOutExpo",
        });
        anime({
          targets: ".social-connect",
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 800,
          delay: 300,
          easing: "easeOutExpo",
        });
        contactObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  if (contactSection) contactObserver.observe(contactSection);
}

// ==================== Counters ====================
function initCounters() {
  // Already handled in scroll animations for stat cards
}

// ==================== Particles Effect ====================
function initParticles() {
  createParticles("particles-a");
  createParticles("particles-b");
}

function createParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: ${Math.random() > 0.5 ? "#e63946" : "#a8dadc"};
      border-radius: 50%;
      opacity: ${Math.random() * 0.5 + 0.2};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      pointer-events: none;
    `;
    container.appendChild(particle);

    // Animate particle
    animateParticle(particle);
  }
}

function animateParticle(particle) {
  const duration = Math.random() * 5000 + 3000;
  const delay = Math.random() * 2000;

  anime({
    targets: particle,
    translateX: () => anime.random(-100, 100),
    translateY: () => anime.random(-100, 100),
    opacity: [
      { value: 0.1, duration: duration / 2 },
      { value: 0.6, duration: duration / 2 },
    ],
    scale: [
      { value: 0.5, duration: duration / 2 },
      { value: 1.5, duration: duration / 2 },
    ],
    duration: duration,
    delay: delay,
    easing: "easeInOutSine",
    complete: () => animateParticle(particle),
  });
}

// ==================== Hover Effects ====================
// Add energy burst effect on button hover
document.querySelectorAll(".btn-primary").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    anime({
      targets: btn,
      scale: [1, 1.05],
      duration: 200,
      easing: "easeOutExpo",
    });
  });

  btn.addEventListener("mouseleave", () => {
    anime({
      targets: btn,
      scale: [1.05, 1],
      duration: 200,
      easing: "easeOutExpo",
    });
  });
});

// Skill tag hover effect
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("mouseenter", () => {
    anime({
      targets: tag,
      scale: 1.1,
      duration: 200,
      easing: "easeOutExpo",
    });
  });

  tag.addEventListener("mouseleave", () => {
    anime({
      targets: tag,
      scale: 1,
      duration: 200,
      easing: "easeOutExpo",
    });
  });
});
