// year
document.querySelectorAll('#y').forEach(el => el.textContent = new Date().getFullYear());

// Lightbox for gallery
(function(){
    const lb = document.querySelector('.lightbox');
    if(!lb) return;
    const imgEl = lb.querySelector('img');
    const capEl = lb.querySelector('.caption');
    document.addEventListener('click', (e)=>{
        const t = e.target.closest('[data-lightbox-src]');
        if(!t) return;
        e.preventDefault();
        imgEl.src = t.getAttribute('data-lightbox-src');
        capEl.textContent = t.getAttribute('data-caption') || '';
        lb.classList.add('open');
    });
    lb.addEventListener('click', (e)=>{
        if(e.target.classList.contains('close') || e.target === lb){ lb.classList.remove('open'); }
    });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') lb.classList.remove('open'); });
})();

// Mobile drawer
(function(){
    const btn = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('mobileNav');
    const scrim = document.querySelector('.scrim');
    if(!btn || !drawer || !scrim) return;

    const open = () => {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden','false');
        btn.setAttribute('aria-expanded','true');
        scrim.hidden = false;
        document.body.style.overflow='hidden';
    };
    const close = () => {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden','true');
        btn.setAttribute('aria-expanded','false');
        scrim.hidden = true;
        document.body.style.overflow='';
    };

    btn.addEventListener('click', open);
    scrim.addEventListener('click', close);
    drawer.querySelector('.drawer-close')?.addEventListener('click', close);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
})();
