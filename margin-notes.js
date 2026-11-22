// Small editorial drawings occupy the margins without hiding content or adding renderers.
const diagrams={
 work:{label:'Different views. Shared solution.',paths:'<circle cx="76" cy="67" r="43"/><circle cx="133" cy="67" r="43"/><path class="accent" d="M104 36L104 99M39 121Q102 148 171 120M158 120L174 119 166 132"/><path d="M43 64H58M153 64H168"/>'},
 'more-work':{label:'Sketch it. Build it. Play it.',paths:'<path d="M24 52L58 32 92 52 58 73ZM24 52V89L58 110 92 89V52M58 73V110M123 41L164 66 123 92ZM188 36V97"/><path class="accent" d="M10 126Q93 112 194 124M178 115L196 124 182 132"/>'},
 skills:{label:'A few tools. Endless combinations.',paths:'<path d="M44 48L107 15 172 48 107 82ZM44 48V102L107 137 172 102V48M107 82V137M75 32L139 66M139 32L75 66M44 75L107 109 172 75"/><path class="accent" d="M17 26L24 17M192 114L205 120M187 130L192 139"/>'},
 about:{label:'A first sketch is only the beginning.',paths:'<path d="M36 103L143 20 153 31 46 114 26 122ZM143 20L152 12 164 24 153 31M36 103L46 114M28 119Q68 143 107 111T194 114"/><path class="accent" d="M178 104L196 114 182 125"/>'}
};
function setup(){
 for(const [id,diagram] of Object.entries(diagrams)){
  const heading=document.querySelector('#'+id+' > .section-heading');if(!heading)continue;
  const note=document.createElement('figure');note.className='margin-annotation';note.setAttribute('aria-hidden','true');note.innerHTML=`<svg viewBox="0 0 220 155" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${diagram.paths}</svg><figcaption>${diagram.label}</figcaption>`;heading.classList.add('has-margin-note');heading.append(note);
 }
 const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('margin-arrived');observer.unobserve(target);}}),{threshold:.15});document.querySelectorAll('.margin-annotation').forEach(node=>observer.observe(node));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
