import {attachVideoClose} from './video-controls.js';
const chapter=document.querySelector('#portfolio-film');
const screen=chapter.querySelector('.promo-screen');
const trigger=chapter.querySelector('#promo-play');
const status=chapter.querySelector('.promo-status');
let collapse;
trigger.addEventListener('click',()=>{
 if(collapse)return;
 const poster=screen.querySelector('img');
 const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='none';video.muted=false;
 video.poster=poster.src;video.src='assets/promo/manual-film.mp4';video.setAttribute('aria-label','The Manual Is Wrong promotional film');video.tabIndex=0;
 screen.replaceChildren(video);trigger.hidden=true;chapter.classList.add('film-open');status.textContent='The manual, in motion. Sound is available in the player.';
 collapse=attachVideoClose(video,trigger,()=>{video.removeAttribute('src');video.load();screen.replaceChildren(poster);chapter.classList.remove('film-open');status.textContent='A minute inside the margins.';collapse=undefined;});
 video.addEventListener('error',()=>{collapse?.();status.textContent='The film could not load. Please try again.';},{once:true});
 video.addEventListener('ended',()=>{status.textContent='Every world starts with a line. Replay the film or close this page of the story.';});
 video.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();collapse?.();}});
 video.scrollIntoView({block:'center',behavior:'instant'});video.play().catch(()=>{status.textContent='Press Play in the player to begin. Sound is available.';});video.focus({preventScroll:true});
});
