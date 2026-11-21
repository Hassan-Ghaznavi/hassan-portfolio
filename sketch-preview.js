const section=document.querySelector('#sketch-sea');
let started=false;
async function start(){
 if(started)return;started=true;
 try { await (await import('./sketch-sea.js?v=2')).mountSketchSea(); }
 catch(error){ console.error('Sketch sea:',error);document.querySelector('#sketch-status').textContent='The 3D sketch could not load. You can still watch the project below.'; }
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();start();}},{rootMargin:'200px'});observer.observe(section);}else start();

