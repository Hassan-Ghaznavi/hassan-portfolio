const section = document.querySelector('#avatar');
const status = document.querySelector('#avatar-status');
const retry = document.querySelector('#avatar-retry');
let started = false;
async function load() {
  if (started) return;
  started = true;
  retry.hidden = true;
  status.textContent = 'Bringing the sketch to life…';
  try {
    const { mountAvatar } = await import('./avatar-scene.js?v=ink-1');
    await mountAvatar();
  } catch (error) {
    console.error('Avatar preview:', error);
    started = false;
    document.querySelector('#avatar-stage').setAttribute('aria-busy', 'false');
    status.textContent = 'The 3D preview could not load. You can still see the character here.';
    retry.hidden = false;
  }
}
retry.addEventListener('click', load);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
  }, { rootMargin: '300px' });
  observer.observe(section);
} else load();
