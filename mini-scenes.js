import * as THREE from 'three';
// A single transparent renderer serves all miniatures using viewport scissoring.
// Each region retains a static illustration if WebGL is unavailable.
export function mountMiniScenes(regions){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<720?1:1.25));renderer.setClearColor(0,0);renderer.autoClear=false;renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.domElement.className='mini-scenes-layer';renderer.domElement.setAttribute('aria-hidden','true');document.body.append(renderer.domElement);
 const paper=new THREE.MeshToonMaterial({color:0xe4d7bf}),red=new THREE.MeshToonMaterial({color:0xb44a35}),dark=new THREE.MeshToonMaterial({color:0x544b40}),light=new THREE.MeshToonMaterial({color:0xf8efdf});
 // A surface-attached pencil grain keeps the objects in the same paper world.
 for(const material of [paper,light])material.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 paperPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\npaperPosition=position;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 paperPosition;').replace('#include <color_fragment>','#include <color_fragment>\nfloat hatch=step(.92,fract((paperPosition.x+paperPosition.y*.8+paperPosition.z*.45)*25.));diffuseColor.rgb*=1.-hatch*.12;');};
 const edgeMaterial=new THREE.LineBasicMaterial({color:0x463e34,transparent:true,opacity:.8});
 function solid(geometry,material,parent,position=[0,0,0]){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...position);parent.add(mesh);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,28),edgeMaterial);mesh.add(edges);return mesh;}
 function ball(parent,scale,position,mat=paper){const m=solid(new THREE.SphereGeometry(1,20,12),mat,parent,position);m.scale.set(...scale);return m;}
 function ring(parent,r,y,mat=dark){const m=solid(new THREE.TorusGeometry(r,.018,4,50),mat,parent,[0,y,0]);m.rotation.x=-Math.PI/2;return m;}
 function curve(parent,points,color=0x5e5142){const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(path.getPoints(70)),new THREE.LineBasicMaterial({color}));parent.add(line);return line;}
 function gear(parent,x,y,radius){const shape=new THREE.Shape();for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;const r=radius*(i%4<2?1:.80);const x=Math.cos(a)*r,y=Math.sin(a)*r;i?shape.lineTo(x,y):shape.moveTo(x,y);}const hole=new THREE.Path();hole.absarc(0,0,radius*.24,0,Math.PI*2,true);shape.holes.push(hole);return solid(new THREE.ExtrudeGeometry(shape,{depth:.32,bevelEnabled:false,curveSegments:20}),paper,parent,[x,y,0]);}
 function roundedBox(w,h,d,r){const shape=new THREE.Shape(),x=-w/2,y=-h/2;shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:5});geometry.translate(0,0,-d/2);return geometry;}
 function create(kind){
  const root=new THREE.Group();let animate=()=>{};
  if(kind==='ink-bleed'){
   const points=[];for(let i=0;i<=22;i++){const u=i/22;points.push(new THREE.Vector2(Math.sin(Math.PI*u)*(.30+.13*(1-u)),u*1.15));}
   const drop=solid(new THREE.LatheGeometry(points,22),red,root);
   const pool=ball(root,[.8,.035,.6],[0,-.68,0],red),ripples=[ring(root,.75,-.62),ring(root,.95,-.63)];
   animate=(t,p)=>{const phase=(t*.42+p*.3)%1;drop.position.y=.50-phase*1.1;drop.scale.setScalar(phase<.82?1:Math.max(.06,(1-phase)/.18));pool.scale.set(.7+Math.sin(phase*Math.PI)*.2,.035,.5+Math.sin(phase*Math.PI)*.16);ripples.forEach((r,i)=>{const v=(phase+i*.3)%1;r.scale.setScalar(.7+v*.7);r.visible=v<.8;});};
  }else if(kind==='clockwork-path'){
   const a=gear(root,-.52,.15,.75),b=gear(root,.66,-.18,.48);root.rotation.x=.25;root.rotation.y=.35;
   animate=(t,p)=>{a.rotation.z=t*.45+p;b.rotation.z=-t*.7-p*1.55;};
  }else if(kind==='fossil-layer'){
   const strata=[];for(let i=0;i<3;i++){const m=solid(new THREE.BoxGeometry(2,.16,1.35),i%2?paper:light,root,[0,-.54+i*.2,0]);strata.push(m);}
   const fossil=new THREE.Group();root.add(fossil);const pts=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*4.5,r=.04+i/90*.45;pts.push([Math.cos(a)*r,.15,Math.sin(a)*r]);}curve(fossil,pts,0xa93f2a);
   root.rotation.set(.40,-.3,.05);
   animate=(t,p)=>{strata[2].position.x=.4+Math.sin(t*.7+p)*.4;strata[2].position.y=.12+Math.sin(t*.7)*.06;fossil.rotation.y=Math.sin(t*.4)*.10;};
  }else if(kind==='glass-resonance'){
   const bars=[];for(let i=0;i<19;i++){bars.push(solid(new THREE.CylinderGeometry(.035,.035,1,6),i%3===0?red:paper,root,[-1.25+i*.14,0,Math.sin(i*.4)*.2]));}root.rotation.y=-.28;
   animate=(t,p)=>bars.forEach((b,i)=>{b.scale.y=.2+Math.abs(Math.sin(i*.42-t*1.7+p))*1.15;});
  }else if(kind==='crystal'){
   const crystals=[];for(let i=0;i<5;i++){const m=solid(new THREE.CylinderGeometry(0,.23,.95+i%3*.25,5),i===2?red:paper,root,[(i-2)*.33,-.1+Math.sin(i)*.15,Math.cos(i)*.15]);m.rotation.z=(i-2)*-.12;crystals.push(m);}solid(new THREE.CylinderGeometry(.85,1,.15,7),dark,root,[0,-.68,0]);
   animate=(t,p)=>{root.rotation.y=Math.sin(t*.35)*.28+(p-.5)*.6;crystals.forEach((c,i)=>c.position.y=-.10+Math.sin(t*1.2+i)*.04);};
  }else if(kind==='buoy'||kind==='storm'){
   const buoy=new THREE.Group();root.add(buoy);
   solid(new THREE.CylinderGeometry(.36,.44,.20,12),dark,buoy,[0,-.4,0]);solid(new THREE.CylinderGeometry(.14,.26,.32,10),paper,buoy,[0,-.15,0]);solid(new THREE.CylinderGeometry(.21,.21,.62,10,true),red,buoy,[0,.32,0]);
   for(let i=0;i<4;i++){const a=i/4*Math.PI*2;solid(new THREE.CylinderGeometry(.025,.025,.85,5),dark,buoy,[Math.cos(a)*.22,.30,Math.sin(a)*.22]);}
   solid(new THREE.ConeGeometry(.30,.19,10),dark,buoy,[0,.82,0]);
   const waves=[];for(let j=0;j<4;j++){const pts=[];for(let i=0;i<=30;i++)pts.push([-1.5+i*.1,-.65, -.9+j*.52]);waves.push(curve(root,pts));}
   const cloud=new THREE.Group();root.add(cloud);cloud.position.set(.2,1.0,-.4);[[-.65,0,0],[0,.13,0],[.65,0,0]].forEach((pos,i)=>ball(cloud,[.50,.25,.27],pos,i===1?paper:dark));
   const boltShape=new THREE.Shape();[[.12,.92],[-.22,.32],[.08,.34],[-.13,-.16],[.5,.50],[.19,.48]].forEach(([x,y],i)=>i?boltShape.lineTo(x,y):boltShape.moveTo(x,y));boltShape.closePath();
   const bolt=solid(new THREE.ExtrudeGeometry(boltShape,{depth:.045,bevelEnabled:false}),red,root,[.55,.1,.25]);
   const rain=[];for(let i=0;i<9;i++){const line=curve(root,[[0,0,0],[.05,-.16,0]],0x8a7c6d);line.position.set(-1.3+i*.3,.55,-.2);rain.push(line);}
   if(kind!=='storm'){cloud.visible=false;bolt.visible=false;rain.forEach(r=>r.visible=false);}
   animate=(t,p)=>{cloud.position.x=.15+Math.sin(t*.35)*.10;bolt.scale.setScalar(.86+Math.sin(t*.8)*.12);bolt.rotation.z=Math.sin(t*.5)*.025;rain.forEach((r,i)=>r.position.y=.75-((t*.45+i*.14)%1.15));buoy.rotation.z=Math.sin(t*1.5)*.15;buoy.position.y=Math.sin(t*1.5)*.09;waves.forEach((wave,j)=>{const pos=wave.geometry.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,-.65+Math.sin(pos.getX(i)*3-t*1.5+j)*.07);pos.needsUpdate=true;});root.rotation.y=(p-.5)*.5;};
  }else if(kind==='mask'){
   const face=ball(root,[.82,1,.18],[0,.1,0],light);
   const smile=curve(root,[[-.46,-.12,.20],[0,-.49,.25],[.46,-.12,.20]],0xa92e21);
   curve(root,[[-.5,.37,.19],[-.33,.47,.24],[-.16,.37,.23]]);curve(root,[[.16,.37,.23],[.33,.47,.24],[.5,.37,.19]]);
   const stick=solid(new THREE.CylinderGeometry(.025,.025,1.1,6),dark,root,[.65,-.68,0]);stick.rotation.z=-.3;
   animate=(t,p)=>{root.rotation.set(Math.sin(t*.5)*.06,(p-.5)*.65+Math.sin(t*.4)*.12,Math.sin(t*.7)*.04);};
  }else if(kind==='orbit'){
   ball(root,[.37,.37,.37],[0,0,0],paper);const satellite=new THREE.Group();root.add(satellite);ball(satellite,[.14,.14,.14],[1.05,0,0],red);
   const orbit=ring(root,1.05,0);root.rotation.x=.4;animate=(t,p)=>{satellite.rotation.y=t*.65+p*2;root.rotation.z=Math.sin(t*.25)*.1;};
  }else if(kind==='pressure'){
   const valves=[];[[-.8,.4,0],[.8,.4,0],[0,-.6,0]].forEach(pos=>{valves.push(solid(new THREE.TorusGeometry(.28,.045,5,20),red,root,pos));ball(root,[.22,.22,.1],pos,paper);});
   curve(root,[[-.8,.4,-.1],[0,-.6,-.1],[.8,.4,-.1],[-.8,.4,-.1]]);animate=(t,p)=>valves.forEach((v,i)=>{v.rotation.z=t*.4+i;v.scale.setScalar(.95+Math.sin(t+i)*.07);});
  }else if(kind==='mirror'){
   const a=solid(new THREE.BoxGeometry(.72,.12,.4),paper,root,[-.65,.4,0]);const b=solid(new THREE.BoxGeometry(.72,.12,.4),paper,root,[.6,-.15,0]);a.rotation.z=.5;b.rotation.z=-.5;
   const beam=curve(root,[[-1.3,-.5,0],[-.65,.4,.1],[.6,-.15,.1],[1.2,.8,0]],0xb44a35);const dot=ball(root,[.08,.08,.08],[-1.3,-.5,0],red);
   animate=(t,p)=>{a.rotation.z=.5+Math.sin(t*.5)*.06;b.rotation.z=-.5+Math.sin(t*.5)*.06;root.rotation.y=(p-.5)*.45;dot.scale.setScalar(.9+Math.sin(t*1.5)*.12);};
  }else if(kind==='brine'){
   solid(roundedBox(1.8,.16,1.1,.16),paper,root,[0,-.4,0]);const grains=[];
   for(let i=0;i<12;i++){const grain=solid(new THREE.OctahedronGeometry(.065),light,root,[(i%4-1.5)*.35,.15+Math.floor(i/4)*.27,(i%3-1)*.25]);grains.push(grain);}
   root.rotation.x=.3;animate=(t,p)=>grains.forEach((g,i)=>{g.position.y=-.12+((t*.2+i*.17)%1)*.9;g.rotation.y=t*.4+i;});
  }else if(kind==='forest'){
   for(let i=0;i<5;i++){const tree=new THREE.Group();root.add(tree);tree.position.set((i-2)*.48,Math.sin(i)*.1,(i%2)*.3);solid(new THREE.CylinderGeometry(.035,.055,.6,5),dark,tree,[0,-.35,0]);solid(new THREE.ConeGeometry(.35,.9,6),i===2?red:paper,tree,[0,.2,0]);}
   animate=(t,p)=>{root.rotation.y=(p-.5)*.45;root.rotation.z=Math.sin(t*.5)*.025;};
  }else if(kind==='bottle'){
   const bottle=solid(roundedBox(.85,1.1,.55,.08),light,root,[0,-.05,0]);solid(new THREE.BoxGeometry(.40,.28,.38),dark,root,[0,.65,0]);solid(new THREE.BoxGeometry(.5,.35,.015),paper,root,[0,-.05,.30]);
   const scent=curve(root,[[.3,.82,0],[.6,1,0],[.3,1.13,0]],0xb44a35);animate=(t,p)=>{root.rotation.y=-.2+Math.sin(t*.35)*.25+(p-.5)*.6;scent.position.y=Math.sin(t*.7)*.06;};
  }else if(kind==='cube'){
   for(let x=0;x<3;x++)for(let y=0;y<3;y++)for(let z=0;z<3;z++)solid(new THREE.BoxGeometry(.36,.36,.36),((x+y+z)%4===0)?red:((x+y)%2?light:paper),root,[(x-1)*.40,(y-1)*.40,(z-1)*.40]);
   animate=(t,p)=>{root.rotation.set(.28+Math.sin(t*.3)*.07,t*.17+p*.6,.1);};
  }else if(kind==='two-lights'){
   const lamps=[];for(let i=0;i<2;i++){const lamp=new THREE.Group();root.add(lamp);lamp.position.x=i?.9:-.9;solid(new THREE.CylinderGeometry(.12,.18,.52,10),dark,lamp);solid(new THREE.ConeGeometry(.28,.28,10),paper,lamp,[0,.37,0]);const beam=solid(new THREE.ConeGeometry(.55,1.15,12,1,true),new THREE.MeshBasicMaterial({color:i?0xb44a35:0xc3a46d,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}),lamp,[0,-.8,0]);lamps.push(lamp);}
   animate=(t,p)=>{lamps.forEach((l,i)=>{l.position.x=(i?1:-1)*(.95-p*.45);l.rotation.z=(i?-1:1)*(.15+Math.sin(t*.6)*.03);});};
  }else if(kind==='earbuds'){
   const body=solid(roundedBox(1.7,.66,.72,.20),light,root,[0,-.3,0]);
   const lid=new THREE.Group();lid.position.set(0,.04,-.35);root.add(lid);solid(roundedBox(1.7,.27,.72,.12),paper,lid,[0,.11,.35]);
   const buds=[];for(let i=0;i<2;i++){const bud=new THREE.Group();root.add(bud);ball(bud,[.22,.16,.23],[0,.1,0],light);solid(new THREE.CylinderGeometry(.075,.085,.65,10),light,bud,[.07,-.25,0]);bud.position.set(i? .44:-.44,.30,0);buds.push(bud);}
   root.rotation.set(.2,-.35,0);
   animate=(t,p)=>{const open=.5+.5*Math.sin(t*.8+p);lid.rotation.x=-open*1.6;buds.forEach((b,i)=>{b.position.y=.28+open*.38+Math.sin(t*1.2+i)*.04;b.rotation.z=Math.sin(t*.8+i)*.1;});root.rotation.y=-.35+Math.sin(t*.3)*.14;};
  }
  return {root,animate};
 }
 const entries=regions.map(node=>{const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xfffaed,0x847460,2.4));const key=new THREE.DirectionalLight(0xffffff,2.5);key.position.set(-3,5,5);scene.add(key);const camera=new THREE.PerspectiveCamera(35,1,.1,30);camera.position.set(0,1.3,5.6);camera.lookAt(0,0,0);const content=create(node.dataset.miniSketch),rig=new THREE.Group(),pointer={x:0,y:0};rig.add(content.root);scene.add(rig);node.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reduced.matches)return;const r=node.getBoundingClientRect();pointer.x=(event.clientX-r.left)/r.width-.5;pointer.y=(event.clientY-r.top)/r.height-.5;request();});node.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;request();});return {node,scene,camera,...content,rig,pointer,visible:false};});
 let raf=0,last=0,time=0,paused=reduced.matches,failed=false;
 const pauses=[...document.querySelectorAll('[data-mini-pause]')];
 function request(){if(!failed&&!raf&&!document.hidden&&entries.some(e=>e.visible))raf=requestAnimationFrame(frame);}
 function frame(now){
  raf=0;if(document.hidden)return;
  const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused)time+=dt;
  renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);
  for(const entry of entries){
   if(!entry.visible)continue;const r=entry.node.getBoundingClientRect();if(r.bottom<=0||r.top>=innerHeight||!r.width||!r.height)continue;
   const p=reduced.matches?.5:Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
   entry.animate(reduced.matches?0:time,p);const follow=1-Math.exp(-9*Math.max(dt,.016));entry.rig.rotation.y=THREE.MathUtils.lerp(entry.rig.rotation.y,reduced.matches?0:entry.pointer.x*.4,follow);entry.rig.rotation.x=THREE.MathUtils.lerp(entry.rig.rotation.x,reduced.matches?0:entry.pointer.y*.2,follow);entry.camera.aspect=r.width/r.height;entry.camera.updateProjectionMatrix();
   renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);renderer.setScissor(Math.max(0,r.left),Math.max(0,innerHeight-r.bottom),Math.min(r.width,innerWidth-r.left),Math.min(r.bottom,innerHeight)-Math.max(r.top,0));renderer.clearDepth();renderer.render(entry.scene,entry.camera);entry.node.classList.add('mini-ready');entry.node.dataset.sketchTime=time.toFixed(2);
  }
  if(!paused)request();
 }
 function resize(){renderer.setSize(innerWidth,innerHeight,false);request();}
 const observer=new IntersectionObserver(changes=>{for(const change of changes){const e=entries.find(e=>e.node===change.target);e.visible=change.isIntersecting;}last=0;if(!entries.some(e=>e.visible)){if(raf)cancelAnimationFrame(raf);raf=0;renderer.setScissorTest(false);renderer.clear();}request();},{threshold:.01});
 entries.forEach(e=>observer.observe(e.node));
 function announce(){pauses.forEach(pause=>{pause.textContent=paused?'Play 3D sketches':'Pause 3D sketches';pause.setAttribute('aria-pressed',String(paused));});}
 pauses.forEach(pause=>pause.addEventListener('click',()=>{paused=!paused;last=0;announce();request();}));
 reduced.addEventListener('change',()=>{paused=reduced.matches;last=0;announce();request();});
 window.addEventListener('resize',resize);window.addEventListener('scroll',request,{passive:true});document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}request();});
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();failed=true;if(raf)cancelAnimationFrame(raf);raf=0;entries.forEach(e=>e.node.classList.remove('mini-ready'));renderer.domElement.hidden=true;});
 announce();resize();
}
