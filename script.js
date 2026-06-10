// ── Navbar scroll shadow ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile hamburger ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Form tabs ───────────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const forms   = document.querySelectorAll('.enquiry-form');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.tab) {
      tabBtns.forEach(b => { if (b.dataset.tab) b.classList.remove('active'); });
      forms.forEach(f => f.classList.remove('active-form'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab + 'Form').classList.add('active-form');
    }
  });
});

// ── Scroll fade-up animations ───────────────────────────
const fadeTargets = document.querySelectorAll(
  '.lang-card, .format-item, .pillar, .timeline-item, .i-tag, .cred-card, .testimonial-card, .section-title, .section-lead'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeTargets.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ── Form submission feedback ────────────────────────────
document.querySelectorAll('.enquiry-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    const lang = window.__currentLang || 'en';
    const dict = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};

    btn.textContent = dict['js.sending'] || 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = dict['js.sent'] || '✓ Message Sent!';
        btn.style.background = '#2A7A4A';
        btn.style.borderColor = '#2A7A4A';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.textContent = dict['js.error'] || 'Error — please try again';
      btn.style.background = '#8B1A1A';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }
  });
});
