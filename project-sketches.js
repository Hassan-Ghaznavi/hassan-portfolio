function start(){
 const regions=[...document.querySelectorAll('[data-mini-sketch]')];
 if(!regions.length)return;
 let started=false;
 const observer=new IntersectionObserver(entries=>{
  if(started||!entries.some(e=>e.isIntersecting))return;
  started=true;observer.disconnect();
  import('./mini-scenes.js?v=scroll-studies-13').then(m=>m.mountMiniScenes(regions)).catch(error=>console.warn('3D margin sketches unavailable:',error));
 },{rootMargin:'160px'});
 regions.forEach(node=>observer.observe(node));
}
if(document.readyState==='complete')start();else document.addEventListener('DOMContentLoaded',start,{once:true});
