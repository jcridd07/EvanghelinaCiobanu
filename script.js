// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('is-open');
  });

  // Close menu when a link is clicked
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    });
  });
}

// Set current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Optional: smooth scroll offset handled by CSS scroll-padding-top

// Contact / booking forms submit via Netlify Forms without a page reload
document.querySelectorAll('form[data-netlify="true"]').forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        form.reset();
        if (status) status.textContent = 'Thank you — your message has been sent.';
      } else if (status) {
        status.textContent = 'Something went wrong. Please try again.';
      }
    } catch (error) {
      if (status) status.textContent = 'Something went wrong. Please try again.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});

// Studio Gallery Carousel
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.carousel-dots');

if (track && slides.length > 0) {
  let currentIndex = 1; // Starts at second slide by default

  // Generate indicator dots
  if (dotsContainer) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      if (idx === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => updateCarousel(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.carousel-dot');

  function updateCarousel(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    // Update active slide class
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Center active slide
    const activeSlide = slides[currentIndex];
    const slideWidth = activeSlide.offsetWidth;
    const gap = 24; // 1.5rem gap
    const offset = (slideWidth + gap) * currentIndex;
    const initialOffset = (slideWidth + gap) * 1;

    track.style.transform = `translateX(${initialOffset - offset}px)`;
  }

  // Prev / Next button listeners
  if (prevBtn) prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

  // Click side slides to focus
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (currentIndex !== idx) updateCarousel(idx);
    });
  });

  // Mobile swipe gestures
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    endX = e.changedTouches[0].screenX;
    if (startX - endX > 45) updateCarousel(currentIndex + 1);
    if (endX - startX > 45) updateCarousel(currentIndex - 1);
  }, { passive: true });

  // Initial setup and responsive resizing
  updateCarousel(currentIndex);
  window.addEventListener('resize', () => updateCarousel(currentIndex));
}
