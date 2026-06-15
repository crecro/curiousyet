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

    /* ── "Next" buttons — smooth scroll ────── */
    document.querySelectorAll('.btn-dark[data-goto]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.goto);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ── Wax seal — pop to reveal ─────────── */
    const seal     = document.getElementById('hint-bubble');
    const revealed = document.getElementById('hint-revealed');

    if (seal && revealed) {
        seal.addEventListener('click', () => {
            seal.classList.add('popping');
            setTimeout(() => {
                seal.hidden     = true;
                revealed.hidden = false;
            }, 350);
        });
    }

    /* ── Scroll lines — staggered reveal ──── */
    const scrollWrap = document.querySelector('.scroll-wrap');
    if (scrollWrap) {
        const svObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    svObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        svObs.observe(scrollWrap);
    }

    /* ── Form submit ─────────────────────────── */
    const form    = document.getElementById('connect-form');
    const formBox = document.getElementById('the-form');
    const done    = document.getElementById('the-done');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            contact: document.getElementById('visitor-contact').value.trim(),
            message: document.getElementById('visitor-message').value.trim(),
            time:    new Date().toISOString()
        };
        if (!data.contact) return;

        const saved = JSON.parse(localStorage.getItem('curiousyet_messages') || '[]');
        saved.push(data);
        localStorage.setItem('curiousyet_messages', JSON.stringify(saved));

        formBox.hidden = true;
        done.hidden    = false;

        console.log('📬 Message saved:', data);
    });

})();
