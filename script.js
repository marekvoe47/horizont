// Enable JS styles
const root = document.documentElement;
root.classList.add('js');

/* -------- Fade-in animation -------- */
const fadeEls = Array.from(document.querySelectorAll('.fade-in'));
const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

if (fadeEls.length) {
  const revealImmediately = () => {
    fadeEls.forEach(el => el.classList.add('show'));
  };

  if (!('IntersectionObserver' in window) || (reduceMotionQuery && reduceMotionQuery.matches)) {
    revealImmediately();
  } else {
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    fadeEls.forEach(el => fadeObserver.observe(el));

    if (reduceMotionQuery) {
      const onPreferenceChange = event => {
        if (event.matches) {
          revealImmediately();
          fadeObserver.disconnect();
        }
      };

      if (typeof reduceMotionQuery.addEventListener === 'function') {
        reduceMotionQuery.addEventListener('change', onPreferenceChange);
      } else if (typeof reduceMotionQuery.addListener === 'function') {
        reduceMotionQuery.addListener(onPreferenceChange);
      }
    }
  }
}

/* -------- Navigation state -------- */
const navLinks = Array.from(document.querySelectorAll('#mainNav a'));

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;

  if (!link.hash) {
    const normalized = href.split('#')[0];
    if (normalized === currentPath || (normalized === 'index.html' && currentPath === '')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    return;
  }
});

const sectionLinks = navLinks.filter(link => {
  if (!link.hash) return false;
  const id = link.hash.slice(1);
  return !!document.getElementById(id);
});

if ('IntersectionObserver' in window && sectionLinks.length) {
  const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('aria-current') === 'location') {
          link.removeAttribute('aria-current');
        }
      });
      const activeLink = sectionLinks.find(link => link.hash.slice(1) === entry.target.id);
      if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'location');
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(section => navObserver.observe(section));
}

/* -------- Mobile nav toggle -------- */
const toggleBtn = document.querySelector('.nav-toggle');
const navList  = document.getElementById('mainNav');

if (toggleBtn && navList) {
  const closeNav = () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (!navList.classList.contains('open')) return;
    navList.classList.remove('open');
    toggleBtn.classList.remove('open');
    window.removeEventListener('scroll', handleScrollClose);
  };

  const handleScrollClose = () => closeNav();

  const openNav = () => {
    if (navList.classList.contains('open')) return;
    navList.classList.add('open');
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    window.addEventListener('scroll', handleScrollClose, { passive: true });
  };

  toggleBtn.addEventListener('click', () => {
    if (navList.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.forEach(link => link.addEventListener('click', closeNav));
}
