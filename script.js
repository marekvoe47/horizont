// Fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-in');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
fadeEls.forEach(el => io.observe(el));

/** Toggle program items (no scroll jumps) */
function toggleProgram(item, event) {
  if (event) event.preventDefault();
  item.classList.toggle('open');
  if (event && (event.pointerType === 'mouse' || event.pointerType === 'touch' || event.type === 'click')) {
    setTimeout(() => item.blur(), 10);
  }
}
function keyToggle(e, item) {
  const k = e.key || e.code;
  if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
    e.preventDefault();
    toggleProgram(item, e);
  }
}
window.toggleProgram = toggleProgram;
window.keyToggle = keyToggle;

// Prevent focus highlight in some live previews
document.querySelectorAll('.program-item').forEach(el => {
  el.addEventListener('mousedown', e => e.preventDefault());
});

// Active nav highlighting by section
const navLinks = [...document.querySelectorAll('#mainNav a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { threshold: 0.6 });
sections.forEach(sec => navIO.observe(sec));

/* -------- Mobile nav toggle -------- */
const toggleBtn = document.querySelector('.nav-toggle');
const navList  = document.getElementById('mainNav');

function closeNav(){
  navList.classList.remove('open');
  toggleBtn.classList.remove('open');
  toggleBtn.setAttribute('aria-expanded', 'false');
}

toggleBtn.addEventListener('click', () => {
  const willOpen = !navList.classList.contains('open');
  navList.classList.toggle('open', willOpen);
  toggleBtn.classList.toggle('open', willOpen);
  toggleBtn.setAttribute('aria-expanded', String(willOpen));
});

// Close menu on link click (better UX)
navLinks.forEach(a => a.addEventListener('click', closeNav));
// Close on scroll
window.addEventListener('scroll', closeNav, { passive: true });
