document.getElementById('year').textContent = new Date().getFullYear();

// Highlight the nav item for the section in view
const navLinks = [...document.querySelectorAll('.nav-links a')];
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('#top, #channels, #contact').forEach((s) => navObs.observe(s));

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('mobile-menu');
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.hidden = !open;
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
    status.textContent = 'Address copied.';
  } catch {
    status.textContent = 'Copy failed. Select the address below and copy it by hand.';
  }
  setTimeout(() => { copyBtn.querySelector('span').textContent = 'Copy address'; }, 2000);
});
