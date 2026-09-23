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
