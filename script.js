/* ═══════════════════════════════════════════════════════════════
   BIOTECHNOLOGY — Interactive Script
   DNA Canvas · GSAP Animations · Navigation · Interactions
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Utility: Safe query ───
  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }
  function $$(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. DNA HELIX CANVAS ANIMATION
  // ═══════════════════════════════════════════════════════════════
  function initDNACanvas() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const canvas = $('#dna-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width, height, particles, scrollY = 0, animationId;
      const PARTICLE_COUNT = 60;
      const HELIX_AMPLITUDE = 80;
      const HELIX_FREQUENCY = 0.015;
      const HELIX_SPEED = 0.0008;
      let time = 0;

      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }

      function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.3 + 0.05,
            drift: (Math.random() - 0.5) * 0.3,
          });
        }
      }

      function drawHelix() {
        const centerX = width * 0.92;
        const helixHeight = height;
        const step = 4;
        const scrollOffset = scrollY * 0.15;

        ctx.lineWidth = 1;

        // Draw base pairs first (behind strands)
        for (let y = 0; y < helixHeight; y += 30) {
          const adjustedY = y + scrollOffset;
          const phase = adjustedY * HELIX_FREQUENCY + time;
          const x1 = centerX + Math.sin(phase) * HELIX_AMPLITUDE;
          const x2 = centerX + Math.sin(phase + Math.PI) * HELIX_AMPLITUDE;
          const depth = (Math.cos(phase) + 1) * 0.5;

          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `rgba(0, 214, 143, ${0.04 + depth * 0.04})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Node dots at ends
          const nodeSize = 2 + depth * 2;
          ctx.beginPath();
          ctx.arc(x1, y, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 245, 212, ${0.1 + depth * 0.15})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x2, y, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 214, 143, ${0.1 + depth * 0.15})`;
          ctx.fill();
        }

        // Strand 1
        ctx.beginPath();
        for (let y = 0; y < helixHeight; y += step) {
          const adjustedY = y + scrollOffset;
          const phase = adjustedY * HELIX_FREQUENCY + time;
          const x = centerX + Math.sin(phase) * HELIX_AMPLITUDE;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(0, 214, 143, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Strand 2
        ctx.beginPath();
        for (let y = 0; y < helixHeight; y += step) {
          const adjustedY = y + scrollOffset;
          const phase = adjustedY * HELIX_FREQUENCY + time + Math.PI;
          const x = centerX + Math.sin(phase) * HELIX_AMPLITUDE;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      function drawParticles() {
        particles.forEach(function (p) {
          p.y -= p.speed;
          p.x += p.drift;
          if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
          if (p.x < -10 || p.x > width + 10) { p.x = Math.random() * width; }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 214, 143, ' + p.opacity + ')';
          ctx.fill();
        });
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);
        time += HELIX_SPEED;
        drawHelix();
        drawParticles();
        animationId = requestAnimationFrame(animate);
      }

      window.addEventListener('resize', function () {
        resize();
        createParticles();
      });

      window.addEventListener('scroll', function () {
        scrollY = window.pageYOffset;
      }, { passive: true });

      resize();
      createParticles();
      animate();
    } catch (err) {
      console.warn('DNA Canvas init failed:', err);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 2. GSAP ANIMATIONS
  // ═══════════════════════════════════════════════════════════════
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP not loaded. Showing content without animations.');
      showAllContent();
      return;
    }

    try {
      gsap.registerPlugin(ScrollTrigger);

      // ─── Hero Entrance ───
      var heroTL = gsap.timeline({ delay: 0.3 });

      heroTL
        .to('.hero-glow', {
          opacity: function (i) { return [0.08, 0.06, 0.05][i]; },
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.2
        })
        .to('#hero-tag', {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, 0.2)
        .to('.hero-title-line', {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out'
        }, 0.4)
        .to('#hero-subtitle', {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: startTypingEffect
        }, 1.2)
        .to('#hero-metrics', {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: animateMetrics
        }, 1.6)
        .to('.hero-scroll-indicator', {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, 2.0);

      // ─── Navigation Appear ───
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom 80%',
        onEnter: function () {
          var nav = $('#main-nav');
          if (nav) {
            nav.classList.add('is-visible', 'is-scrolled');
          }
        },
        onLeaveBack: function () {
          var nav = $('#main-nav');
          if (nav) {
            nav.classList.remove('is-visible', 'is-scrolled');
          }
        }
      });

      // ─── Section Headers ───
      $$('.section-header').forEach(function (header) {
        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            once: true
          }
        });

        var num = header.querySelector('.section-number');
        var title = header.querySelector('.section-title');
        var line = header.querySelector('.section-accent-line');
        var subtitle = header.querySelector('.section-subtitle');

        if (num) tl.to(num, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
        if (title) tl.to(title, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.1);
        if (line) tl.to(line, { width: '80px', duration: 0.6, ease: 'power2.out' }, 0.4);
        if (subtitle) tl.to(subtitle, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.5);
      });

      // ─── Subsection Titles ───
      $$('.subsection-title').forEach(function (el) {
        gsap.to(el, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
      });

      // ─── Intro Block ───
      var introBlock = $('#intro-block');
      if (introBlock) {
        var introTL = gsap.timeline({
          scrollTrigger: {
            trigger: introBlock,
            start: 'top 80%',
            once: true
          }
        });
        introTL.to(introBlock, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0);

        // Animate DNA SVG paths
        introTL.to('.dna-path-1, .dna-path-2', {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          stagger: 0.3
        }, 0.4);
      }

      // ─── Benefit Cards ───
      $$('.benefit-card').forEach(function (card, i) {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });
      });

      // ─── Concept Cards ───
      $$('.concept-card').forEach(function (card, i) {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });
      });

      // ─── Product Cards ───
      $$('.product-card').forEach(function (card, i) {
        var isLeft = card.classList.contains('product-card--left');
        gsap.fromTo(card,
          { opacity: 0, x: isLeft ? -60 : 60, rotate: isLeft ? -2 : 2 },
          {
            opacity: 1,
            x: 0,
            rotate: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true }
          }
        );
      });

      // ─── Team and Blog Cards ───
      $$('.team-card, .blog-post').forEach(function (card, i) {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: (i % 3) * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true }
        });
      });

      // ─── Section Dividers (wave draw) ───
      $$('.divider-wave').forEach(function (wave) {
        gsap.to(wave, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: wave, start: 'top 95%', once: true }
        });
      });

      // ─── Reference Items ───
      $$('.reference-item').forEach(function (item, i) {
        gsap.to(item, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: i * 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 90%', once: true }
        });
      });

    } catch (err) {
      console.warn('GSAP animations init failed:', err);
      showAllContent();
    }
  }

  // Fallback: show all content if GSAP fails
  function showAllContent() {
      var hiddenElements = $$('[style*="opacity: 0"], .hero-title-line, .hero-tag, #hero-subtitle, #hero-metrics, .hero-scroll-indicator, .section-number, .section-title, .section-accent-line, .section-subtitle, .subsection-title, #intro-block, .benefit-card, .concept-card, .product-card, .reference-item, .team-card, .blog-post');
    hiddenElements.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    $$('.section-accent-line').forEach(function (el) { el.style.width = '80px'; });

    // Show nav
    var nav = $('#main-nav');
    if (nav) nav.classList.add('is-visible', 'is-scrolled');

    startTypingEffect();
  }


  // ═══════════════════════════════════════════════════════════════
  // 3. TYPING EFFECT
  // ═══════════════════════════════════════════════════════════════
  function startTypingEffect() {
    try {
      var subtitleEl = $('#hero-subtitle');
      if (!subtitleEl) return;

      var fullText = 'Explora los fundamentos celulares, bioprocesos de vanguardia y las aplicaciones biotecnológicas que transformaron el mundo.';
      var cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '';
      subtitleEl.textContent = '';
      subtitleEl.appendChild(cursor);

      var charIndex = 0;
      var typingSpeed = 28;

      function typeChar() {
        if (charIndex < fullText.length) {
          subtitleEl.insertBefore(
            document.createTextNode(fullText[charIndex]),
            cursor
          );
          charIndex++;
          setTimeout(typeChar, typingSpeed);
        } else {
          // Keep cursor blinking for 3 seconds then remove
          setTimeout(function () {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 3000);
        }
      }

      typeChar();
    } catch (err) {
      console.warn('Typing effect failed:', err);
      var el = $('#hero-subtitle');
      if (el) el.textContent = 'Explora los fundamentos celulares, bioprocesos de vanguardia y las aplicaciones biotecnológicas que transformaron el mundo.';
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 4. METRIC COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════════════
  function animateMetrics() {
    try {
      $$('.hero-metric-value').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;

        var duration = 2000;
        var start = performance.now();
        var startVal = 0;

        function update(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(startVal + (target - startVal) * eased);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
      });
    } catch (err) {
      console.warn('Metric counter failed:', err);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 5. NAVIGATION
  // ═══════════════════════════════════════════════════════════════
  function initNavigation() {
    try {
      // Smooth scroll for nav links
      $$('.nav-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var targetId = this.getAttribute('href');
          var target = $(targetId);
          if (target) {
            var offset = 80;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
          }

          // Close mobile menu
          var links = $('#nav-links');
          var toggle = $('#nav-mobile-toggle');
          if (links) links.classList.remove('is-open');
          if (toggle) {
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // Active section tracking
      var sections = $$('section[id]');
      var navLinks = $$('.nav-link');

      function updateActiveSection() {
        var scrollPos = window.pageYOffset + 150;

        sections.forEach(function (section) {
          var top = section.offsetTop;
          var height = section.offsetHeight;
          var id = section.getAttribute('id');

          if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(function (link) {
              link.classList.remove('is-active');
              if (link.getAttribute('data-section') === id) {
                link.classList.add('is-active');
              }
            });
          }
        });
      }

      window.addEventListener('scroll', updateActiveSection, { passive: true });

      // Mobile toggle
      var mobileToggle = $('#nav-mobile-toggle');
      var navLinksEl = $('#nav-links');
      if (mobileToggle && navLinksEl) {
        mobileToggle.addEventListener('click', function () {
          var isOpen = navLinksEl.classList.toggle('is-open');
          mobileToggle.classList.toggle('is-open');
          mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      }

      // Close mobile menu with Escape and return focus to the toggle
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var links = $('#nav-links');
        var toggle = $('#nav-mobile-toggle');
        if (links && links.classList.contains('is-open')) {
          links.classList.remove('is-open');
          if (toggle) {
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
          }
        }
      });

      // Hero logo scroll
      var heroLogo = $('#nav-logo');
      if (heroLogo) {
        heroLogo.addEventListener('click', function (e) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    } catch (err) {
      console.warn('Navigation init failed:', err);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 6. CARD INTERACTIONS
  // ═══════════════════════════════════════════════════════════════
  function initCardInteractions() {
    try {
      // Mouse glow effect on cards
      $$('.concept-card, .product-card-inner').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', x + 'px');
          card.style.setProperty('--mouse-y', y + 'px');
        });
      });

      // Product toggle (expand/collapse)
      $$('.product-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetId = this.getAttribute('data-target');
          var detail = document.getElementById(targetId);
          if (!detail) return;

          var isOpen = detail.classList.toggle('is-open');
          this.classList.toggle('is-open', isOpen);
          this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

          var textEl = this.querySelector('.product-toggle-text');
          if (textEl) {
            textEl.textContent = isOpen ? 'Leer menos' : 'Leer más';
          }

          // GSAP animation if available
          if (typeof gsap !== 'undefined') {
            if (isOpen) {
              gsap.fromTo(detail, { maxHeight: 0 }, { maxHeight: 800, duration: 0.5, ease: 'power2.out' });
            } else {
              gsap.to(detail, { maxHeight: 0, duration: 0.4, ease: 'power2.in' });
            }
          }
        });
      });
    } catch (err) {
      console.warn('Card interactions init failed:', err);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 7. LUCIDE ICONS
  // ═══════════════════════════════════════════════════════════════
  function initLucideIcons() {
    try {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    } catch (err) {
      console.warn('Lucide icons init failed:', err);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 8. LENIS SMOOTH SCROLL
  // ═══════════════════════════════════════════════════════════════
  function initLenis() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (typeof Lenis === 'undefined') return;

      var lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        orientation: 'vertical',
        smoothWheel: true
      });

      // Connect Lenis to GSAP ScrollTrigger
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        // Standalone RAF loop
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (err) {
      console.warn('Lenis smooth scroll init failed:', err);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 9. VANILLA TILT
  // ═══════════════════════════════════════════════════════════════
  function initVanillaTilt() {
    try {
      if (typeof VanillaTilt === 'undefined') return;

      var tiltCards = $$('.concept-card, .product-card-inner, .benefit-card');
      VanillaTilt.init(tiltCards, {
        max: 4,
        speed: 600,
        glare: true,
        'max-glare': 0.08,
        scale: 1.01
      });
    } catch (err) {
      console.warn('Vanilla Tilt init failed:', err);
    }
  }


  var GISCUS_CONFIG = {
    repo: 'cristiauwu/biotech',
    repoId: 'R_kgDOUC2KeA',
    category: 'Announcements',
    categoryId: 'DIC_kwDOUC2KeM4DGZAu'
  };

  function initCommentsEmbed() {
    try {
      var disclosure = $('.site-comments .comments-disclosure');
      var mount = $('.giscus-site-thread', disclosure || document);
      if (!disclosure || !mount) return;

      disclosure.addEventListener('toggle', function () {
        if (!disclosure.open || mount.dataset.giscusMounted === 'true') return;
        mount.dataset.giscusMounted = 'true';

        if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
          var notice = document.createElement('p');
          notice.className = 'comments-config-notice';
          notice.textContent = 'Los comentarios estarán disponibles cuando se configure la categoría de GitHub Discussions.';
          mount.appendChild(notice);
          return;
        }

        var script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-repo', GISCUS_CONFIG.repo);
        script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
        script.setAttribute('data-category', GISCUS_CONFIG.category);
        script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
        script.setAttribute('data-mapping', 'specific');
        script.setAttribute('data-term', mount.getAttribute('data-term') || 'sitio-biotech');
        script.setAttribute('data-strict', '1');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', 'dark_dimmed');
        script.setAttribute('data-lang', 'es');
        script.setAttribute('data-loading', 'lazy');
        mount.appendChild(script);
      });
    } catch (err) {
      console.warn('Comments embed init failed:', err);
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 10. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  function init() {
    initDNACanvas();
    initNavigation();
    initCardInteractions();
    initCommentsEmbed();

    // Wait for all deferred scripts to load
    var checkInterval = setInterval(function () {
      var gsapReady = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
      var lucideReady = typeof lucide !== 'undefined';
      var lenisReady = typeof Lenis !== 'undefined';

      if (gsapReady) {
        clearInterval(checkInterval);
        initGSAPAnimations();
        initLenis();
        initLucideIcons();
        initVanillaTilt();
      }
    }, 100);

    // Fallback after 5 seconds
    setTimeout(function () {
      clearInterval(checkInterval);
      if (typeof gsap === 'undefined') {
        console.warn('GSAP did not load within 5s. Showing content without animations.');
        showAllContent();
      }
      // Still try to init independent libraries
      initLucideIcons();
      initLenis();
      initVanillaTilt();
    }, 5000);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
