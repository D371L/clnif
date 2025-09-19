/* helpers */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => r.querySelectorAll(s);

/* Progress bar */
const progressBar = $('#progressBar');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/* Toast notifications */
const Toast = {
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

/* Loading states */
const Loading = {
    show(element) {
        element.classList.add('loading');
    },
    hide(element) {
        element.classList.remove('loading');
    }
};

/* drawer mobile */
(function(){
    const btn = $('.burger');
    const drawer = $('#drawer');
    const scrim = $('.scrim');
    if(!btn || !drawer) return;

    let open = false;
    let lastFocus = null;

    const show = () => {
        open = true;
        lastFocus = document.activeElement;
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden','false');
        btn.setAttribute('aria-expanded','true');
        if(scrim){ scrim.hidden=false; scrim.classList.add('open'); }
        document.body.style.overflow='hidden';
        (drawer.querySelector('a,button') || drawer).focus({preventScroll:true});
    };

    const hide = () => {
        open = false;
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden','true');
        btn.setAttribute('aria-expanded','false');
        if(scrim){ scrim.hidden=true; scrim.classList.remove('open'); }
        document.body.style.overflow='';
        if(lastFocus) lastFocus.focus({preventScroll:true});
    };

    btn.addEventListener('click', ()=> open ? hide() : show());
    drawer.querySelector('.close')?.addEventListener('click', hide);
    scrim?.addEventListener('click', hide);
    addEventListener('keydown', e=>{ if(e.key==='Escape' && open) hide(); });
    drawer.addEventListener('click', e=>{ if(e.target.closest('a')) hide(); });

    // Enhanced swipe to close
    let sx = 0, sy = 0, startTime = 0;
    drawer.addEventListener('touchstart', e=>{ 
        sx = e.touches[0].clientX; 
        sy = e.touches[0].clientY;
        startTime = Date.now();
    }, {passive:true});
    
    drawer.addEventListener('touchend', e=>{
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(dx) / duration;
        
        // Close on swipe left with sufficient velocity or distance
        if(dx < -60 && Math.abs(dy) < 100 && velocity > 0.1) {
            hide();
        }
    }, {passive:true});
    
    // Improved touch feedback
    drawer.addEventListener('touchstart', e=>{
        const target = e.target.closest('a, button');
        if(target) target.style.transform = 'scale(0.98)';
    }, {passive:true});
    
    drawer.addEventListener('touchend', e=>{
        const target = e.target.closest('a, button');
        if(target) {
            target.style.transform = '';
            setTimeout(() => target.style.transform = '', 150);
        }
    }, {passive:true});
})();

/* smooth anchors without history spam */
document.addEventListener('click', e=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href').slice(1);
    const t = document.getElementById(id);
    if(!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior:'smooth', block:'start' });
    history.replaceState(null, '', `#${id}`);
});

/* lightbox with focus trap */
(function(){
    const lb = document.querySelector('.lightbox'); if(!lb) return;
    const img = lb.querySelector('img');
    const cap = lb.querySelector('.caption');
    const closeBtn = lb.querySelector('.close');
    let lastFocus = null;

    const focusables = () => lb.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');

    function open(src, c){
        lastFocus = document.activeElement;
        img.src = src;
        img.alt = c || 'Preview';
        cap.textContent = c || '';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden','false');
        lb.setAttribute('tabindex','-1');
        document.body.style.overflow='hidden';
        (closeBtn || lb).focus({preventScroll:true});
    }
    function close(){
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden','true');
        img.src = '';
        document.body.style.overflow='';
        if(lastFocus) lastFocus.focus({preventScroll:true});
    }

    document.addEventListener('click', e=>{
        const t = e.target.closest('[data-lightbox-src]');
        if(!t) return;
        e.preventDefault();
        open(t.getAttribute('data-lightbox-src'), t.getAttribute('data-caption') || t.title || '');
    });
    lb.addEventListener('click', e=>{
        if(e.target === lb || e.target.classList.contains('close')) close();
    });
    addEventListener('keydown', e=>{
        if(!lb.classList.contains('open')) return;
        if(e.key === 'Escape') close();
        if(e.key === 'Tab'){
            const items = Array.from(focusables());
            if(!items.length) return;
            const i = items.indexOf(document.activeElement);
            if(e.shiftKey && (i <= 0)){ items[items.length-1].focus(); e.preventDefault(); }
            else if(!e.shiftKey && (i === items.length-1)){ items[0].focus(); e.preventDefault(); }
        }
    });
})();

/* YouTube background nocookie and cover */
(function(){
    const el = document.querySelector('.video-bg'); if(!el) return;
    const id = el.getAttribute('data-yt-bg'); if(!id) return;
    const src =
        `https://www.youtube-nocookie.com/embed/${id}` +
        `?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=${id}`;

    const iframe = document.createElement('iframe');
    iframe.setAttribute('title','CLNIF background video');
    iframe.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    iframe.setAttribute('loading','lazy');
    iframe.setAttribute('aria-hidden','true');
    iframe.src = src;
    iframe.frameBorder = '0';
    el.appendChild(iframe);

    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
        iframe.style.display = 'none';
    }
})();

/* Enhanced lazy loading */
(function(){
    const images = $$('img[loading="lazy"]');
    if(!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const img = entry.target;
                Loading.show(img.parentElement);
                
                img.addEventListener('load', () => {
                    Loading.hide(img.parentElement);
                });
                
                img.addEventListener('error', () => {
                    Loading.hide(img.parentElement);
                    Toast.show('Ошибка загрузки изображения', 'error');
                });
                
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    images.forEach(img => imageObserver.observe(img));
})();

/* scroll spy */
(function(){
    const navLinks = Array.from(document.querySelectorAll('a[data-spy-link]'));
    const sections = Array.from(document.querySelectorAll('[data-spy-section], #top'));
    if(!navLinks.length || !sections.length) return;

    const map = new Map(navLinks.map(a => [a.getAttribute('href').replace('#',''), a]));
    function setActive(id){
        navLinks.forEach(a => { a.removeAttribute('aria-current'); a.classList.remove('active'); });
        const link = map.get(id);
        if(link){ link.setAttribute('aria-current','page'); link.classList.add('active'); }
    }

    const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                const id = e.target.id || 'top';
                setActive(id);
            }
        });
    }, { root:null, threshold:0.6 });

    sections.forEach(s => io.observe(s));
})();
