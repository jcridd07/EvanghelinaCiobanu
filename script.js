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

// Contact / booking forms submit via Formspree without a page reload
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

// Studio Gallery Carousel
const track = document.querySelector('.carousel-track');
const wrapper = document.querySelector('.carousel-track-wrapper');
const slides = document.querySelectorAll('.carousel-slide');
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
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      if (idx === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => updateCarousel(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.carousel-dot');

  function updateCarousel(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
  }
}
