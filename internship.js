const entries = [
  ['ink-bleed','Ink Bleed','A drop changes everything.','Place ink carefully, balancing coverage against overflow.',3],
  ['clockwork-path','Clockwork Path','Every turn has consequences.','Connect gears to transfer power with the required speed and direction.',1],
  ['fossil-layer','Fossil Layer','Discovery needs a little restraint.','Remove supporting sediment in the right order to expose a fragile fossil.',3],
  ['glass-resonance','Glass Resonance','Find the shape in the noise.','Balance positive and negative waves to match a target pattern.',3]
];
const collection = document.querySelector('#internship-collection');
for (const [id,title,note,description,count] of entries) {
  const card = document.createElement('article');card.className='specimen';
  const heading = document.createElement('h3');heading.textContent=title;
  const annotation = document.createElement('p');annotation.className='specimen-note';annotation.textContent=note;
  const image = document.createElement('img');image.src=`assets/internship/${id}-0.webp`;image.alt=`${title} — project image 1`;image.loading='lazy';image.decoding='async';
  const text = document.createElement('p');text.textContent=description;
  card.append(annotation,heading,image,text);
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
