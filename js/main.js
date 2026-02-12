/* ============================================
   MK Portfolio — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // --- Navbar scroll effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });


  // --- Scroll reveal animations ---
  const revealElements = document.querySelectorAll(
    '.about__grid, .brands__col, .brands__photo, ' +
    '.gallery__category, .services__content, ' +
    '.casestudy__item, .contact__info'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxClose = lightbox.querySelector('.lightbox__close');

  const galleryItems = document.querySelectorAll('.gallery__item, .casestudy__item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // --- Pinch-zoom & pan state ---
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let startDist = 0;
  let startScale = 1;
  let startPanX = 0;
  let startPanY = 0;
  let startMidX = 0;
  let startMidY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;

  function resetTransform() {
    scale = 1;
    panX = 0;
    panY = 0;
    lightboxImg.style.transform = '';
  }

  function applyTransform() {
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function getTouchDist(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getTouchMid(t1, t2) {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  }

  lightboxImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      startDist = getTouchDist(e.touches[0], e.touches[1]);
      startScale = scale;
      const mid = getTouchMid(e.touches[0], e.touches[1]);
      startMidX = mid.x;
      startMidY = mid.y;
      startPanX = panX;
      startPanY = panY;
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      isPanning = true;
      panStartX = e.touches[0].clientX - panX;
      panStartY = e.touches[0].clientY - panY;
    }
  }, { passive: false });

  lightboxImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      scale = Math.min(Math.max(startScale * (dist / startDist), 1), 5);
      const mid = getTouchMid(e.touches[0], e.touches[1]);
      panX = startPanX + (mid.x - startMidX);
      panY = startPanY + (mid.y - startMidY);
      applyTransform();
    } else if (e.touches.length === 1 && isPanning && scale > 1) {
      e.preventDefault();
      panX = e.touches[0].clientX - panStartX;
      panY = e.touches[0].clientY - panStartY;
      applyTransform();
    }
  }, { passive: false });

  lightboxImg.addEventListener('touchend', (e) => {
    isPanning = false;
    if (scale <= 1.05) {
      resetTransform();
    }
  });

  // Double-tap to zoom
  let lastTap = 0;
  lightboxImg.addEventListener('touchend', (e) => {
    if (e.touches.length > 0) return;
    const now = Date.now();
    if (now - lastTap < 300) {
      e.preventDefault();
      if (scale > 1) {
        resetTransform();
      } else {
        scale = 2.5;
        applyTransform();
      }
    }
    lastTap = now;
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    resetTransform();
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  // Tap to close (only when not zoomed) — close unless tapping the close button
  lightbox.addEventListener('click', (e) => {
    if (scale > 1) return;
    if (e.target !== lightboxClose) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });


  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
