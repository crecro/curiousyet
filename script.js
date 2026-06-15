(function () {
    'use strict';

    /* ── Scroll reveal ─────────────────────── */
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach((el) => obs.observe(el));

    /* stagger children inside grids */
    document.querySelectorAll('.polaroids').forEach((g) => {
        g.querySelectorAll('.reveal').forEach((item, i) => {
            item.style.transitionDelay = `${i * 110}ms`;
        });
    });

    /* ── "Next" buttons — smooth scroll ────── */
    document.querySelectorAll('.btn-next').forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.goto);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ── The runaway "No" button ─────────────── */
    const noBtn   = document.getElementById('btn-no');
    const hintEl  = document.getElementById('no-hint');
    let escapeCount = 0;

    const hints = [
        "Nice try 😏",
        "Nope, not happening.",
        "You really thought?",
        "Still no.",
        "I can do this all day.",
        "Okay now you're just playing.",
        "Just click Yes already 😄",
        "I admire the persistence.",
        "…you sure?",
        "Fine, I respect the effort."
    ];

    function escapeNo() {
        const pad = 20;
        const bw = noBtn.offsetWidth;
        const bh = noBtn.offsetHeight;
        const maxX = window.innerWidth  - bw - pad;
        const maxY = window.innerHeight - bh - pad;

        const nx = Math.max(pad, Math.random() * maxX);
        const ny = Math.max(pad, Math.random() * maxY);

        if (!noBtn.classList.contains('escaped')) {
            noBtn.classList.add('escaped');
        }
        noBtn.style.left = nx + 'px';
        noBtn.style.top  = ny + 'px';

        if (hintEl) {
            hintEl.textContent = hints[escapeCount % hints.length];
        }
        escapeCount++;
    }

    /* Desktop: hover */
    noBtn.addEventListener('mouseenter', escapeNo);
    /* Mobile: touch */
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        escapeNo();
    }, { passive: false });

    /* ── "Yes" button — show form ────────────── */
    const yesBtn  = document.getElementById('btn-yes');
    const askBox  = document.getElementById('the-ask');
    const formBox = document.getElementById('the-form');

    yesBtn.addEventListener('click', () => {
        askBox.hidden  = true;
        formBox.hidden = false;
        // also remove escaped No button
        noBtn.style.display = 'none';
    });

    /* ── Form submit ─────────────────────────── */
    const form = document.getElementById('connect-form');
    const done = document.getElementById('the-done');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name:    document.getElementById('visitor-name').value.trim(),
            contact: document.getElementById('visitor-contact').value.trim(),
            message: document.getElementById('visitor-message').value.trim(),
            time:    new Date().toISOString()
        };
        if (!data.name || !data.contact) return;

        const saved = JSON.parse(localStorage.getItem('curiousyet_messages') || '[]');
        saved.push(data);
        localStorage.setItem('curiousyet_messages', JSON.stringify(saved));

        formBox.hidden = true;
        done.hidden    = false;

        console.log('📬 Message saved:', data);
    });

})();
