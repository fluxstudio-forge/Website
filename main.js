const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('year').textContent = new Date().getFullYear();

// Section reveals, once each
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

// Tagline: split into words, light each one as it crosses the trigger line
const tagline = document.querySelector('[data-words]');
if (tagline) {
  tagline.innerHTML = tagline.textContent.trim().split(/\s+/)
    .map((w) => `<span class="w">${w}</span>`).join(' ');
  const words = [...tagline.querySelectorAll('.w')];
  if (reduced) {
    words.forEach((w) => w.classList.add('on'));
  } else {
    let ticking = false;
    const update = () => {
      const r = tagline.getBoundingClientRect();
      const trigger = innerHeight * 0.75;
      const progress = Math.min(Math.max((trigger - r.top) / (r.height + innerHeight * 0.3), 0), 1);
      const lit = Math.round(progress * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
}

// Active nav item
const navLinks = [...document.querySelectorAll('.nav-links a')];
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('#channels, #contact').forEach((s) => navObs.observe(s));

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('mobile-menu');
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) {
    menu.hidden = false;
    const items = [...menu.querySelectorAll('a')];
    const step = Math.min(60, 400 / items.length);
    items.forEach((a, i) => { a.style.animationDelay = `${i * step}ms`; });
    requestAnimationFrame(() => menu.classList.add('open'));
  } else {
    menu.classList.remove('open');
    menu.hidden = true;
  }
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Copy email
const copyBtn = document.getElementById('copy-email');
const status = document.getElementById('copy-status');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.querySelector('span').textContent = 'Copied';
    status.textContent = 'Address copied to your clipboard.';
  } catch {
    status.textContent = 'Copy failed. Select the address below and copy it by hand.';
  }
  setTimeout(() => { copyBtn.querySelector('span').textContent = 'Copy address'; }, 2000);
});
