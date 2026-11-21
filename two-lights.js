export function buildTwoLights(chapter, project) {
  chapter.classList.add('flagship');
  chapter.innerHTML = `
    <header class="flagship-header"><p class="eyebrow">01 / Featured project · Unity · C# · Blender</p>
      <p class="flagship-rule"><s>Find your own way.</s> <em>Some exits take two.</em></p>
      <h3>Two Lights<br><span>One Escape.</span></h3>
      <div class="award-tags"><span>Winner / GameCon</span><span>Winner / Project evaluation</span></div>
      <p class="flagship-intro">Two players. Two perspectives. A way forward, together.</p>
    </header>
    <div class="light-stage" style="--lx:30%;--rx:70%;--ly:48%;--ry:48%">
      <img class="light-base" src="assets/two-lights/gameplay-65.webp" width="1280" height="720" loading="lazy" alt="Actual split-screen gameplay: two players explore separate sides of the environment.">
      <div class="light-window light-left" aria-hidden="true"></div><div class="light-window light-right" aria-hidden="true"></div>
      <div class="light-seam" aria-hidden="true"></div><span class="light-label">01 / Your side</span><span class="light-label right">02 / Their side</span>
      <p class="light-whisper" aria-hidden="true">A little light goes a long way.</p>
    </div>
    <div class="light-controls"><label for="light-position">Bring the lights together</label><input id="light-position" type="range" min="0" max="100" value="0" aria-describedby="light-help"><button class="button outline" type="button" data-full-scene>Show full scene</button></div>
    <p id="light-help" class="light-help">Scroll to bring the lights together. Or move across the scene, drag on touch, or use the slider. The project is yours to explore either way.</p>
    <div class="flagship-story"><div><p class="eyebrow">My part in the escape</p><h4>Making cooperation<br>feel playable.</h4><p>Gameplay developer · Team project</p><p>I designed and implemented core gameplay mechanics, lighting-based puzzles, and environment interactions in C#. My work also covered player movement, object interactions, and in-game UI.</p></div>
      <div class="flagship-watch"><p class="eyebrow">From the actual build</p><p>Watch both perspectives in motion.</p><button class="button ink" type="button" data-watch>Watch gameplay ▷</button><div class="flagship-player"></div></div></div>
    <section class="flagship-awards" aria-label="Two competition wins"><div><p class="eyebrow">One game. Two wins.</p><h4>Beyond the build.</h4><p>Awarded at GameCon and at the project evaluation.</p></div>
      <figure><img src="assets/two-lights/gamecon.webp" width="1000" height="750" loading="lazy" alt="Team photograph at the GameCon award presentation."><figcaption>01 / GameCon win</figcaption></figure>
      <figure><img src="assets/two-lights/evaluation.webp" width="1000" height="750" loading="lazy" alt="Team with certificates at the project evaluation."><figcaption>02 / Project evaluation win</figcaption></figure>
    </section>`;
  const stage=chapter.querySelector('.light-stage');
  const slider=chapter.querySelector('#light-position');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function setLight(value,y=48){
    stage.style.setProperty('--lx',`${30+value*.2}%`);stage.style.setProperty('--rx',`${70-value*.2}%`);
    stage.style.setProperty('--ly',`${y}%`);stage.style.setProperty('--ry',`${y}%`);
    stage.classList.toggle('lights-together',value>88);slider.value=String(Math.round(value));
  }
  let manual=false,visible=false,scrollFrame=0;
  function scrollLights(){scrollFrame=0;if(manual||reduced.matches||!visible)return;const r=stage.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight*.85-r.top)/(innerHeight*.8)));setLight(progress*100);}
  function requestLights(){if(!scrollFrame&&visible&&!manual)scrollFrame=requestAnimationFrame(scrollLights);}
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;requestLights();}).observe(stage);
  window.addEventListener('scroll',requestLights,{passive:true});
  slider.addEventListener('input',()=>{manual=true;setLight(Number(slider.value));});
  stage.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch' && event.buttons===0)return;
    manual=true;const r=stage.getBoundingClientRect();const x=(event.clientX-r.left)/r.width;
    setLight(Math.max(0,Math.min(100,(1-Math.abs(x-.5)*2)*100)),Math.max(18,Math.min(82,(event.clientY-r.top)/r.height*100)));
  });
  const full=chapter.querySelector('[data-full-scene]');
  full.setAttribute('aria-pressed','false');
  full.addEventListener('click',()=>{const shown=stage.classList.toggle('scene-open');full.setAttribute('aria-pressed',String(shown));full.textContent=shown?'Return to lights':'Show full scene';});
  function motion(){stage.classList.toggle('scene-open',reduced.matches);full.setAttribute('aria-pressed',String(reduced.matches));full.textContent=reduced.matches?'Return to lights':'Show full scene';}
  motion();reduced.addEventListener('change',motion);
  chapter.querySelector('[data-watch]').addEventListener('click',event=>{
    const player=document.createElement('video');player.controls=true;player.playsInline=true;player.preload='none';player.poster='assets/two-lights/gameplay-65.webp';player.src='assets/two-lights/gameplay.mp4';player.setAttribute('aria-label','Two Lights One Escape gameplay');
    chapter.querySelector('.flagship-player').replaceChildren(player);event.currentTarget.hidden=true;
    player.addEventListener('error',()=>{event.currentTarget.hidden=false;event.currentTarget.textContent='Retry gameplay';});
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)player.pause();},{threshold:.01});observer.observe(player);
    }
    player.play().catch(()=>{});player.focus();
  });
}
