/* ═══════════════════════════════════════════
   script.js — Animations, parallax, form
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Scroll-based reveal ─────────────────── */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    /* ── Smooth-scroll for CTA ───────────────── */
    const tourBtn = document.getElementById('btn-tour');
    if (tourBtn) {
        tourBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(tourBtn.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* ── Parallax on scroll ──────────────────── */
    const parallaxEls = document.querySelectorAll('[data-parallax]');

    function handleParallax() {
        const scrollY = window.scrollY;
        parallaxEls.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.05;
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
            el.style.transform = `translateY(${-offset}px)`;
        });
    }

    /* ── Floating doodles gentle mouse parallax ─ */
    const doodles = document.querySelectorAll('.doodle');

    function handleMouseMove(e) {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 … 1
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;

        doodles.forEach((d, i) => {
            const depth = 8 + (i % 4) * 6;
            const dx = cx * depth;
            const dy = cy * depth;
            d.style.setProperty('--mx', `${dx}px`);
            d.style.setProperty('--my', `${dy}px`);
            // Combine with existing animation using translate overlay
            d.style.marginLeft = `${dx}px`;
            d.style.marginTop  = `${dy}px`;
        });
    }

    /* Only enable mouse-parallax on non-touch devices */
    if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    /* ── Throttled scroll handler ────────────── */
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ── Contact form ────────────────────────── */
    const form    = document.getElementById('connect-form');
    const success = document.getElementById('success-msg');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('visitor-name').value.trim();
            const contact = document.getElementById('visitor-contact').value.trim();
            const message = document.getElementById('visitor-message').value.trim();

            if (!name || !contact) return;

            /* Save to localStorage as a simple persistence layer */
            const entry = {
                name,
                contact,
                message,
                timestamp: new Date().toISOString()
            };

            const saved = JSON.parse(localStorage.getItem('site_messages') || '[]');
            saved.push(entry);
            localStorage.setItem('site_messages', JSON.stringify(saved));

            /* Show success state */
            form.hidden    = true;
            success.hidden = false;

            /* Log for demo purposes */
            console.log('📬 New message saved:', entry);
        });
    }

    /* ── Stagger reveal for grid children ────── */
    const grids = document.querySelectorAll('.polaroid-grid, .cards-grid');
    grids.forEach((grid) => {
        const items = grid.querySelectorAll('.reveal');
        items.forEach((item, i) => {
            item.style.transitionDelay = `${i * 120}ms`;
        });
    });

    /* ── Add subtle rotation jitter to polaroids on load */
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach((p) => {
        const randomRotate = (Math.random() - 0.5) * 5; // -2.5 … 2.5 deg
        p.style.setProperty('--rot', `${randomRotate}deg`);
    });

})();
