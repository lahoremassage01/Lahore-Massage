const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const fadeSections = document.querySelectorAll(".fade-section");
const faqItems = document.querySelectorAll(".faq-item");
const counters = document.querySelectorAll(".counter");
const backToTop = document.querySelector(".back-to-top");
const testimonialTrack = document.querySelector(".testimonial-track");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const testimonialDotsContainer = document.querySelector(".testimonial-dots");

let currentSlide = 0;
let testimonialInterval;
let countersAnimated = false;

const closeMobileMenu = () => {
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

const updateHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
  backToTop.classList.toggle("visible", window.scrollY > 300);
};

window.addEventListener("scroll", updateHeaderState);
updateHeaderState();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  fadeSections.forEach((section) => sectionObserver.observe(section));
} else {
  fadeSections.forEach((section) => section.classList.add("is-visible"));
}

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faq) => {
      faq.classList.remove("active");
      faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      faq.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 1700;
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(eased * target).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target.toLocaleString();
    }
  };

  requestAnimationFrame(updateCounter);
};

if ("IntersectionObserver" in window && document.querySelector(".stats")) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersAnimated) {
        counters.forEach(animateCounter);
        countersAnimated = true;
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  counterObserver.observe(document.querySelector(".stats"));
} else if (!countersAnimated) {
  counters.forEach(animateCounter);
  countersAnimated = true;
}

const updateDots = () => {
  testimonialDotsContainer.querySelectorAll("button").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
};

const goToSlide = (index) => {
  currentSlide = index;
  testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
};

const nextSlide = () => {
  goToSlide((currentSlide + 1) % testimonialCards.length);
};

const resetTestimonialInterval = () => {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(nextSlide, 4000);
};

if (testimonialCards.length) {
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetTestimonialInterval();
    });
    testimonialDotsContainer.appendChild(dot);
  });

  goToSlide(0);
  resetTestimonialInterval();
}

if ("IntersectionObserver" in window) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, {
    threshold: 0.45,
    rootMargin: "-20% 0px -35% 0px"
  });

  sections.forEach((section) => spyObserver.observe(section));
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMobileMenu();
  }

  const activeFaq = document.querySelector(".faq-item.active .faq-answer");
  if (activeFaq) {
    activeFaq.style.maxHeight = `${activeFaq.scrollHeight}px`;
  }
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = event.currentTarget.querySelector(".btn-submit");
  const originalText = submitButton.textContent;

  submitButton.textContent = "Submitted";
  submitButton.disabled = true;

  setTimeout(() => {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    event.currentTarget.reset();
  }, 1800);
});
