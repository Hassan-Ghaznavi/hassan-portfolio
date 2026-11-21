const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let soundEnabled=false,audio;
export function playCue(kind='pencil'){
 if(!soundEnabled)return;
 try{
  audio??=new AudioContext();if(audio.state==='suspended')audio.resume();
  const duration=kind==='ocean'?.55:kind==='fold'?.25:.13;
  const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate),samples=buffer.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/samples.length);
  const source=audio.createBufferSource();source.buffer=buffer;
  const filter=audio.createBiquadFilter();filter.type=kind==='ocean'?'lowpass':'bandpass';filter.frequency.value=kind==='ocean'?330:kind==='fold'?1400:2800;
  const gain=audio.createGain();gain.gain.value=kind==='ocean'?.035:.025;source.connect(filter).connect(gain).connect(audio.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
 }catch{}
}
export function decorateFilmScreen(screen,film){
 screen.classList.add('story-reveal');screen.dataset.reveal=film.id;
 const sketch=document.createElement('img');sketch.className='reveal-sketch';sketch.src=`assets/process/${film.id}-sketch.svg`;sketch.alt='';sketch.setAttribute('aria-hidden','true');sketch.loading='lazy';screen.append(sketch);
 const seam=document.createElement('span');seam.className='reveal-seam';seam.setAttribute('aria-hidden','true');screen.append(seam);
 const label=document.createElement('label');label.className='reveal-control';label.textContent='Sketch treatment → final frame';
 const input=document.createElement('input');input.type='range';input.min='0';input.max='100';input.value='0';input.setAttribute('aria-label',film.title+' sketch to final frame');input.addEventListener('input',()=>{screen.dataset.manualReveal='true';screen.style.setProperty('--reveal',input.value+'%');});label.append(input);screen.append(label);
}
function setup(){
 document.body.classList.add('has-stories');
 const sound=document.querySelector('#sound-toggle');sound.addEventListener('click',()=>{soundEnabled=!soundEnabled;sound.setAttribute('aria-pressed',String(soundEnabled));sound.textContent=soundEnabled?'Sound on':'Sound off';if(soundEnabled)playCue();else audio?.suspend();});
 // The floating plane follows one path from the project illustration to its demo.
 const route=document.createElement('div');route.className='paper-journey';route.hidden=true;route.setAttribute('aria-hidden','true');route.innerHTML='<svg class="route-trail"><path fill="none" stroke="#a92e21" stroke-width="1.3" stroke-dasharray="3 8" opacity=".32"/></svg><svg class="route-plane" viewBox="0 0 180 100"><path d="M5 44L173 5 64 91 59 58Z" fill="#f8efdd" stroke="#3c332b" stroke-width="2"/><path d="M59 58L173 5 79 69 64 91" fill="#d3c2a8" stroke="#3c332b" stroke-width="1.5"/></svg>';document.body.append(route);
 const plane=route.querySelector('.route-plane'),trail=route.querySelector('path');
 const paper=document.querySelector('#paper-dash'),media=paper.querySelector('.project-media'),flight=document.querySelector('#flight');
 const note=document.createElement('p');note.className='flight-route-note';note.textContent='Follow the paper plane down the page. Its landing spot is your flight deck.';paper.querySelector('.project-overview').after(note);
 const companion=document.querySelector('.pencil-companion'),prompt=document.querySelector('#pencil-context');let context='cover',nudgeTimer;
 const seen=new Set();
 const contexts=[
  {id:'paper-dash',kind:'flight',question:'How was Paper Plane Dash built?'},
  {id:'sketch-sea',kind:'ocean',question:'Tell me about Sunken Greed'},
  {id:'behind-smile',kind:'smile',question:'Tell me about Behind the Smile'},
  {id:'film-cave',kind:'cave',question:'Tell me about the cave scene'},
  {id:'film-ocean',kind:'ocean',question:'Tell me about Stormy Ocean'},
  {id:'film-airpods',kind:'airpods',question:'Tell me about AirPods'},
  {id:'internship',kind:'ink',question:'What did Hassan build during his internship?'},
  {id:'about',kind:'maker',question:'Who is Hassan?'},
  {id:'contact',kind:'mail',question:'How do I contact Hassan?'},
  {id:'two-lights',kind:'lights',question:'Which game won twice?'}
 ];
 prompt.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('pencil:ask',{detail:prompt.dataset.question||'Who is Hassan?'})));
 const reveals=[...document.querySelectorAll('.story-reveal')];let raf=0;
 const watched=[paper,media,flight,...contexts.map(c=>document.getElementById(c.id)).filter(Boolean),...reveals];
 let active=true;
 function schedule(){if(!raf&&!document.hidden&&active)raf=requestAnimationFrame(paint);}
 function paint(){
  raf=0;
  for(const screen of reveals){
   if(screen.dataset.manualReveal||!screen.querySelector('.reveal-sketch'))continue;
   const rect=screen.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)continue;
   const p=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.92-rect.top)/(innerHeight*.65)));
   screen.style.setProperty('--reveal',`${p*100}%`);screen.querySelector('input').value=String(Math.round(p*100));
   if(p>.3&&!screen.dataset.cued){screen.dataset.cued='true';playCue('pencil');}
  }
  const pr=paper.getBoundingClientRect(),mr=media.getBoundingClientRect(),fr=flight.getBoundingClientRect();
  const start=mr.top+scrollY-innerHeight*.45,end=fr.top+scrollY-innerHeight*.35;
  const p=Math.max(0,Math.min(1,(scrollY-start)/Math.max(1,end-start)));
  route.hidden=reduced.matches||pr.top>innerHeight||pr.bottom<0||scrollY<start-100||fr.bottom<0;
  if(!route.hidden){
   const a={x:mr.left+mr.width*.72,y:mr.top+Math.min(mr.height*.22,150)},d={x:fr.left+fr.width*.55,y:fr.top+Math.min(fr.height*.45,260)},b={x:innerWidth*.91,y:innerHeight*.16},c={x:innerWidth*.20,y:innerHeight*.66};
   const q=1-p,x=q*q*q*a.x+3*q*q*p*b.x+3*q*p*p*c.x+p*p*p*d.x,y=q*q*q*a.y+3*q*q*p*b.y+3*q*p*p*c.y+p*p*p*d.y;
   plane.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) rotate(${Math.sin(p*Math.PI*2)*18-8}deg) scale(${1-p*.15})`;
   trail.setAttribute('d',`M${a.x},${a.y}C${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`);route.dataset.progress=p.toFixed(3);
  }
  let closest,score=Infinity;
  for(const entry of contexts){const el=document.getElementById(entry.id);if(!el)continue;const rect=el.getBoundingClientRect();if(rect.bottom<innerHeight*.25||rect.top>innerHeight*.75)continue;const value=Math.abs(rect.top-innerHeight*.3);if(value<score){score=value;closest=entry;}}
  const next=closest?.id||'cover';
  if(next!==context){context=next;companion.dataset.context=closest?.kind||'cover';prompt.dataset.question=closest?.question||'Who is Hassan?';prompt.textContent=closest?.question||'What are you curious about?';
   clearTimeout(nudgeTimer);companion.classList.remove('is-nudging');
   if(closest&&!seen.has(next)){seen.add(next);companion.classList.add('is-nudging');nudgeTimer=setTimeout(()=>companion.classList.remove('is-nudging'),4500);if(closest.kind==='ocean')playCue('ocean');}
  }
 }
 const visibility=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.dataset.storyVisible=String(entry.isIntersecting);active=watched.some(node=>node.dataset.storyVisible==='true');schedule();},{rootMargin:'150px'});watched.forEach(node=>visibility.observe(node));
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);
 // Keyboard/touch disclosure keeps the same notes available without hover.
 document.querySelectorAll('.film-card,.specimen,.study-gallery > figure').forEach(card=>{
  card.classList.add('depth-card');
  const paragraph=card.querySelector(':scope > p:last-child')||card.querySelector(':scope > p:not(.specimen-note)');
  if(paragraph&&!paragraph.classList.contains('eyebrow')&&card.matches('.film-card,.specimen')){const details=document.createElement('details');details.className='fold-notes';const summary=document.createElement('summary');summary.textContent=card.matches('.specimen')?'Unfold the mechanic':'Unfold the study notes';details.append(summary,paragraph.cloneNode(true));paragraph.replaceWith(details);}
  let bounds;
  card.addEventListener('pointerenter',()=>{bounds=card.getBoundingClientRect();});
  card.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType!=='mouse'||!matchMedia('(hover:hover)').matches||event.target.closest('input,button,video,summary,a'))return;bounds??=card.getBoundingClientRect();const x=(event.clientX-bounds.left)/bounds.width-.5,y=(event.clientY-bounds.top)/bounds.height-.5;card.style.setProperty('--tilt-x',`${-y*5}deg`);card.style.setProperty('--tilt-y',`${x*5}deg`);});
  const reset=()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');};card.addEventListener('pointerleave',reset);card.addEventListener('focusin',reset);
 });
 // This comparison is rendered from the real avatar mesh with a matched camera.
 const compare=document.createElement('div');compare.className='process-comparison';compare.id='behind-build';compare.innerHTML=`<div><p class="eyebrow">Behind the build / Actual Blender geometry</p><h3>A few lines.<br>A little structure.</h3><p>Drag to compare the avatar's real mesh topology with its shaded model. Both views use the same source file, camera, and pose.</p></div><figure><div class="compare-frame" style="--compare:50%"><img src="assets/process/avatar-finished.webp" width="700" height="800" loading="lazy" alt="Shaded view of the original Hassan avatar model"><img class="compare-overlay" src="assets/process/avatar-wire.webp" width="700" height="800" loading="lazy" alt="Matching wireframe rendered from the actual avatar geometry"><span class="compare-divider" aria-hidden="true">↔</span><span class="compare-label left">Wireframe</span><span class="compare-label right">Shaded</span></div><label class="compare-control">Reveal the topology<input type="range" min="0" max="100" value="50" aria-label="Avatar wireframe comparison"></label><figcaption>Original Blender source · Shared geometry and camera</figcaption></figure>`;
 document.querySelector('#avatar').append(compare);const range=compare.querySelector('input');range.addEventListener('input',()=>{compare.querySelector('.compare-frame').style.setProperty('--compare',range.value+'%');range.setAttribute('aria-valuetext',range.value+' percent wireframe');});
 schedule();
}
if(document.readyState==='complete')setup();else document.addEventListener('DOMContentLoaded',setup,{once:true});
