// An explicit, keyboard-accessible index; no polling or background animation.
const chapters=[['two-lights','Two Lights One Escape','Unity · award-winning co-op'],['paper-dash','Paper Plane Dash','Unreal Engine · flight'],['sketch-sea','Sunken Greed','VR · underwater'],['blender-studies','The render room','Blender · environments and animation'],['internship','AIRIDEV field book','Internship · game collection'],['about','Meet the maker','Background and story'],['skills','Toolkit','Skills and technologies'],['avatar','Meet my sketch','Interactive 3D avatar'],['contact','Leave a note','Contact Hassan']];
const trigger=document.createElement('button');trigger.type='button';trigger.className='sound-toggle';trigger.textContent='Find a chapter';trigger.setAttribute('aria-haspopup','dialog');document.querySelector('.site-header nav').append(trigger);
const dialog=document.createElement('dialog');dialog.className='chapter-finder';dialog.setAttribute('aria-labelledby','chapter-finder-title');
const title=document.createElement('h2');title.id='chapter-finder-title';title.textContent='Where shall we go?';
const close=document.createElement('button');close.type='button';close.className='button outline';close.textContent='Close ×';
const input=document.createElement('input');input.type='search';input.placeholder='Try Blender, Unity, VR…';input.setAttribute('aria-label','Search portfolio chapters');
const list=document.createElement('nav');list.setAttribute('aria-label','Matching chapters');
const empty=document.createElement('p');empty.textContent='No matching chapters. Try another word.';empty.hidden=true;
for(const [id,name,description] of chapters){if(!document.getElementById(id))continue;const a=document.createElement('a');a.href='#'+id;a.textContent=name;const small=document.createElement('small');small.textContent=description;a.append(small);a.dataset.search=(name+' '+description).toLowerCase();a.addEventListener('click',()=>dialog.close());list.append(a);}
const cv=document.createElement('a');cv.href='assets/documents/hassan-ghaznavi-cv.pdf';cv.download='Hassan-Ghaznavi-CV.pdf';cv.className='button ink';cv.textContent='Download CV ↓';
dialog.append(close,title,input,list,empty,cv);document.body.append(dialog);
function open(){input.value='';filter();dialog.showModal();input.focus();}
function filter(){let count=0;for(const link of list.children){link.hidden=!link.dataset.search.includes(input.value.trim().toLowerCase());if(!link.hidden)count++;}empty.hidden=count>0;}
trigger.addEventListener('click',open);input.addEventListener('input',filter);close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>trigger.focus({preventScroll:true}));
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(!dialog.open)open();else dialog.close();}});
