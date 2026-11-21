const entries = [
  ['ink-bleed','Ink Bleed','A drop changes everything.','Place ink carefully, balancing coverage against overflow.',3],
  ['clockwork-path','Clockwork Path','Every turn has consequences.','Connect gears to transfer power with the required speed and direction.',1],
  ['fossil-layer','Fossil Layer','Discovery needs a little restraint.','Remove supporting sediment in the right order to expose a fragile fossil.',3],
  ['glass-resonance','Glass Resonance','Find the shape in the noise.','Balance positive and negative waves to match a target pattern.',3]
];
const collection = document.querySelector('#internship-collection');
for (const [id,title,note,description,count] of entries) {
  const card = document.createElement('article');card.className='specimen';card.dataset.motionScene=id;
  const heading = document.createElement('h3');heading.textContent=title;
  const annotation = document.createElement('p');annotation.className='specimen-note';annotation.textContent=note;
  const image = document.createElement('img');image.src=`assets/internship/${id}-0.webp`;image.alt=`${title} — project image 1`;image.loading='lazy';image.decoding='async';
  const text = document.createElement('p');text.textContent=description;
  const doodle=document.createElement('div');doodle.className='mechanic-doodle';doodle.setAttribute('aria-hidden','true');
  const drawings={
   'ink-bleed':'<path class="ink-drop" d="M65 8Q40 42 46 56Q65 77 84 56Q91 42 65 8Z" fill="#b3402e33"/><path d="M53 48Q49 58 61 61"/>',
   'clockwork-path':'<g class="gear-doodle"><circle cx="65" cy="39" r="21"/><circle cx="65" cy="39" r="7"/><path d="M65 7V18M65 60V71M33 39H44M86 39H97M42 16L50 24M80 54L88 62M42 62L50 54M80 24L88 16" stroke-width="6"/></g>',
   'fossil-layer':'<path d="M22 58Q45 44 65 55T112 53M17 69Q45 57 65 67T117 64M60 49Q34 25 57 13Q79 4 89 25Q98 48 76 47Q59 45 64 29Q70 17 78 31"/>',
   'glass-resonance':'<path class="wave-doodle" d="M5 39Q20 2 35 39T65 39T95 39T125 39"/><path d="M5 49Q20 15 35 49T65 49T95 49T125 49" opacity=".25"/>'
  };
  doodle.innerHTML=`<svg viewBox="0 0 130 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${drawings[id]}</svg>`;
  card.append(annotation,heading,doodle,image,text);
  if(count>1){
    let index=0;
    const next=document.createElement('button');next.className='button outline';next.type='button';next.textContent=`Next image · 1 / ${count}`;
    next.setAttribute('aria-label',`Next ${title} image`);
    next.addEventListener('click',()=>{index=(index+1)%count;image.src=`assets/internship/${id}-${index}.webp`;image.alt=`${title} — project image ${index+1}`;next.textContent=`Next image · ${index+1} / ${count}`;});
    card.append(next);
  }
  collection.append(card);
}
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('specimen-visible');observer.unobserve(e.target);}}, {threshold:.12});
 collection.querySelectorAll('.specimen').forEach(card=>observer.observe(card));
}
