// ==========================================
// 1. Mobile Navigation Toggle
// ==========================================
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
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
// 2. Frosted Header & Floating Pill Scroll Watcher
// ==========================================
const siteHeader = document.querySelector('.site-header');
const quickPill = document.getElementById('quickBookPill');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Toggle frosted header shadow/opacity
  if (siteHeader) {
    siteHeader.classList.toggle('scrolled', scrollY > 20);
  }

  // Show floating booking pill after scrolling 325px
  if (quickPill) {
    quickPill.classList.toggle('visible', scrollY > 325);
  }
}, { passive: true });

// ==========================================
// 3. Gentle Scroll Reveal (IntersectionObserver)
// ==========================================
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .section, .teaching-card').forEach(el => {
  if (!el.classList.contains('reveal')) {
    el.classList.add('reveal');
  }
  revealObserver.observe(el);
});

// ==========================================
// 4. Set Current Year in Footer
// ==========================================
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ==========================================
// 5. Formspree AJAX Form Handling
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
// 6. Floating "Book a Lesson" & Back-to-Top Pill
// ==========================================
const floatingActions = document.getElementById('floatingActions');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Fade in / out past 325px of scrolling
window.addEventListener('scroll', () => {
  if (floatingActions) {
    floatingActions.classList.toggle('visible', window.scrollY > 325);
  }
}, { passive: true });

// Smooth scroll to top on arrow click
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// 7. Studio Gallery Carousel (3D Wheel Engine)
// ==========================================
// Scope strictly to the teaching gallery section so it ignores the video carousel
const teachingGallery = document.querySelector('.teaching-gallery') || document.querySelector('#gallery');
const track = teachingGallery ? teachingGallery.querySelector('.carousel-track') : null;
const wrapper = teachingGallery ? teachingGallery.querySelector('.carousel-track-wrapper') : null;
const slides = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];
const prevBtn = teachingGallery ? teachingGallery.querySelector('.prev-btn') : null;
const nextBtn = teachingGallery ? teachingGallery.querySelector('.next-btn') : null;
const dotsContainer = teachingGallery ? teachingGallery.querySelector('.carousel-dots') : null;

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
  window.addEventListener('resize', updateWheel, { passive: true });

    // Touch / Mobile swipe support
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;

      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;

      // Only advance slides if the horizontal swipe was intentional and greater than vertical scrolling
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) moveToSlide(currentIndex + 1);
        else moveToSlide(currentIndex - 1);
      }
    }, { passive: true });

  // Initial render
  updateWheel();
}

// FAQ Accordion: Close others when one is opened
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.open) {
          otherItem.open = false;
        }
      });
    }
  });
});

// ==========================================
// Performance Video 3D Carousel
// ==========================================
(function initVideoCarousel() {
  const track = document.getElementById('videoCarouselTrack');
  const prevBtn = document.getElementById('videoPrevBtn');
  const nextBtn = document.getElementById('videoNextBtn');
  const dotsContainer = document.getElementById('videoCarouselDots');
  
  if (!track) return;
  
  const slides = Array.from(track.querySelectorAll('.video-slide'));
  const totalSlides = slides.length;
  let currentIndex = 0;

  // Build dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to video ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

  function pauseAllVideos() {
    track.querySelectorAll('video').forEach(vid => vid.pause());
  }

  function updateCarousel() {
    slides.forEach((slide, idx) => {
      let offset = idx - currentIndex;
      
      // Wrap around logic for circular carousel
      if (offset > totalSlides / 2) offset -= totalSlides;
      if (offset < -totalSlides / 2) offset += totalSlides;

      const absOffset = Math.abs(offset);

      if (absOffset === 0) {
        // Active Center Slide
        slide.style.transform = `translateX(0px) translateZ(80px) rotateY(0deg) scale(1)`;
        slide.style.opacity = '1';
        slide.style.zIndex = '10';
        slide.style.visibility = 'visible';
        slide.style.pointerEvents = 'auto';
      } else if (absOffset === 1) {
        // Flanking Side Slides
        const direction = offset > 0 ? 1 : -1;
        slide.style.transform = `translateX(${direction * 65}%) translateZ(-90px) rotateY(${direction * -18}deg) scale(0.88)`;
        slide.style.opacity = '0.55';
        slide.style.zIndex = '5';
        slide.style.visibility = 'visible';
        slide.style.pointerEvents = 'auto';
      } else {
        // Hidden Offscreen Slides
        slide.style.transform = `translateX(0px) translateZ(-200px) scale(0.6)`;
        slide.style.opacity = '0';
        slide.style.zIndex = '1';
        slide.style.visibility = 'hidden';
        slide.style.pointerEvents = 'none';
      }
    });

    // Update Dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    pauseAllVideos();
    currentIndex = (index + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Click side slides to bring to front
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', (e) => {
      // Don't change slide if clicking video play controls on the active slide
      if (idx === currentIndex) return;
      goToSlide(idx);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Initialize
  updateCarousel();
})();
