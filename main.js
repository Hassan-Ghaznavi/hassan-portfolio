import { decorateFilmScreen } from './story-scenes.js';
import { projects } from './projects.js?v=flow-4';
import { buildTwoLights } from './two-lights.js';

function addText(parent, tag, content, className) {
  const element = document.createElement(tag);
  element.textContent = content;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

const projectIndex = document.querySelector('#projects');
const moreProjects = document.querySelector('#more-projects');

for (const project of projects) {
  const chapter = document.createElement('article');
  chapter.className = 'project';
  chapter.id = project.id;
  const destination=project.collection==='more'?moreProjects:projectIndex;
  if(project.id==='two-lights'){buildTwoLights(chapter,project);projectIndex.append(chapter);continue;}
  if (project.chapterLabel) {
    const masthead = document.createElement('header');
    masthead.className = 'project-masthead';
    addText(masthead, 'span', project.chapterLabel, 'eyebrow');
    const annotation = document.createElement('div');
    addText(annotation, 's', project.rule);
    addText(annotation, 'em', project.correction);
    masthead.append(annotation);
    chapter.append(masthead);
  }
  const copy = document.createElement('div');
  chapter.append(copy);
  addText(copy, 'p', project.tools, 'eyebrow');
  addText(copy, 'h3', project.title);
  if (project.overview) addText(copy, 'p', project.overview, 'project-overview');
  addText(copy, 'strong', project.role);
  addText(copy, 'p', project.contribution);
  if (project.designNote) {
    const note = document.createElement('aside');
    note.className = 'design-note';
    addText(note, 'h4', project.designNote.title);
    addText(note, 'p', project.designNote.text);
    copy.append(note);
  }
  if (project.demo) {
    const demo = addText(copy, 'a', 'Try the browser flight ↗', 'button outline');
    demo.href = project.demo;
  }

  const hasVideo = /^[\w-]{11}$/.test(project.youtubeId ?? '');
  const media = document.createElement('figure');
  media.className = 'project-media';
  media.dataset.motionScene=project.id;
  if (project.cover) {
    const image = document.createElement('img');
    image.src = project.cover.src;
    image.alt = project.cover.alt;
    image.loading = 'lazy';
    media.append(image);
    addText(media, 'figcaption', 'Concept illustration', 'eyebrow');
  }

  if(project.motif==='smile') {
    media.insertAdjacentHTML('beforeend',`<div class="smile-sketch" aria-hidden="true"><svg viewBox="0 0 400 280"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path class="smile-mask" fill="var(--paper)" d="M100 58Q200 18 300 58L285 190Q200 270 115 190Z"/><path d="M99 83L55 63M301 83L345 63"/><path d="M145 108Q164 90 181 108M220 108Q240 90 259 108M150 157Q200 212 254 157"/><path d="M164 174Q202 185 239 173" stroke-width="1"/></g></svg><span class="eyebrow">A sketch in the margins / Game jam notes</span></div>`);
  }
  if(project.studies) {
    const films=document.createElement('div');films.className='film-grid';
    for(const film of project.films||[]){
      const card=document.createElement('article');card.className='film-card';card.id='film-'+film.id;
      const label=document.createElement('p');label.className='eyebrow';label.textContent='Blender / Animated study';
      const heading=document.createElement('h4');heading.textContent=film.title;
      const sketch=document.createElement('div');sketch.className='mini-sketch';sketch.dataset.miniSketch=film.motif;sketch.setAttribute('aria-hidden','true');sketch.innerHTML='<span class="sketch-placeholder">a few lines, a little depth.</span>';
      const screen=document.createElement('div');screen.className='film-screen';
      const poster=document.createElement('img');poster.src=`assets/blender-motion/${film.id}.webp`;poster.alt=film.title+' — frame from Hassan’s Blender animation';poster.loading='lazy';poster.width=960;poster.height=540;screen.append(poster);decorateFilmScreen(screen,film);
      const play=document.createElement('button');play.type='button';play.className='button ink';play.textContent='Play '+film.title+' ▷';
      const note=document.createElement('p');note.textContent=film.note;
      play.addEventListener('click',()=>{
       const video=document.createElement('video');video.controls=true;video.playsInline=true;video.muted=true;video.preload='none';video.poster=poster.src;video.src=`assets/blender-motion/${film.id}.mp4`;video.setAttribute('aria-label',film.title+' Blender animation');screen.replaceChildren(video);play.hidden=true;video.addEventListener('error',()=>{screen.replaceChildren(poster);play.hidden=false;play.textContent='Retry '+film.title+' ▷';},{once:true});
       new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();},{threshold:.05}).observe(video);video.play().catch(()=>{});video.focus();
      });
      card.append(label,heading,sketch,screen,play,note);films.append(card);
    }
    const pauseSketches=document.createElement('button');pauseSketches.type='button';pauseSketches.className='button outline sketches-control';pauseSketches.dataset.miniPause='';pauseSketches.setAttribute('aria-pressed','false');pauseSketches.textContent='Pause 3D sketches';chapter.append(pauseSketches,films);
    const gallery=document.createElement('div');gallery.className='study-gallery';
    for(const study of project.studies){
      const figure=document.createElement('figure');figure.dataset.motionScene=study.id;
      const frame=document.createElement('div');frame.className='study-image';
      const image=document.createElement('img');image.src=`assets/studies/${study.id}.webp`;image.alt=study.title+' — Hassan’s 3D render';image.loading='lazy';image.decoding='async';frame.append(image);
      const caption=document.createElement('figcaption');const title=document.createElement('h4');title.textContent=study.title;const note=document.createElement('p');note.textContent=study.note;caption.append(title,note);figure.append(frame,caption);gallery.append(figure);
    }
    chapter.append(gallery);chapter.classList.add('render-collection');
  }
  if(project.id==='paper-dash') media.insertAdjacentHTML('beforeend',`<svg class="project-paper-plane" viewBox="0 0 180 100" aria-hidden="true"><path d="M5 44L173 5 64 91 59 58Z" fill="var(--paper)" stroke="currentColor" stroke-width="2"/><path d="M59 58L173 5 79 69 64 91" fill="#d9cab3" stroke="currentColor" stroke-width="1.5"/></svg>`);
  if (hasVideo) {
    const play = addText(media, 'button', 'Watch gameplay', 'button ink');
    play.type = 'button';
    play.addEventListener('click', () => {
      const player = document.createElement('iframe');
      player.src = 'https://www.youtube-nocookie.com/embed/' + project.youtubeId + '?autoplay=1';
      player.title = project.title + ' gameplay video';
      player.allow = 'autoplay; encrypted-media; picture-in-picture';
      player.allowFullscreen = true;
      const slot=document.createElement('div');slot.className='inline-video';slot.append(player);media.append(slot);play.hidden=true;
      player.focus();
    });
  }
  if (project.mediaPending && !hasVideo) {
    const placeholder = document.createElement('div');
    placeholder.className = 'gameplay-placeholder';
    addText(placeholder, 'span', 'Gameplay reel', 'eyebrow');
    addText(placeholder, 'p', 'The flight, in motion.');
    addText(placeholder, 'small', 'Gameplay footage coming soon. The artwork above is a concept illustration.');
    media.append(placeholder);
  }
  if (project.cover || hasVideo) {
    chapter.classList.add('illustrated');
    chapter.append(media);
  }
  if (project.mechanics?.length) {
    const notes = document.createElement('section');
    notes.className = 'project-notes';
    notes.setAttribute('aria-label', project.title + ' mechanics');
    addText(notes, 'h4', 'Inside the build');
    project.mechanics.forEach((mechanic, index) => {
      const detail = document.createElement('details');
      addText(detail, 'summary', `${String(index + 1).padStart(2, '0')} — ${mechanic.title}`);
      addText(detail, 'p', mechanic.text);
      notes.append(detail);
    });
    chapter.append(notes);
  }
  if(project.id==='paper-dash')chapter.append(document.querySelector('#flight'));
  destination.append(chapter);
}

document.querySelectorAll('[data-youtube]').forEach(button=>button.addEventListener('click',()=>{
 const player=document.createElement('iframe');player.src='https://www.youtube-nocookie.com/embed/'+button.dataset.youtube+'?autoplay=1';player.title=button.dataset.videoTitle;player.allow='autoplay; encrypted-media; picture-in-picture';player.allowFullscreen=true;button.nextElementSibling.replaceChildren(player);button.hidden=true;
}));

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('reveal-illustration');
      observer.unobserve(entry.target);
    }
  }, { threshold: .25 });
  for (const illustration of projectIndex.querySelectorAll('img')) observer.observe(illustration);
}

const canvas = document.querySelector('#scene');
const context = canvas.getContext('2d');
const button = document.querySelector('#flight-button');
const status = document.querySelector('#flight-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (context) {
  const width = canvas.width;
  const cameraElevation = .7;
  const planeDepth = 1;
  const planeScale = 640 / (planeDepth + 4);
  const height = canvas.height;
  const clamp = (value, low, high) => Math.max(low, Math.min(value, high));
  const gate = { x: 1.28, y: .48, halfWidth: .72, halfHeight: .61 };
  const keys = new Set();
  const directions = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  const facets = [
    { points: [[0, 0, 1.02], [-.57, 0, -.46], [0, -.16, -.27]], color: '#fdf4e5' },
    { points: [[0, 0, 1.02], [.57, 0, -.46], [0, -.16, -.27]], color: '#dbc8af' },
    { points: [[0, 0, 1.02], [0, -.31, -.54], [0, -.16, -.27]], color: '#8e7e6b' }
  ];
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let bank = 0;
  let distance = 17;
  let running = false;
  let waitingForAlignment = false;
  let lastTime = 0;

  // Project world coordinates onto the page with a fixed camera behind the plane.
  function project(x, y, z) {
    const scale = 640 / (z + 4);
    return [width / 2 + x * scale, height * .46 - (y - cameraElevation) * scale];
  }

  function path(points, stroke, fill, lineWidth = 1) {
    context.beginPath();
    for (let index = 0; index < points.length; index++) {
      if (index === 0) context.moveTo(...points[index]);
      else context.lineTo(...points[index]);
    }
    if (fill) {
      context.closePath();
      context.fillStyle = fill;
      context.fill();
    }
    context.lineWidth = lineWidth;
    context.strokeStyle = stroke;
    context.stroke();
  }

  function draw() {
    context.fillStyle = '#eee1cd';
    context.fillRect(0, 0, width, height);
    for (let column = -14; column <= 14; column++) {
      path([project(column, -2.1, .08), project(column, -2.1, 45)], '#6e594933');
    }
    for (let row = .25; row < 45; row += 2.5) {
      path([project(-14, -2.1, row), project(14, -2.1, row)], '#6e594933');
    }
    path([[0, height * .46], [width, height * .46]], '#6e594955');

    const corners = [
      [gate.x - gate.halfWidth, gate.y + gate.halfHeight],
      [gate.x + gate.halfWidth, gate.y + gate.halfHeight],
      [gate.x + gate.halfWidth, gate.y - gate.halfHeight],
      [gate.x - gate.halfWidth, gate.y - gate.halfHeight],
      [gate.x - gate.halfWidth, gate.y + gate.halfHeight]
    ];
    path(corners.map(([gx, gy]) => project(gx, gy, distance)), aligned() ? '#514d3e' : '#ab3427', undefined, 4);

    if (running) {
      const [aimX, aimY] = project(gate.x, gate.y, planeDepth);
      context.beginPath();
      context.arc(aimX, aimY, 15, 0, Math.PI * 2);
      context.lineWidth = 2;
      context.strokeStyle = '#ab3427';
      context.stroke();
      path([[aimX - 6, aimY], [aimX + 6, aimY]], '#ab3427', undefined, 2);
      path([[aimX, aimY - 6], [aimX, aimY + 6]], '#ab3427', undefined, 2);
    }

    const cosine = Math.cos(bank);
    const sine = Math.sin(bank);
    for (const facet of facets) {
      const points = facet.points.map(([px, py, pz]) =>
        project(x + px * cosine - py * sine, y + px * sine + py * cosine, pz + planeDepth));
      path(points, '#43372b', facet.color, 2);
    }
  }

  function aligned() {
    return Math.abs(x - gate.x) < gate.halfWidth
      && Math.abs(y - gate.y) < gate.halfHeight;
  }

  function finish() {
    running = false;
    canvas.classList.remove('playing');
    keys.clear();
    status.textContent = '✓ Flight complete! You cleared the gate.';
    status.classList.add('flight-complete');
    draw();
    status.hidden = false;
    button.textContent = 'Fly again';
    button.hidden = false;
  }

  let flightVisible=true,flightFrame=0;
  function requestFlight(){if(running&&flightVisible&&!document.hidden&&!flightFrame)flightFrame=requestAnimationFrame(frame);}
  new IntersectionObserver(entries=>{flightVisible=entries[0].isIntersecting;lastTime=0;if(!flightVisible&&flightFrame){cancelAnimationFrame(flightFrame);flightFrame=0;}requestFlight();}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{lastTime=0;if(document.hidden&&flightFrame){cancelAnimationFrame(flightFrame);flightFrame=0;}requestFlight();});
  function frame(time) {
    flightFrame=0;if(!running||!flightVisible||document.hidden){lastTime=0;return;}
    const delta = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 0;
    lastTime = time;
    const horizontal = Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft'));
    const vertical = Number(keys.has('ArrowUp')) - Number(keys.has('ArrowDown'));
    targetX = clamp(targetX + horizontal * 2.8 * delta, -2.7, 2.7);
    targetY = clamp(targetY + vertical * 2.8 * delta, -1.15, 1.35);
    const response = 1 - Math.exp(-8 * delta);
    bank += ((reducedMotion.matches ? 0 : clamp((targetX - x) * -.5, -.6, .6)) - bank) * response;
    x += (targetX - x) * response;
    y += (targetY - y) * response;
    const linedUp = aligned();
    const alignmentDistance = 5;
    const holdForAim = distance <= alignmentDistance && !linedUp;
    if (holdForAim !== waitingForAlignment) {
      waitingForAlignment = holdForAim;
      status.textContent = holdForAim ? 'Line up with the red target.' : 'Keep the plane lined up.';
    }
    if (!holdForAim) {
      const nextDistance = distance - delta * 4;
      distance = Math.max(linedUp ? planeDepth : alignmentDistance, nextDistance);
    }
    draw();
    if (distance === planeDepth) finish();
    else requestFlight();
  }

  button.addEventListener('click', () => {
    if (running) return;
    x = y = targetX = targetY = bank = lastTime = 0;
    distance = 17;
    running = true;
    waitingForAlignment = false;
    status.classList.remove('flight-complete');
    status.textContent = 'Move your pointer onto the red circle and hold it there.';
    button.hidden = true;
    canvas.classList.add('playing');
    canvas.focus({ preventScroll: true });
    canvas.scrollIntoView({ block: 'center', behavior: 'instant' });
    requestFlight();
  });

  function steer(event) {
    if (!running || (event.type === 'pointermove' && event.pointerType === 'touch' && !canvas.hasPointerCapture(event.pointerId))) return;
    const bounds = canvas.getBoundingClientRect();
    targetX = clamp(((event.clientX - bounds.left) / bounds.width - .5) * width / planeScale, -2.7, 2.7);
    targetY = clamp(cameraElevation + (.46 - (event.clientY - bounds.top) / bounds.height) * height / planeScale, -1.15, 1.35);
  }

  canvas.tabIndex = 0;
  canvas.addEventListener('pointerdown', event => {
    if (running) canvas.setPointerCapture(event.pointerId);
    steer(event);
  });
  canvas.addEventListener('pointermove', steer);
  canvas.addEventListener('keydown', event => {
    if (!running || !directions.includes(event.key)) return;
    event.preventDefault();
    keys.add(event.key);
  });
  canvas.addEventListener('keyup', event => keys.delete(event.key));
  canvas.addEventListener('blur', () => keys.clear());
  draw();
} else {
  button.hidden = true;
  status.textContent = 'The flight demo needs canvas support.';
}

const flightLink = document.querySelector('#try-flying');
const coverPlane = document.querySelector('.cover-plane');
flightLink.addEventListener('click', event => {
  if (reducedMotion.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (coverPlane.classList.contains('takeoff')) return;
  coverPlane.classList.add('takeoff');
  window.setTimeout(() => {
    coverPlane.classList.remove('takeoff');
    location.hash = 'flight';
    document.querySelector('#flight').scrollIntoView();
  }, 550);
});




// Small vector parts animate independently; offscreen artwork consumes no animation time.
const coverArt=document.querySelector('.cover-art');
const artToggle=document.querySelector('.art-motion-toggle');
let artVisible=false,artPaused=false;
function syncCoverMotion(){coverArt.classList.toggle('art-running',artVisible&&!artPaused&&!reducedMotion.matches&&!document.hidden);}
new IntersectionObserver(entries=>{artVisible=entries[0].isIntersecting;syncCoverMotion();}).observe(coverArt);
artToggle.addEventListener('click',()=>{artPaused=!artPaused;artToggle.textContent=artPaused?'Play sketch':'Pause sketch';artToggle.setAttribute('aria-pressed',String(artPaused));artToggle.setAttribute('aria-label',artPaused?'Play cover animation':'Pause cover animation');syncCoverMotion();});
reducedMotion.addEventListener('change',syncCoverMotion);
document.addEventListener('visibilitychange',syncCoverMotion);
