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
// 4. Studio Gallery Carousel (3D Wheel Engine)
// ==========================================
const track = document.querySelector('.carousel-track');
const wrapper = document.querySelector('.carousel-track-wrapper');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.carousel-dots');

if (track && wrapper && slides.length > 0) {
  let currentIndex = 0;
  const totalSlides = slides.length;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      if (idx === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = Array.from(document.querySelectorAll('.carousel-dot'));

  function updateWheel() {
    const isMobile = window.innerWidth <= 768;
    
    // Spacing between cards along the X-axis
    const xStep = isMobile ? 120 : 220; 
    const zStep = isMobile ? -140 : -180;
    const rotateAngle = 28; // Degree of tilt for wings

    slides.forEach((slide, i) => {
      // Calculate shortest distance in circular loop (-total/2 to +total/2)
      let offset = i - currentIndex;
      if (offset > totalSlides / 2) offset -= totalSlides;
      if (offset < -totalSlides / 2) offset += totalSlides;

      const absOffset = Math.abs(offset);

      // Only display active center item + 2 items on each side for clean depth
      if (absOffset <= 2) {
        slide.style.visibility = 'visible';
        slide.style.pointerEvents = 'auto';

        const translateX = offset * xStep;
        const translateZ = absOffset === 0 ? 0 : absOffset * zStep;
        const rotateY = offset === 0 ? 0 : (offset > 0 ? -rotateAngle : rotateAngle);
        const scale = absOffset === 0 ? 1 : Math.max(0.72, 1 - absOffset * 0.15);

        // Active center is opaque (1.0); wings are translucent
        const opacity = absOffset === 0 ? 1 : (absOffset === 1 ? 0.55 : 0.25);
        const zIndex = 20 - absOffset;

        slide.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        slide.style.opacity = opacity;
        slide.style.zIndex = zIndex;

        slide.classList.toggle('active', absOffset === 0);
      } else {
        // Distant slides are hidden behind
        slide.style.visibility = 'hidden';
        slide.style.pointerEvents = 'none';
        slide.style.opacity = '0';
        slide.style.transform = `translateX(${offset > 0 ? 400 : -400}px) translateZ(-400px) scale(0.5)`;
        slide.classList.remove('active');
      }
    });

    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function moveToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateWheel();
  }

  // Prev / Next button listeners
  if (prevBtn) prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));

  // Clicking any visible side card rotates it to the front
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (idx !== currentIndex) moveToSlide(idx);
    });
  });

  // Arrow key navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') moveToSlide(currentIndex + 1);
  });

  // Recalculate on screen resize / orientation change
  window.addEventListener('resize', updateWheel);

  // Touch / Mobile swipe support
  let startX = 0;
  let isSwiping = false;

  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 40) moveToSlide(currentIndex + 1);
    else if (diff < -40) moveToSlide(currentIndex - 1);
  });

  // Initial render
  updateWheel();
}
