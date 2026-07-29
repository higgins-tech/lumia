(function () {
  'use strict';

  /* =========================================================
     MOBILE NAV — hamburger opens full screen drawer, converts to X
     ========================================================= */
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  function openNav() {
    navLinks.classList.add('is-open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });
  navLinkItems.forEach((link) => {
    link.addEventListener('click', () => closeNav());
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeNav();
  });

  /* =========================================================
     STICKY NAV — subtle opacity/blur increase on scroll
     ========================================================= */
  const siteHeader = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      siteHeader.style.background = 'rgba(10, 10, 10, 0.78)';
    } else {
      siteHeader.style.background = 'rgba(10, 10, 10, 0.55)';
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* =========================================================
     HERO ROTATING TEXT
     ========================================================= */
  const rotatingPhrases = [
    'À travers le globe',
    'Através do globo',
    'Across the globe',
    'По всему земному шару'
  ];
  const rotatingEl = document.getElementById('heroRotating');
  let rotatingIndex = 0;

  function setRotatingText() {
    rotatingEl.textContent = rotatingPhrases[rotatingIndex];
  }
  setRotatingText();

  function rotateText() {
    rotatingEl.classList.add('is-fading');
    setTimeout(() => {
      rotatingIndex = (rotatingIndex + 1) % rotatingPhrases.length;
      setRotatingText();
      rotatingEl.classList.remove('is-fading');
      rotatingEl.classList.add('is-visible');
    }, 250);
  }
  setInterval(rotateText, 2000);

  /* =========================================================
     EXPLORE BUTTON — scroll to next section
     ========================================================= */
  const exploreBtn = document.getElementById('exploreBtn');
  exploreBtn.addEventListener('click', () => {
    const target = document.getElementById('cta-actions');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });

  /* =========================================================
     MARQUEE — populate + duplicate for seamless infinite loop
     ========================================================= */
  const marqueeTrack = document.getElementById('marqueeTrack');
  const partnerImages = [
    'img/1invchmarquee.png', 'img/bitgetmarque.png', 'img/bnbmarquee.png',
    'img/cgoldmarq.png', 'img/cryptocommarquee.png', 'img/dfwmarquee.png',
    'img/kucoinmarquee.png', 'img/microsoftmarquee.png', 'img/polygonmarquee.png'
  ];
  function buildMarquee() {
    const set = partnerImages.map((src) => {
      const div = document.createElement('div');
      div.className = 'marquee-item';

      const img = document.createElement('img');
      img.src = src;
      img.alt = '';

      div.appendChild(img);
      return div;
    });
    // duplicate the set twice for a seamless -50% translate loop
    [...set, ...set.map((n) => n.cloneNode(true))].forEach((el) => marqueeTrack.appendChild(el));
  }
  buildMarquee();

  /* =========================================================
     GENERIC CAROUSEL CONTROLLER
     used for Testimonials and What's New sections
     ========================================================= */
  function createCarousel({ items, prevBtn, nextBtn, countEl, progressEl, activeClass = 'is-active', trackEl = null }) {
    let index = Array.from(items).findIndex((el) => el.classList.contains(activeClass));
    if (index < 0) index = 0;
    const total = items.length;

    function render() {
      items.forEach((el, i) => el.classList.toggle(activeClass, i === index));
      if (countEl) countEl.textContent = `${index + 1} / ${total}`;
      if (progressEl) progressEl.style.width = `${((index + 1) / total) * 100}%`;
      if (trackEl) {
        const activeEl = items[index];
        const scrollContainer = trackEl.parentElement;
        if (activeEl && scrollContainer) {
          const offset = activeEl.offsetLeft - scrollContainer.offsetLeft;
          scrollContainer.scrollTo({ left: offset, behavior: 'smooth' });
        }
      }
    }
    function go(delta) {
      index = (index + delta + total) % total;
      render();
    }
    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));
    render();
    return { go, render };
  }

  // Testimonials
  const testimonialItems = document.querySelectorAll('.testimonial-card');
  createCarousel({
    items: testimonialItems,
    prevBtn: document.getElementById('testimonialPrev'),
    nextBtn: document.getElementById('testimonialNext'),
    countEl: document.getElementById('testimonialCount'),
    progressEl: document.getElementById('testimonialProgress')
  });

  // What's New — arrows scroll the horizontal track by one card
  const newsTrack = document.getElementById('newsTrack');
  const newsCards = document.querySelectorAll('.news-card');
  createCarousel({
    items: newsCards,
    prevBtn: document.getElementById('newsPrev'),
    nextBtn: document.getElementById('newsNext'),
    countEl: document.getElementById('newsCount'),
    progressEl: document.getElementById('newsProgress'),
    trackEl: newsTrack
  });

  /* =========================================================
     PRODUCTS CAROUSEL — click a card to make it active + update header
     ========================================================= */
  const productCards = document.querySelectorAll('.product-card');
  const productTitle = document.getElementById('productTitle');
  const productSub = document.getElementById('productSub');
  const productsTrack = document.getElementById('productsTrack');

  productCards.forEach((card) => {
    card.addEventListener('click', () => {
      productCards.forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
      productTitle.textContent = (card.dataset.title || '').toUpperCase();
      productSub.textContent = card.dataset.sub || '';
      const offset = card.offsetLeft - productsTrack.parentElement.offsetLeft - 24;
      productsTrack.parentElement.scrollTo({ left: offset, behavior: 'smooth' });
    });
  });

  /* =========================================================
     FOOTER FORM — prevent actual submission (placeholder behavior)
     ========================================================= */
  const footerForm = document.getElementById('footerForm');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = footerForm.querySelector('input');
      if (input && input.value) {
        input.value = '';
        input.placeholder = 'Thanks — we\u2019ll be in touch!';
      }
    });
  }

  /* =========================================================
     SMOOTH ANCHOR SCROLL OFFSET (account for fixed header)
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const headerH = siteHeader.offsetHeight;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
})();
