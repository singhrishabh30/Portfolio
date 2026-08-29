/* ==========================================================================
   RISHABH SINGH — PORTFOLIO SCRIPT
   1. Navbar scroll state + active section + sliding indicator
   2. Mobile menu
   3. Scroll reveal (Intersection Observer)
   4. Certificate modal
   5. Contact form validation
   6. Back to top
   7. Custom cursor (desktop only)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navIndicator = document.getElementById('navIndicator');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function moveIndicator(link) {
    if (!link || !navIndicator) return;
    navIndicator.style.width = link.offsetWidth + 'px';
    navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
  }

  function setActiveLink(id) {
    let matched = null;
    navLinks.forEach(link => {
      const isMatch = link.dataset.section === id;
      link.classList.toggle('active', isMatch);
      if (isMatch) matched = link;
    });
    if (matched) moveIndicator(matched);
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  // Initialize indicator position once fonts/layout settle
  window.addEventListener('load', () => {
    const active = document.querySelector('.nav-link.active') || navLinks[0];
    moveIndicator(active);
  });
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    moveIndicator(active);
  });

  /* ---------- 2. MOBILE MENU ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });

  /* ---------- 3. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 4. CERTIFICATE MODAL ---------- */
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalDownload = document.getElementById('modalDownload');
  const modalClose = document.getElementById('modalClose');

  const certData = {
    1: { src: 'assets/certificates/CERTIFICATE_1.jpg', alt: 'CERTIFICATE_1_TITLE' },
    2: { src: 'assets/certificates/CERTIFICATE_2.jpg', alt: 'CERTIFICATE_2_TITLE' },
    3: { src: 'assets/certificates/CERTIFICATE_3.jpg', alt: 'CERTIFICATE_3_TITLE' },
    4: { src: 'assets/certificates/CERTIFICATE_4.jpg', alt: 'CERTIFICATE_4_TITLE' }
  };

  function openCertModal(id) {
    const data = certData[id];
    if (!data) return;
    modalImg.src = data.src;
    modalImg.alt = data.alt;
    modalDownload.href = data.src;
    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeCertModal() {
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cert-view').forEach(btn => {
    btn.addEventListener('click', () => openCertModal(btn.dataset.certTarget));
  });

  modalClose.addEventListener('click', closeCertModal);
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('open')) closeCertModal();
  });

  /* ---------- 5. CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function setError(fieldId, message) {
    const row = document.getElementById(fieldId).closest('.form-row');
    const errorEl = document.getElementById('err-' + fieldId);
    row.classList.toggle('invalid', Boolean(message));
    errorEl.textContent = message || '';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    let valid = true;

    if (!name) { setError('name', 'Please enter your name.'); valid = false; }
    else setError('name', '');

    if (!email) { setError('email', 'Please enter your email.'); valid = false; }
    else if (!isValidEmail(email)) { setError('email', 'Please enter a valid email address.'); valid = false; }
    else setError('email', '');

    if (!subject) { setError('subject', 'Please add a subject.'); valid = false; }
    else setError('subject', '');

    if (!message) { setError('message', 'Please write a message.'); valid = false; }
    else setError('message', '');

    if (!valid) {
      formStatus.textContent = 'Please fix the highlighted fields.';
      formStatus.className = 'form-status error';
      return;
    }

    // No backend is connected yet — this simulates a send.
    // Replace this block with a real fetch() call to your backend or form service.
    formStatus.textContent = `Thanks, ${name.split(' ')[0]}! Your message has been prepared — connect a backend to actually send it.`;
    formStatus.className = 'form-status success';
    form.reset();
  });

  /* ---------- 6. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 7. CUSTOM CURSOR (desktop only) ---------- */
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isTouchDevice && !prefersReducedMotion) {
    document.body.classList.add('has-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    });

    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .cert-card, .bento-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
  }

});