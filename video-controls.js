// Controls are created only by portfolio player creation paths.
export function attachVideoClose(player,trigger,restore){
 const close=document.createElement('button');close.type='button';close.className='button outline video-collapse';close.textContent='Collapse video';close.setAttribute('aria-label','Close '+(player.title||player.getAttribute('aria-label')||'project video'));
 const host=player.parentElement;host.append(close);trigger.setAttribute('aria-expanded','true');
 let observer;
 if(player.tagName==='VIDEO'&&'IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)player.pause();},{threshold:.01});observer.observe(player);}
 const collapse=()=>{if(player.pause)player.pause();observer?.disconnect();close.remove();player.remove();restore?.();trigger.hidden=false;trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true});};
 close.addEventListener('click',collapse);
 close.addEventListener('keydown',event=>{if(event.key==='Escape')collapse();});
 return collapse;
}
