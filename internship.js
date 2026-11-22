const entries=[
 {id:'ink-bleed',title:'Ink Bleed',note:'A drop changes everything.',description:'Place ink carefully, balancing coverage against overflow.',kind:'ink-bleed'},
 {id:'fossil-layer',title:'Fossil Layer',note:'Leave the discovery intact.',description:'Remove supporting sediment in the right order to expose a fragile fossil.',kind:'fossil-layer'},
 {id:'glass-resonance',title:'Glass Resonance',note:'Find the shape in the noise.',description:'Balance positive and negative waves to match a target pattern.',kind:'glass-resonance'},
 {id:'orbit-switch',title:'Orbit Switch',note:'Timing changes your orbit.',description:'A space puzzle with orbiting worlds, stars and switching paths.',kind:'orbit'},
 {id:'pressure-vent',title:'Pressure Vent',note:'A little balance under pressure.',description:'A network of connected valves turns pressure into a visual puzzle.',kind:'pressure'},
 {id:'mirror-maze',title:'Mirror Maze',note:'Take a different angle.',description:'Mirrors and a light beam turn a maze into a puzzle of reflections.',kind:'mirror'},
 {id:'brine-cure',title:'Brine Cure',note:'Small choices. Even coverage.',description:'A touch-driven puzzle about placing salt and balancing the cure.',kind:'brine'}
];
const collection=document.querySelector('#internship-collection');
const host=document.querySelector('#internship'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const intro=document.createElement('div');intro.className='internship-intro';
const heading=host.querySelector('.section-heading'),description=host.querySelector('.collection-intro');
const copy=document.createElement('div');copy.append(heading,description);
const book=document.createElement('button');book.type='button';book.className='collection-book';book.id='collection-book';book.setAttribute('aria-expanded','false');book.setAttribute('aria-controls','internship-pages');book.setAttribute('aria-label','Open the AIRIDEV project book');
book.innerHTML='<span class="book-page-stack" aria-hidden="true"></span><span class="book-face"><span class="book-label">THE INTERNSHIP FIELD BOOK</span><span class="book-title">Small games.<br>Big ideas.</span><svg viewBox="0 0 200 115" aria-hidden="true"><path d="M18 83Q45 30 69 69T115 53T179 60M164 52L181 60 168 71"/><circle cx="54" cy="31" r="17"/><path d="M54 9V16M54 46V53M32 31H39M69 31H76M42 19L46 23M65 42L70 47"/><path d="M119 16L139 42 109 48Z"/></svg><span class="book-meta">AIRIDEV · SOLO DEVELOPMENT<br>'+entries.length+' PROJECTS INSIDE</span><span class="book-action">Open the collection</span></span>';
intro.append(copy,book);host.prepend(intro);
const pages=document.createElement('div');pages.id='internship-pages';pages.className='internship-pages';pages.hidden=true;
const toolbar=document.createElement('div');toolbar.className='book-toolbar';toolbar.innerHTML='<div><p class="eyebrow">Inside the field book</p><h3>Seven experiments in play.</h3></div>';
const close=document.createElement('button');close.type='button';close.className='button outline';close.textContent='Close the book';toolbar.append(close);pages.append(toolbar,host.querySelector('#sketches-pause'),collection);host.append(pages);
const end=document.createElement('button');end.type='button';end.className='button outline book-end';end.textContent='Close the book';pages.append(end);
function setBook(open,scroll=false){if(open)pages.querySelectorAll('img[data-src]').forEach(image=>{image.src=image.dataset.src;delete image.dataset.src;});pages.hidden=!open;book.setAttribute('aria-expanded',String(open));book.setAttribute('aria-label',open?'Close the AIRIDEV project book':'Open the AIRIDEV project book');book.classList.toggle('book-is-open',open);book.querySelector('.book-action').textContent=open?'Collection is open':'Open the collection';if(scroll&&open)pages.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});if(!open){book.focus({preventScroll:true});book.scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'});}}
book.addEventListener('click',()=>setBook(pages.hidden,true));close.addEventListener('click',()=>setBook(false));end.addEventListener('click',()=>setBook(false));
function revealLinkedProject(){const id=decodeURIComponent(location.hash.slice(1));if(entries.some(e=>e.id===id)){setBook(true);resetSearch();requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'}));}}
window.addEventListener('hashchange',revealLinkedProject);

const search=document.createElement('label');search.className='collection-search';search.innerHTML='Find a game<input type="search" placeholder="Try ink, mirrors, waves…" aria-controls="internship-collection"><span role="status" aria-live="polite">'+entries.length+' games in the collection</span>';collection.before(search);
search.querySelector('input').addEventListener('input',event=>{const query=event.target.value.trim().toLowerCase();let count=0;collection.querySelectorAll('.specimen').forEach(card=>{card.hidden=!card.textContent.toLowerCase().includes(query);if(!card.hidden)count++;});search.querySelector('span').textContent=count?`${count} ${count===1?'game':'games'} in the collection`:'No games match. Try another word.';});
for(const entry of entries){
 const {id,title,note,description,kind}=entry;
 const card=document.createElement('article');card.className='specimen';card.id=id;card.dataset.motionScene=id;
 const label=document.createElement('p');label.className='specimen-note';label.textContent=note;
 const heading=document.createElement('h3');heading.textContent=title;
 const miniature=document.createElement('div');miniature.className='mechanic-doodle mini-sketch';miniature.dataset.miniSketch=kind;miniature.setAttribute('aria-hidden','true');miniature.innerHTML='<svg viewBox="0 0 200 100"><path d="M20 80Q60 25 100 60T180 35" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
 const viewer=document.createElement('div');viewer.className='game-capture';
 const image=document.createElement('img');image.dataset.src=`assets/internship/${id}-play-0.webp`;image.alt=`${title}: actual game screen, view 1`;image.loading='lazy';image.decoding='async';image.width=640;image.height=1080;viewer.append(image);
 const thumbs=document.createElement('div');thumbs.className='capture-thumbs';thumbs.setAttribute('role','group');thumbs.setAttribute('aria-label',title+' screenshots');
 for(let i=0;i<3;i++){const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`${title} screenshot ${i+1}`);button.setAttribute('aria-pressed',String(i===0));const thumb=document.createElement('img');thumb.dataset.src=`assets/internship/${id}-play-${i}.webp`;thumb.alt='';thumb.loading='lazy';thumb.width=60;thumb.height=100;button.append(thumb);button.addEventListener('click',()=>{image.src=thumb.src;image.alt=`${title}: actual game screen, view ${i+1}`;thumbs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});thumbs.append(button);}
 const text=document.createElement('p');text.textContent=description;
 const credit=document.createElement('span');credit.className='capture-credit';credit.textContent='Actual game screens · Solo development';
 card.append(label,heading,miniature,viewer,thumbs,credit,text);collection.append(card);
}

function resetSearch(){search.querySelector('input').value='';collection.querySelectorAll('.specimen').forEach(card=>card.hidden=false);search.querySelector('span').textContent=`${entries.length} games in the collection`;}
revealLinkedProject();

// Reopen even when a citation repeats the current hash after the book was closed.
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const id=link.getAttribute('href').slice(1);if(entries.some(e=>e.id===id)){setBook(true);resetSearch();requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'}));}});
