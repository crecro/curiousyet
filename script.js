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

    /* ── Soft shimmer button — bouquet particles ─ */
    const shimmerToggle = document.getElementById('shimmer-toggle');
    let bouquetTimer = null;

    if (shimmerToggle) {
        shimmerToggle.addEventListener('click', () => {
            shimmerToggle.classList.add('is-active');
            
            // Generate 12-18 bouquets
            const bouquetCount = Math.floor(Math.random() * 7) + 12;
            for (let i = 0; i < bouquetCount; i++) {
                const bouquet = document.createElement('div');
                bouquet.className = 'bouquet-particle';
                bouquet.textContent = '💐';
                
                const startX = Math.random() * window.innerWidth;
                const startY = window.innerHeight + 20;
                const endX = Math.random() * window.innerWidth;
                const endY = -50;
                const duration = 2.2 + Math.random() * 0.8;
                const delay = Math.random() * 0.3;
                
                bouquet.style.left = startX + 'px';
                bouquet.style.top = startY + 'px';
                bouquet.style.setProperty('--end-x', (endX - startX) + 'px');
                bouquet.style.setProperty('--end-y', (endY - startY) + 'px');
                bouquet.style.setProperty('--duration', duration + 's');
                bouquet.style.setProperty('--delay', delay + 's');
                
                document.body.appendChild(bouquet);
                
                setTimeout(() => {
                    bouquet.remove();
                }, (duration + delay) * 1000);
            }
            
            clearTimeout(bouquetTimer);
            bouquetTimer = setTimeout(() => {
                shimmerToggle.classList.remove('is-active');
            }, 3200);
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
    const messageBoard = document.getElementById('message-board');
    const messageList = document.getElementById('message-list');

    function renderMessages() {
        if (!messageBoard || !messageList) return;

        const saved = JSON.parse(localStorage.getItem('curiousyet_messages') || '[]');
        messageList.innerHTML = '';

        if (!saved.length) {
            const empty = document.createElement('div');
            empty.className = 'message-empty';
            empty.textContent = 'No messages yet. The first one will appear here.';
            messageList.appendChild(empty);
            return;
        }

        const formatter = new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        saved.slice().reverse().forEach((entry) => {
            const card = document.createElement('article');
            card.className = 'message-entry';

            const header = document.createElement('header');

            const contact = document.createElement('div');
            contact.className = 'message-contact';
            contact.textContent = entry.contact || 'Anonymous';

            const time = document.createElement('time');
            time.className = 'message-time';
            time.dateTime = entry.time;
            time.textContent = entry.time ? formatter.format(new Date(entry.time)) : '';

            header.append(contact, time);

            const body = document.createElement('p');
            body.className = 'message-body';
            body.textContent = entry.message || 'No message left.';

            card.append(header, body);
            messageList.appendChild(card);
        });
    }

    renderMessages();

    /* ── Secret inbox toggle (Ctrl+M) ───── */
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            messageBoard.classList.toggle('visible');
        }
    });

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
        renderMessages();

        console.log('📬 Message saved:', data);
    });

})();
