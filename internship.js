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
const search=document.createElement('label');search.className='collection-search';search.innerHTML='Find a game<input type="search" placeholder="Try ink, mirrors, waves…" aria-controls="internship-collection"><span role="status" aria-live="polite">7 games in the collection</span>';collection.before(search);
search.querySelector('input').addEventListener('input',event=>{const query=event.target.value.trim().toLowerCase();let count=0;collection.querySelectorAll('.specimen').forEach(card=>{card.hidden=!card.textContent.toLowerCase().includes(query);if(!card.hidden)count++;});search.querySelector('span').textContent=count?`${count} ${count===1?'game':'games'} in the collection`:'No games match. Try another word.';});
for(const entry of entries){
 const {id,title,note,description,kind}=entry;
 const card=document.createElement('article');card.className='specimen';card.id=id;card.dataset.motionScene=id;
 const label=document.createElement('p');label.className='specimen-note';label.textContent=note;
 const heading=document.createElement('h3');heading.textContent=title;
 const miniature=document.createElement('div');miniature.className='mechanic-doodle mini-sketch';miniature.dataset.miniSketch=kind;miniature.setAttribute('aria-hidden','true');miniature.innerHTML='<svg viewBox="0 0 200 100"><path d="M20 80Q60 25 100 60T180 35" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
 const viewer=document.createElement('div');viewer.className='game-capture';
 const image=document.createElement('img');image.src=`assets/internship/${id}-play-0.webp`;image.alt=`${title}: actual game screen, view 1`;image.loading='lazy';image.decoding='async';image.width=640;image.height=1080;viewer.append(image);
 const thumbs=document.createElement('div');thumbs.className='capture-thumbs';thumbs.setAttribute('role','group');thumbs.setAttribute('aria-label',title+' screenshots');
 for(let i=0;i<3;i++){const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`${title} screenshot ${i+1}`);button.setAttribute('aria-pressed',String(i===0));const thumb=document.createElement('img');thumb.src=`assets/internship/${id}-play-${i}.webp`;thumb.alt='';thumb.loading='lazy';thumb.width=60;thumb.height=100;button.append(thumb);button.addEventListener('click',()=>{image.src=thumb.src;image.alt=`${title}: actual game screen, view ${i+1}`;thumbs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});thumbs.append(button);}
 const text=document.createElement('p');text.textContent=description;
 const credit=document.createElement('span');credit.className='capture-credit';credit.textContent='Actual game screens · Solo development';
 card.append(label,heading,miniature,viewer,thumbs,credit,text);collection.append(card);
}
