/* ========================================
   LENS MASTER - Professional Photography
   JavaScript Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // CAMERA INTRO ANIMATION
  // ========================================
  const cameraIntro = document.getElementById('cameraIntro');
  const focusBrackets = document.getElementById('focusBrackets');
  const shutterOverlay = document.getElementById('shutterOverlay');
  const flashOverlay = document.getElementById('flashOverlay');

  function runCameraIntro() {
    // Phase 1: Focus animation (already running via CSS)
    // Phase 2: Focus lock after 2s
    setTimeout(() => {
      focusBrackets.classList.add('focused');
    }, 2000);

    // Phase 3: Shutter closes at 2.8s
    setTimeout(() => {
      shutterOverlay.classList.add('active');
    }, 2800);

    // Phase 4: Flash burst at 3s
    setTimeout(() => {
      flashOverlay.classList.add('active');
    }, 3000);

    // Phase 5: Fade out camera intro at 3.5s
    setTimeout(() => {
      cameraIntro.classList.add('fade-out');
      document.body.classList.remove('intro-active');
    }, 3500);

    // Phase 6: Remove camera intro from DOM at 4.2s
    setTimeout(() => {
      cameraIntro.style.display = 'none';
      shutterOverlay.style.display = 'none';
      flashOverlay.style.display = 'none';
    }, 4200);
  }

  runCameraIntro();


  // ========================================
  // CUSTOM CURSOR
  // ========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth follow for ring
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    document.querySelectorAll('[data-cursor="hover"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.width = '0';
        cursorDot.style.height = '0';
        cursorRing.style.width = '60px';
        cursorRing.style.height = '60px';
        cursorRing.style.background = 'rgba(201, 168, 76, 0.1)';
        cursorRing.style.borderColor = '#dcc06a';
        cursorRing.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.width = '8px';
        cursorDot.style.height = '8px';
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.background = 'transparent';
        cursorRing.style.borderColor = '#c9a84c';
        cursorRing.style.opacity = '0.6';
      });
    });
  }


  // ========================================
  // NAVBAR
  // ========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navHamburger = document.getElementById('navHamburger');
  const navAnchors = document.querySelectorAll('.nav-links a');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile hamburger
  navHamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navHamburger.classList.toggle('active');
  });

  // Close mobile menu on link click
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navHamburger.classList.remove('active');
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id], footer[id]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);


  // ========================================
  // PARALLAX HERO
  // ========================================
  const heroBg = document.getElementById('heroBg');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
    }
  });


  // ========================================
  // GALLERY FILTER
  // ========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.transition = 'all 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });


  // ========================================
  // LIGHTBOX
  // ========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;

  function getVisibleImages() {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleImages();
      currentLightboxIndex = visibleItems.indexOf(item);
      const img = item.querySelector('img');
      lightboxImg.src = img.src.replace('w=600', 'w=1200');
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    const visibleItems = getVisibleImages();
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
    const img = visibleItems[currentLightboxIndex].querySelector('img');
    lightboxImg.src = img.src.replace('w=600', 'w=1200');
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    const visibleItems = getVisibleImages();
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
    const img = visibleItems[currentLightboxIndex].querySelector('img');
    lightboxImg.src = img.src.replace('w=600', 'w=1200');
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });


  // ========================================
  // STATS COUNTER (Intersection Observer)
  // ========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const suffix = el.querySelector('.suffix');
    const suffixText = suffix ? suffix.textContent : '';

    function update() {
      current += step;
      if (current >= target) {
        current = target;
        el.innerHTML = target + `<span class="suffix">${suffixText}</span>`;
        return;
      }
      el.innerHTML = Math.floor(current) + `<span class="suffix">${suffixText}</span>`;
      requestAnimationFrame(update);
    }

    update();
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(num => animateCounter(num));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }


  // ========================================
  // LAZY LOADING (IntersectionObserver)
  // ========================================
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        img.style.opacity = '1';
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });


  // ========================================
  // BOOKING FORM VALIDATION
  // ========================================
  const bookingForm = document.getElementById('bookingForm');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookName').value.trim();
    const email = document.getElementById('bookEmail').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const date = document.getElementById('bookDate').value;
    const packageVal = document.getElementById('bookPackage').value;
    const typeVal = document.getElementById('bookType').value;

    if (!name || !email || !phone || !date || !packageVal || !typeVal) {
      showFormMessage('يا ريت تملى كل الخانات المطلوبة.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage('يا ريت تكتب بريد إلكتروني صح.', 'error');
      return;
    }

    // Success
    showFormMessage('🎉 طلب الحجز اتبعت بنجاح! هنكلمك في خلال ٢٤ ساعة.', 'success');
    bookingForm.reset();
  });

  function showFormMessage(msg, type) {
    // Remove existing message
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.textContent = msg;
    messageDiv.style.cssText = `
      grid-column: 1 / -1;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
      animation: heroFadeUp 0.4s ease;
      ${type === 'success'
        ? 'background: rgba(76, 255, 114, 0.1); color: #4cff72; border: 1px solid rgba(76, 255, 114, 0.2);'
        : 'background: rgba(255, 76, 76, 0.1); color: #ff4c4c; border: 1px solid rgba(255, 76, 76, 0.2);'}
    `;

    bookingForm.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.opacity = '0';
      messageDiv.style.transition = 'opacity 0.3s ease';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }


  // ========================================
  // SMOOTH SCROLL for all anchor links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ========================================
  // INITIALIZE AOS
  // ========================================
  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    delay: 0,
  });

});
