// year
document.querySelectorAll('#y').forEach(el => el.textContent = new Date().getFullYear());

/* ------------ Helpers ------------ */
const ScrollLock = {
    lock(){ document.body.classList.add('no-scroll'); },
    unlock(){ document.body.classList.remove('no-scroll'); }
};

/* ------------ Lightbox ------------ */
(function(){
    const lb = document.querySelector('.lightbox');
    if(!lb) return;

    const imgEl = lb.querySelector('img');
    const capEl = lb.querySelector('.caption');
    const closeBtn = lb.querySelector('.close');
    let prevFocus = null;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusables = () => Array.from(lb.querySelectorAll(focusableSelector))
        .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    // one-time ARIA init
    lb.setAttribute('role','dialog');
    lb.setAttribute('aria-modal','true');
    lb.setAttribute('aria-hidden','true');
    if(!lb.hasAttribute('tabindex')) lb.setAttribute('tabindex','-1');

    const isOpen = () => lb.classList.contains('open');

    function openLb(src, caption){
        prevFocus = document.activeElement;
        imgEl.src = src;
        imgEl.alt = caption || 'Preview';
        capEl.textContent = caption || '';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden','false');
        ScrollLock.lock();

        const f = getFocusables();
        (f[0] || closeBtn || lb).focus();
    }

    function closeLb(){
        if(!isOpen()) return;
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden','true');
        ScrollLock.unlock();
        imgEl.src = '';
        if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
    }

    // Open on click for any element with data-lightbox-src
    document.addEventListener('click', (e)=>{
        const trigger = e.target.closest('[data-lightbox-src]');
        if(!trigger) return;
        e.preventDefault();
        openLb(trigger.getAttribute('data-lightbox-src'), trigger.getAttribute('data-caption') || trigger.title || '');
    });

    // Close on overlay click or close button
    lb.addEventListener('click', (e)=>{
        if (e.target === lb || e.target.classList.contains('close')) closeLb();
    });
    // prevent closing when clicking inner content
    lb.querySelectorAll('img, .caption').forEach(el=>{
        el.addEventListener('click', e=> e.stopPropagation());
    });

    // Esc to close (only when open)
    document.addEventListener('keydown', (e)=>{
        if(!isOpen()) return;
        if(e.key === 'Escape') closeLb();
    });

    // Focus trap in lightbox
    lb.addEventListener('keydown', (e)=>{
        if(!isOpen() || e.key !== 'Tab') return;
        const f = getFocusables();
        if(!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    });
})();

/* ------------ Mobile drawer ------------ */
(function(){
    const btn = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('mobileNav');
    const scrim = document.querySelector('.scrim');
    if(!btn || !drawer) return;

    const closeBtn = drawer.querySelector('.drawer-close');
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let prevFocus = null;
    let isOpen = false;

    const getFocusables = () => Array.from(drawer.querySelectorAll(focusableSelector))
        .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    // ARIA init
    drawer.setAttribute('aria-hidden','true');
    btn.setAttribute('aria-expanded','false');

    function openDrawer() {
        prevFocus = document.activeElement;
        isOpen = true;
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-expanded', 'true');
        if (scrim) scrim.hidden = false;
        ScrollLock.lock();
        const f = getFocusables();
        (f[0] || closeBtn || drawer).focus();
    }

    function closeDrawer() {
        if(!isOpen) return;
        isOpen = false;
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
        if (scrim) scrim.hidden = true;
        ScrollLock.unlock();
        if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
    }

    // Toggle
    btn.addEventListener('click', () => isOpen ? closeDrawer() : openDrawer());

    // Close on X, scrim, or any link tap
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (scrim) scrim.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (a) closeDrawer();
    });

    // Esc/Tab trap only when open
    document.addEventListener('keydown', (e) => {
        if (!isOpen) return;
        if (e.key === 'Escape') {
            e.preventDefault(); closeDrawer();
        } else if (e.key === 'Tab') {
            const f = getFocusables();
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        }
    });

    // Ensure clean state on resize back to desktop
    window.addEventListener('resize', () => {
        if (!isOpen) {
            ScrollLock.unlock();
            if (scrim) scrim.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
        }
    });
})();

/* ------------ Smooth scroll (menu no section tabs) ------------ */
(function(){
    const mobileNav  = document.getElementById('mobileNav');
    const scrim      = document.querySelector('.scrim');

    // Smooth scroll for in-page links (e.g., hero buttons)
    document.addEventListener('click', (e)=>{
        const a = e.target.closest('a[href^="#"]');
        if(!a) return;

        const id = a.getAttribute('href').slice(1);
        if(!id) return;
        const target = document.getElementById(id);
        if(!target) return;

        e.preventDefault();

        // close mobile drawer if open
        if (mobileNav && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            mobileNav.setAttribute('aria-hidden','true');
            const btn = document.querySelector('.nav-toggle');
            if (btn) btn.setAttribute('aria-expanded','false');
            if (scrim) scrim.hidden = true;
            ScrollLock.unlock();
        }

        target.scrollIntoView({ behavior:'smooth', block:'start' });
        history.pushState(null, '', `#${id}`);
    });

    // if page loads with a hash, smooth scroll to it (optional nicety)
    window.addEventListener('load', ()=>{
        const hash = location.hash;
        if(hash && document.getElementById(hash.slice(1))){
            setTimeout(()=> {
                document.getElementById(hash.slice(1)).scrollIntoView({ behavior:'smooth', block:'start' });
            }, 50);
        }
    });
})();

// ===== Partners: data-driven rendering =====
const PARTNERS = [
    {
        name: "Partner 1",
        role: "community supporter",
        url: "https://partner1.example.com",
        src: "assets/partners/p1.png",
        width: 300,
        height: 60
    },
    {
        name: "Partner 2",
        role: "youth programs",
        url: "https://partner2.example.com",
        src: "assets/partners/p2.png",
        width: 300,
        height: 60
    },
    {
        name: "Partner 3",
        role: "sports equipment",
        url: "https://partner3.example.com",
        src: "assets/partners/p3.png",
        width: 300,
        height: 60
    },
    {
        name: "Partner 4",
        role: "transportation support",
        url: "https://partner4.example.com",
        src: "assets/partners/p4.png",
        width: 300,
        height: 60
    }
    // добавляй новые объекты сюда
];

function renderPartners(){
    const grid = document.getElementById('partnersGrid');
    if(!grid || !Array.isArray(PARTNERS)) return;

    const frag = document.createDocumentFragment();

    PARTNERS.forEach(p => {
        // ссылка-карточка
        const a = document.createElement('a');
        a.className = 'logo-card';
        a.setAttribute('role', 'listitem');
        a.href = p.url || '#';
        if(p.url) { a.target = '_blank'; a.rel = 'noopener'; }
        a.title = `${p.name} — ${p.role}`;

        // логотип
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = p.src;
        img.alt = `${p.name} — ${p.role}`;
        if(p.width)  img.width  = p.width;
        if(p.height) img.height = p.height;

        // маленькая текстовая метка для скринридеров
        const sr = document.createElement('span');
        sr.className = 'logo-name';
        sr.textContent = p.name;

        // graceful fallback если картинка не загрузилась
        img.addEventListener('error', () => {
            a.style.justifyContent = 'center';
            a.textContent = p.name;
            a.title = `${p.name} (link)`;
        });

        a.appendChild(img);
        a.appendChild(sr);
        frag.appendChild(a);
    });

    grid.innerHTML = '';
    grid.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', renderPartners);
