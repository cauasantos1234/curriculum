/* ui.js — small UI enhancements
 - Smooth theme transitions
 - Reveal-on-scroll for .reveal elements
 - Lightweight tilt on .card when hovering (prefers-reduced-motion respected)
*/
(function(){
  const root = document.getElementById('app') || document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Apply theme transition class for smoothness
  function enableThemeTransition(){
    document.documentElement.classList.add('theme-transition');
    window.setTimeout(()=>document.documentElement.classList.remove('theme-transition'), 300);
  }

  // Toggle via data-theme attribute
  const themeButtons = document.querySelectorAll('#themeToggle, #themeToggle2');
  themeButtons.forEach(btn=>btn.addEventListener('click', ()=>enableThemeTransition()));

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if(!prefersReduced && 'IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('show');
          io.unobserve(e.target);
        }
      });
    },{threshold:0.12});
    revealEls.forEach(el=>io.observe(el));
  } else {
    // if reduced motion or no IO, just show them
    revealEls.forEach(el=>el.classList.add('show'));
  }

  // Card tilt (very small) on pointer hover
  if(!prefersReduced){
    document.addEventListener('pointermove', function(e){
      const card = e.target.closest('.card, .community-card');
      if(!card) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (+dy/rect.height) * 3; // max 3deg
      const ry = (-dx/rect.width) * 5; // max 5deg
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      card.style.transition = 'transform 100ms linear';
    });
    document.addEventListener('pointerout', function(e){
      const card = e.target.closest('.card, .community-card');
      if(!card) return;
      card.style.transform = '';
      card.style.transition = 'transform 300ms ease';
    });
  }

  // Smooth scroll reveal for sections
  function revealOnScroll(){
    const elements = document.querySelectorAll('.hero-banner, .community-section, .sectionHeader');
    elements.forEach(el=>{
      if(!el.classList.contains('revealed')){
        const rect = el.getBoundingClientRect();
        if(rect.top < window.innerHeight * 0.85){
          el.classList.add('revealed');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      }
    });
  }

  if(!prefersReduced){
    // Initial state for elements
    document.querySelectorAll('.hero-banner, .community-section').forEach(el=>{
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    revealOnScroll();
  }

  // Animate progress bars when they appear
  function animateProgress(){
    document.querySelectorAll('.progress > i').forEach(i=>{
      const w = i.style.width || '0%';
      i.style.width = '0%';
      requestAnimationFrame(()=>{
        i.style.width = w;
      });
    });
  }
  // initial run + on DOM changes
  animateProgress();
  const mo = new MutationObserver(animateProgress);
  mo.observe(document.body,{childList:true,subtree:true});
})();
