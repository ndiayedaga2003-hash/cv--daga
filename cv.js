// Animations légères : typed title, reveal on scroll, pulse photo
(function () {
    // Respecter préférence "réduire les animations"
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener('DOMContentLoaded', () => {
        // Injecte quelques règles CSS nécessaires (si vous préférez, placez-les dans STYLE.CSS)
        const css = `
        .typed-cursor{display:inline-block;margin-left:6px;opacity:.9;animation:blink 1s steps(2,start) infinite;font-weight:700}
        @keyframes blink{50%{opacity:0}}
        .will-animate{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
        .will-animate.in-view{opacity:1;transform:translateY(0)}
        .profile-photo{transition:transform .3s ease,box-shadow .3s ease;cursor:pointer}
        .profile-photo.pulse{animation:pulse-anim .6s ease}
        @keyframes pulse-anim{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Typed effect pour le titre
        const title = document.getElementById('cv-title') || document.querySelector('.cv-title');
        if (title) {
            const text = title.textContent.trim();
            title.textContent = '';
            const cursor = document.createElement('span');
            cursor.className = 'typed-cursor';
            cursor.textContent = '|';
            title.appendChild(cursor);

            let i = 0;
            const speed = 35; // ms par caractère
            function type() {
                if (i < text.length) {
                    cursor.insertAdjacentText('beforebegin', text.charAt(i));
                    i++;
                    setTimeout(type, speed);
                } else {
                    cursor.remove();
                }
            }
            setTimeout(type, 300);
        }

        // Reveal on scroll avec IntersectionObserver + stagger pour les <li>
        const targets = Array.from(document.querySelectorAll('section, .etat-civil, .parcours, .cv-left, .cv-right'));
        const listItems = Array.from(document.querySelectorAll('section ul li'));

        targets.forEach(t => t.classList.add('will-animate'));
        listItems.forEach(li => {
            li.classList.add('will-animate');
            li.style.opacity = '0';
        });

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                // Stagger des éléments <li> si présent
                const lis = el.querySelectorAll ? el.querySelectorAll('ul li') : [];
                if (lis.length) {
                    lis.forEach((li, idx) => {
                        li.style.transition = `opacity .45s ease ${idx * 70}ms, transform .45s ease ${idx * 70}ms`;
                        li.classList.add('in-view');
                        li.style.opacity = '';
                    });
                }
                el.classList.add('in-view');
                observer.unobserve(el);
            });
        }, { root: null, rootMargin: '0px', threshold: 0.12 });

        targets.forEach(t => obs.observe(t));
        listItems.forEach(li => obs.observe(li));

        // Interaction photo : pulse au clic
        const photo = document.querySelector('.profile-photo');
        if (photo) {
            photo.addEventListener('click', () => {
                photo.classList.add('pulse');
                setTimeout(() => photo.classList.remove('pulse'), 700);
            });
        }
    });

})();
