// The page remains fully readable if animation is unavailable or disabled.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let observer;
function setup() {
  observer?.disconnect();
  document.querySelectorAll('.scroll-ready').forEach(node => node.classList.remove('scroll-ready'));
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting) continue;
      target.classList.add('scroll-arrived');
      observer.unobserve(target);
    }
  }, {threshold: .12, rootMargin: '0px 0px -24px 0px'});
  const selectors = '.section-heading, .flagship-header, .project-masthead, .flagship-story > div, .flagship-awards, .toolkit-grid article, .journey-list article, .about-copy, .avatar-copy, .closing > h2';
  document.querySelectorAll(selectors).forEach(node => {
    // Already visible content never disappears while the module initializes.
    if (node.getBoundingClientRect().top < innerHeight * .94) return;
    node.classList.add('scroll-ready');
    if (node.closest('.toolkit-grid')) node.style.setProperty('--reveal-delay', `${Array.from(node.parentElement.children).indexOf(node)*75}ms`);
    observer.observe(node);
  });
}
// Other modules populate the project chapters synchronously before DOMContentLoaded.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, {once:true});
else setup();
reduced.addEventListener('change', setup);
// Keyboard and anchor navigation reveal their destination immediately.
document.addEventListener('focusin', event => {
  event.target.closest('.scroll-ready')?.classList.add('scroll-arrived');
});
window.addEventListener('hashchange', () => {
  const target=document.getElementById(location.hash.slice(1));
  target?.querySelectorAll('.scroll-ready').forEach(node=>node.classList.add('scroll-arrived'));
  target?.classList.add('scroll-arrived');
});
