'use strict';

/* ── Stars ─────────────────────────────────────────────────── */
function createStars() {
  const container = document.getElementById('starsContainer');
  if (!container) return;
  const count = window.innerWidth < 600 ? 40 : 80;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const size = Math.random() * 1.8 + 0.5;
    s.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `top:${Math.random() * 55}%`,
      `opacity:${Math.random() * 0.65 + 0.1}`,
    ].join(';');
    frag.appendChild(s);
  }
  container.appendChild(frag);
}

/* ── Navbar ─────────────────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const links   = document.getElementById('navLinks');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ── Counter animation ──────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Scroll animations (IntersectionObserver) ───────────────── */
function initScrollAnimations() {
  const elements  = document.querySelectorAll('[data-anim]');
  const counters  = document.querySelectorAll('.counter');
  let countersRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersRun) {
      countersRun = true;
      counters.forEach(c => animateCounter(c));
    }
  }, { threshold: 0.4 });

  elements.forEach(el => observer.observe(el));
  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) statsObserver.observe(statsStrip);
}

/* ── Contact form ───────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = 'Envoyer ma demande <i class="fas fa-paper-plane"></i>';
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 6000);
    }, 1200);
  });
}

/* ── Back to top ────────────────────────────────────────────── */
function initBackTop() {
  document.getElementById('backTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Gallery hover (keyboard accessible) ───────────────────── */
function initGallery() {
  document.querySelectorAll('.gal-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'img');
    item.setAttribute('aria-label', item.querySelector('.gal-overlay span')?.textContent ?? '');
  });
}

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initNavbar();
  initScrollAnimations();
  initContactForm();
  initBackTop();
  initGallery();
});
