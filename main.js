// year
document.querySelectorAll('#y').forEach(el => el.textContent = new Date().getFullYear());

// Lightbox for gallery
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

    function openLb(src, caption){
        prevFocus = document.activeElement;
        imgEl.src = src;
        imgEl.alt = caption || 'Preview';
        capEl.textContent = caption || '';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden','false');
        document.body.style.overflow='hidden';
        const f = getFocusables();
        (f[0] || closeBtn || lb).focus();
    }

    function closeLb(){
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden','true');
        document.body.style.overflow='';
        imgEl.src = '';
        if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
    }

    // Open on click for any element with data-lightbox-src (works for <a> and its children)
    document.addEventListener('click', (e)=>{
        const trigger = e.target.closest('[data-lightbox-src]');
        if(!trigger) return;
        e.preventDefault();
        openLb(trigger.getAttribute('data-lightbox-src'), trigger.getAttribute('data-caption') || trigger.title || '');
    });

    // Close on overlay click or close button
    lb.addEventListener('click', (e)=>{
        if (e.target === lb || e.target.classList.contains('close')) {
            closeLb();
        }
    });

    // Esc to close
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLb(); });

    // Focus trap in lightbox
    lb.addEventListener('keydown', (e)=>{
        if(e.key !== 'Tab') return;
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

// Mobile drawer
(function(){
    const btn = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('mobileNav');
    const scrim = document.querySelector('.scrim');
    if(!btn || !drawer) return;
})();
