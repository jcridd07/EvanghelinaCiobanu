// ==========================================
// 1. Mobile Navigation Toggle
// ==========================================
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

// ==========================================
// 2. Set Current Year in Footer
// ==========================================
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ==========================================
// 3. Formspree AJAX Form Handling
// ==========================================
document.querySelectorAll('.form').forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    if (submitButton) submitButton.disabled = true;
    if (status) status.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        if (status) status.textContent = 'Thank you — your message has been sent.';
      } else {
        const data = await response.json().catch(() => null);
        if (status) {
          if (data && data.errors && data.errors.length > 0) {
            status.textContent = data.errors.map(err => err.message).join(', ');
          } else {
            status.textContent = 'Something went wrong. Please try again.';
          }
        }
      }
    } catch (error) {
      if (status) status.textContent = 'Network error. Please try again.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});

// ==========================================
// 4. Studio Gallery Carousel
// ==========================================
const track = document.querySelector('.carousel-track');
const wrapper = document.querySelector('.carousel-track-wrapper');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.carousel-dots');

if (track && wrapper && slides.length > 0) {
  let currentIndex = 0;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      if (idx === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => updateCarousel(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = Array.from(document.querySelectorAll('.carousel-dot'));

  function updateCarousel(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Toggle active state classes
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Center the active slide dynamically in the viewport
    const activeSlide = slides[currentIndex];
    const wrapperWidth = wrapper.offsetWidth;
    const slideOffset = activeSlide.offsetLeft;
    const slideWidth = activeSlide.offsetWidth;

    const targetX = slideOffset - (wrapperWidth / 2) + (slideWidth / 2);
    track.style.transform = `translateX(-${targetX}px)`;
  }

  // Button navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
  }

  // Click side preview slides to select them
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (idx !== currentIndex) {
        updateCarousel(idx);
      }
    });
  });

  // Keyboard navigation (Left / Right arrow keys)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
    if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
  });

  // Re-center on browser resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updateCarousel(currentIndex), 100);
  });

  // Touch / Mobile swipe support
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentX = startX;
    isSwiping = true;
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    const diff = startX - currentX;
    const threshold = 40; // minimum px movement to register swipe

    if (diff > threshold) {
      updateCarousel(currentIndex + 1); // Swiped left
    } else if (diff < -threshold) {
      updateCarousel(currentIndex - 1); // Swiped right
    }
  });

  // Initial centering calculation once loaded
  window.addEventListener('load', () => updateCarousel(0));
  updateCarousel(0);
}
