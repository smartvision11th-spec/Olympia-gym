/* ═══════════════════════════════════════════
   OLYMPIA GYM — script.js
   Sections covered:
   1. Utility helpers
   2. Intro sequence (typewriter + fade out)
   3. Lucide icons init
   4. Navigation (hamburger, overlay, scroll-header)
   5. Hero reveal (2-second delay)
   6. Scroll-reveal (IntersectionObserver)
   7. Sticky logo
   8. Back-to-top button
   9. Team carousel (auto-slide + dots)
   10. Testimonials carousel (auto-slide + dots)
   11. Pricing plan → booking form pre-fill
   12. Booking form → WhatsApp deep link + modal
   13. BMI calculator (gauge + advice)
   14. Footer year
   15. Lazy-load video
   16. Reduced-motion guard
═══════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. UTILITY HELPERS
───────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function debounce(fn, ms = 100) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/* Respect prefers-reduced-motion */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────
   2. INTRO SEQUENCE
───────────────────────────────────────── */
(function initIntro() {
  const overlay  = $('#intro-overlay');
  const line     = $('#typewriter-line');
  if (!overlay || !line) return;

  /* Lines to type out one-by-one */
  const lines = [
    'Namaste! 🙏',
    'Aapka swagat hai...',
    'Mr. Om Pandit ke saath',
    'OLYMPIA GYM mein!',
    'Agra ka sabse premium fitness destination.',
    '"Apni body banao, apni zindagi badlo."'
  ];

  let lineIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let typeTimer;

  function type() {
    const current = lines[lineIndex];

    if (!isDeleting) {
      line.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        /* Pause at end of line */
        if (lineIndex === lines.length - 1) {
          /* Last line — hold then fade out overlay */
          clearTimeout(typeTimer);
          setTimeout(fadeOutIntro, 1400);
          return;
        }
        clearTimeout(typeTimer);
        typeTimer = setTimeout(() => { isDeleting = true; type(); }, 900);
        return;
      }
    } else {
      line.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        lineIndex++;
        clearTimeout(typeTimer);
        typeTimer = setTimeout(type, 250);
        return;
      }
    }

    const speed = isDeleting ? 40 : 65;
    typeTimer = setTimeout(type, speed);
  }

  function fadeOutIntro() {
    overlay.style.transition = 'opacity 0.8s ease';
    overlay.style.opacity    = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      /* Trigger hero reveal after intro gone */
      triggerHeroReveal();
    }, 820);
  }

  /* Start typing after brief hold */
  setTimeout(type, 700);
})();

/* ─────────────────────────────────────────
   3. LUCIDE ICONS INIT
───────────────────────────────────────── */
function initIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* Icons need re-init after DOM mutations (carousels clone etc.) */
document.addEventListener('DOMContentLoaded', initIcons);

/* ─────────────────────────────────────────
   4. NAVIGATION
───────────────────────────────────────── */
(function initNav() {
  const header    = $('#site-header');
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');
  const navClose  = $('#nav-close');
  const navOverlay = $('#nav-overlay');
  const navLinks  = $$('.nav-link');

  if (!header || !hamburger || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('open');
    navMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navOverlay && navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay && navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  navClose && navClose.addEventListener('click', closeMenu);
  navOverlay && navOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* Escape key closes nav */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Header scroll style */
  const onScroll = debounce(() => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────
   5. HERO REVEAL (triggered after intro)
───────────────────────────────────────── */
function triggerHeroReveal() {
  const hero = $('#hero');
  if (!hero) return;

  const overlay = $('#hero-overlay');

  /* Fade in overlay after 2s of clean hero photo */
  setTimeout(() => {
    overlay && (overlay.style.opacity = '1');
    hero.classList.add('revealed');
  }, 2000);
}

/* ─────────────────────────────────────────
   6. SCROLL-REVEAL (IntersectionObserver)
───────────────────────────────────────── */
(function initScrollReveal() {
  if (prefersReducedMotion) return;

  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────
   7. STICKY LOGO (shows after hero)
───────────────────────────────────────── */
(function initStickyLogo() {
  const logo = $('#sticky-logo');
  if (!logo) return;

  const onScroll = debounce(() => {
    const heroH = $('#hero') ? $('#hero').offsetHeight : 400;
    if (window.scrollY > heroH * 0.7) {
      logo.classList.add('visible');
    } else {
      logo.classList.remove('visible');
    }
  }, 80);

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────
   8. BACK-TO-TOP BUTTON
───────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  const onScroll = debounce(() => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 80);

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────
   9. TEAM CAROUSEL
───────────────────────────────────────── */
(function initTeamCarousel() {
  const carousel = $('#team-carousel');
  const prevBtn  = $('#team-prev');
  const nextBtn  = $('#team-next');
  const dotsWrap = $('#team-dots');

  if (!carousel) return;

  const cards        = $$('.team-card', carousel);
  const total        = cards.length;
  let   current      = 0;
  let   autoTimer;

  /* Build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className    = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to trainer ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap && dotsWrap.appendChild(dot);
  });

  function getSlidesPerView() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 540) return 2;
    return 1;
  }

  function goTo(index) {
    const spv    = getSlidesPerView();
    const maxIdx = Math.max(0, total - spv);
    current      = clamp(index, 0, maxIdx);

    /* Shift by card width percentage */
    const pct    = (100 / spv) * current;
    carousel.style.transform = `translateX(-${pct}%)`;

    /* Update dots */
    $$('.carousel-dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1 < total - getSlidesPerView() + 1 ? current + 1 : 0); }
  function prev() { goTo(current - 1 >= 0 ? current - 1 : Math.max(0, total - getSlidesPerView())); }

  nextBtn && nextBtn.addEventListener('click', () => { resetAuto(); next(); });
  prevBtn && prevBtn.addEventListener('click', () => { resetAuto(); prev(); });

  function startAuto() {
    autoTimer = setInterval(next, 3500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  /* Recalc on resize */
  window.addEventListener('resize', debounce(() => goTo(current), 150));

  /* Touch swipe */
  addSwipe(carousel, next, prev);
})();

/* ─────────────────────────────────────────
   10. TESTIMONIALS CAROUSEL
───────────────────────────────────────── */
(function initTestiCarousel() {
  const carousel = $('#testi-carousel');
  const prevBtn  = $('#testi-prev');
  const nextBtn  = $('#testi-next');
  const dotsWrap = $('#testi-dots');

  if (!carousel) return;

  const cards   = $$('.testi-card', carousel);
  const total   = cards.length;
  let   current = 0;
  let   autoTimer;

  /* Build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className    = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap && dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = ((index % total) + total) % total;
    carousel.style.transform = `translateX(-${current * 100}%)`;

    $$('.carousel-dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn && nextBtn.addEventListener('click', () => { resetAuto(); next(); });
  prevBtn && prevBtn.addEventListener('click', () => { resetAuto(); prev(); });

  function startAuto() { autoTimer = setInterval(next, 4500); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  startAuto();

  addSwipe(carousel, next, prev);
})();

/* ─────────────────────────────────────────
   SHARED: Touch swipe helper
───────────────────────────────────────── */
function addSwipe(el, onNext, onPrev) {
  let startX = null;
  el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (startX === null) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? onNext() : onPrev();
    startX = null;
  }, { passive: true });
}

/* ─────────────────────────────────────────
   11. PRICING → BOOKING FORM PRE-FILL
───────────────────────────────────────── */
(function initPricingButtons() {
  const planBtns = $$('.plan-btn');
  const planSelect = $('#f-plan');

  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card   = btn.closest('.pricing-card');
      const plan   = card ? card.dataset.plan : '';

      if (planSelect && plan) {
        planSelect.value = plan;
      }

      /* Scroll to booking form */
      const form = $('#booking-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ─────────────────────────────────────────
   12. BOOKING FORM → WHATSAPP + MODAL
───────────────────────────────────────── */
(function initBookingForm() {
  const submitBtn   = $('#btn-submit-form');
  const modal       = $('#confirm-modal');
  const backdrop    = $('#modal-backdrop');
  const modalClose  = $('#modal-close');
  const modalMsg    = $('#modal-message');

  if (!submitBtn) return;

  let pendingWaUrl = '';

  submitBtn.addEventListener('click', () => {
    /* Gather & validate */
    const name    = $('#f-name')?.value.trim();
    const gender  = $('#f-gender')?.value;
    const age     = $('#f-age')?.value.trim();
    const mobile  = $('#f-mobile')?.value.trim();
    const plan    = $('#f-plan')?.value;
    const date    = $('#f-date')?.value;
    const msg     = $('#f-message')?.value.trim();

    /* Collect selected services */
    const services = $$('input[type="checkbox"]:checked')
      .map(cb => cb.value)
      .join(', ') || 'None selected';

    /* Basic validation */
    if (!name)   { shakeField('#f-name');   return; }
    if (!gender) { shakeField('#f-gender'); return; }
    if (!age)    { shakeField('#f-age');    return; }
    if (!mobile || mobile.length < 10) { shakeField('#f-mobile'); return; }
    if (!plan)   { shakeField('#f-plan');   return; }
    if (!date)   { shakeField('#f-date');   return; }

    /* Build WhatsApp message */
    const waText = encodeURIComponent(
`🏋️ New Membership Enquiry — OLYMPIA GYM

👤 Name: ${name}
⚧ Gender: ${gender}
🎂 Age: ${age}
📱 Mobile: ${mobile}
💳 Plan: ${plan}
📅 Joining Date: ${date}
🏃 Services: ${services}
💬 Message: ${msg || '—'}

Sent via olympiagym.in`
    );

    pendingWaUrl = `https://wa.me/919897417774?text=${waText}`;

    /* Show modal */
    if (modalMsg) {
      modalMsg.textContent = `You are now a ${plan} member of OLYMPIA GYM. Our team will contact you soon.`;
    }

    modal   && modal.classList.add('active');
    backdrop && backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  /* Modal close / WhatsApp redirect */
  function closeModal() {
    modal   && modal.classList.remove('active');
    backdrop && backdrop.classList.remove('active');
    document.body.style.overflow = '';

    if (pendingWaUrl) {
      window.open(pendingWaUrl, '_blank', 'noopener,noreferrer');
      pendingWaUrl = '';
    }
  }

  modalClose  && modalClose.addEventListener('click', closeModal);
  backdrop    && backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
  });

  /* Re-initialise icons inside modal */
  initIcons();
})();

/* Field shake animation for validation */
function shakeField(selector) {
  const el = $(selector);
  if (!el) return;

  el.style.animation = 'none';
  el.offsetHeight; /* reflow */
  el.style.animation = 'shake .35s ease';
  el.focus();

  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

/* Inject shake keyframe */
(function injectShake() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{ transform: translateX(0); }
      20%    { transform: translateX(-8px); }
      40%    { transform: translateX(8px); }
      60%    { transform: translateX(-5px); }
      80%    { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────
   13. BMI CALCULATOR
───────────────────────────────────────── */
(function initBMI() {
  const calcBtn    = $('#btn-calc-bmi');
  const resultWrap = $('#bmi-result');
  const bmiNumber  = $('#bmi-number');
  const bmiCat     = $('#bmi-category');
  const bmiAdvice  = $('#bmi-advice');
  const bmiNeedle  = $('#bmi-needle');
  const bmiJoinBtn = $('#bmi-join-btn');

  if (!calcBtn) return;

  calcBtn.addEventListener('click', () => {
    const h = parseFloat($('#bmi-height')?.value);
    const w = parseFloat($('#bmi-weight')?.value);

    if (!h || !w || h < 50 || w < 10) {
      shakeField('#bmi-height');
      shakeField('#bmi-weight');
      return;
    }

    const hM  = h / 100;
    const bmi = +(w / (hM * hM)).toFixed(1);

    let category, advice, needleAngle;

    if (bmi < 18.5) {
      category    = 'Underweight';
      advice      = `Your BMI is ${bmi}. Your body needs more strength and mass. Joining Olympia Gym will help you gain healthy weight with a structured diet plan and guided weight training programme tailored to your needs.`;
      needleAngle = -90 + clamp(((bmi - 10) / 8.5) * 45, 0, 44);
    } else if (bmi < 25) {
      category    = 'Normal Weight';
      advice      = `Your BMI is ${bmi} — great foundation! But there's always a next level. Joining Olympia Gym will help you tone your physique, build lean muscle, and maintain peak fitness with professional coaching.`;
      needleAngle = -45 + clamp(((bmi - 18.5) / 6.5) * 45, 0, 44);
    } else if (bmi < 30) {
      category    = 'Overweight';
      advice      = `Your BMI is ${bmi}. The good news? You're in control. Joining Olympia Gym with a structured cardio + weight programme and diet guidance will help you slim down effectively and sustainably.`;
      needleAngle = 0 + clamp(((bmi - 25) / 5) * 45, 0, 44);
    } else {
      category    = 'Obese';
      advice      = `Your BMI is ${bmi}. Don't worry — every journey starts with a single step. Our trainers at Olympia Gym specialise in guided fat-loss programmes with full personal support. Start today and transform your life.`;
      needleAngle = 45 + clamp(((bmi - 30) / 10) * 45, 0, 44);
    }

    /* Update UI */
    if (bmiNumber)  bmiNumber.textContent  = bmi;
    if (bmiCat)     bmiCat.textContent     = category;
    if (bmiAdvice)  bmiAdvice.textContent  = advice;
    if (bmiNeedle)  bmiNeedle.style.transform = `translateX(-50%) rotate(${needleAngle}deg)`;
    if (bmiJoinBtn) bmiJoinBtn.style.display = 'inline-flex';

    resultWrap && resultWrap.classList.add('show');
    initIcons();
  });

  /* Allow Enter key to trigger calc */
  ['bmi-height', 'bmi-weight'].forEach(id => {
    const el = document.getElementById(id);
    el && el.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcBtn.click();
    });
  });
})();

/* ─────────────────────────────────────────
   14. FOOTER YEAR
───────────────────────────────────────── */
(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─────────────────────────────────────────
   15. LAZY-LOAD VIDEO (IntersectionObserver)
───────────────────────────────────────── */
(function lazyLoadVideo() {
  const video = $('#tour-video');
  if (!video) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* Load the video source now */
        const source = video.querySelector('source');
        if (source && source.dataset.src) {
          source.src = source.dataset.src;
          video.load();
        }
        /* Try play (muted autoplay) */
        video.play().catch(() => {});
        observer.unobserve(video);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(video);
})();

/* ─────────────────────────────────────────
   16. REDUCED-MOTION: disable auto carousels
───────────────────────────────────────── */
(function respectReducedMotion() {
  if (!prefersReducedMotion) return;

  /* Pause all auto-interval carousels by stopping CSS transitions */
  $$('.team-carousel, .testi-carousel').forEach(el => {
    el.style.transition = 'none';
  });
})();

/* ─────────────────────────────────────────
   SMOOTH SCROLL for all anchor hash links
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────
   3D TILT on cards (desktop only, subtle)
───────────────────────────────────────── */
(function initCardTilt() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; /* skip on touch devices */

  $$('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const maxRot = 5;

      card.style.transform = `perspective(600px) rotateY(${dx * maxRot}deg) rotateX(${-dy * maxRot}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.05s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease';
    });
  });
})();

/* ─────────────────────────────────────────
   RE-INIT ICONS after all JS runs
───────────────────────────────────────── */
window.addEventListener('load', () => {
  initIcons();
});
