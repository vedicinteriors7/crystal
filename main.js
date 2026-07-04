/**
 * Crystal Services - Main JavaScript File
 * Author: Crystal Services Web Team
 * Version: 1.0.0
 */

/* ================================================================
   1. PRELOADER
   ================================================================ */
window.addEventListener('load', function () {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 1500);
  }
});

/* ================================================================
   2. STICKY HEADER ON SCROLL
   ================================================================ */
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });
}

/* ================================================================
   3. HAMBURGER MOBILE MENU
   ================================================================ */
const hamburger   = document.getElementById('hamburger');
const mobileNav   = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
}

if (mobileClose) {
  mobileClose.addEventListener('click', closeMobileNav);
}

// Close on link click
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

function closeMobileNav() {
  if (hamburger) hamburger.classList.remove('active');
  if (mobileNav) mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

/* ================================================================
   4. ACTIVE NAV LINK HIGHLIGHT
   ================================================================ */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ================================================================
   5. SMOOTH SCROLL FOR ANCHOR LINKS
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = siteHeader ? siteHeader.offsetHeight : 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  });
});

/* ================================================================
   6. SCROLL REVEAL ANIMATIONS
   ================================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ================================================================
   7. COUNTER ANIMATION (STATS)
   ================================================================ */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start    = performance.now();
  const from     = 0;

  function update(time) {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.floor(from + (target - from) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl  = entry.target.querySelector('.stat-number-count');
      if (numEl && !numEl.dataset.animated) {
        numEl.dataset.animated = '1';
        const target = parseInt(numEl.dataset.target, 10);
        const suffix = numEl.dataset.suffix || '';
        animateCounter(numEl, target, suffix);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => {
  statsObserver.observe(el);
});

/* ================================================================
   8. FAQ ACCORDION
   ================================================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  }
});

/* ================================================================
   9. CONTACT FORM → WHATSAPP
   ================================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('formName').value.trim();
    const phone   = document.getElementById('formPhone').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !phone || !service || !message) {
      showFormMessage('Please fill in all fields.', 'error');
      return;
    }

    const waNumber = '919666112814';
    const waText   = encodeURIComponent(
      `Hello Crystal Services,\n\nMy name is ${name}.\nPhone: ${phone}\nService Required: ${service}\nMessage: ${message}\n\nI want a free quotation.`
    );
    const waUrl    = `https://wa.me/${waNumber}?text=${waText}`;

    window.open(waUrl, '_blank');
    contactForm.reset();
    showFormMessage('Opening WhatsApp… we will respond shortly!', 'success');
  });
}

function showFormMessage(msg, type) {
  const existing = document.getElementById('formMsg');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'formMsg';
  el.style.cssText = `
    margin-top: 14px;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    ${type === 'success'
      ? 'background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;'
      : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'}
  `;
  el.textContent = msg;
  contactForm.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

/* ================================================================
   10. GALLERY LIGHTBOX
   ================================================================ */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ================================================================
   11. BACK TO TOP BUTTON
   ================================================================ */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================================
   12. GALLERY FILTER (Gallery Page)
   ================================================================ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        setTimeout(() => { item.style.opacity = '1'; }, 10);
      } else {
        item.style.opacity = '0';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ================================================================
   13. FLOATING WHATSAPP TOOLTIP
   ================================================================ */
const floatWA   = document.querySelector('.floating-whatsapp');
const floatTip  = document.querySelector('.float-tooltip');

if (floatWA && floatTip) {
  let showTimeout;
  floatWA.addEventListener('mouseenter', () => {
    showTimeout = setTimeout(() => {
      floatTip.style.opacity = '1';
    }, 300);
  });
  floatWA.addEventListener('mouseleave', () => {
    clearTimeout(showTimeout);
    floatTip.style.opacity = '0';
  });
}

/* ================================================================
   14. HERO PARALLAX (subtle)
   ================================================================ */
const heroRight = document.querySelector('.hero-right img');
if (heroRight) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroRight.style.transform = `translateY(${scrollY * 0.15}px)`;
  });
}

/* ================================================================
   15. SERVICE CARD WHATSAPP LINKS
   ================================================================ */
document.querySelectorAll('.service-wa-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const serviceName = link.dataset.service || 'Your Service';
    const waNumber = '919666112814';
    const waText   = encodeURIComponent(
      `Hello Crystal Services,\n\nI am interested in: ${serviceName}\nPlease share more details and pricing.\n\nThank you.`
    );
    window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
  });
});
