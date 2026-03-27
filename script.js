/* justQuinn EPK — Script */

// ── Navbar scroll state ──────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile nav toggle ────────────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Scroll reveal ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Booking form ─────────────────────────────────────────────────────────────
const form    = document.getElementById('booking-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#f87171';
      valid = false;
    }
  });

  if (!valid) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Replace with your form backend (Formspree, Netlify Forms, etc.)
  // Example with Formspree: action="https://formspree.io/f/YOUR_ID" method="POST"
  setTimeout(() => {
    form.reset();
    submitBtn.textContent = 'Send Inquiry';
    submitBtn.disabled = false;
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 800);
});

// ── Active nav link on scroll ────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? '#fff'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));
