import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
export async function mountSketchSea(){
 const stage=document.querySelector('#sketch-stage'),canvas=document.querySelector('#sketch-canvas'),status=document.querySelector('#sketch-status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.4));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-5.8,5.8,3,-3,.1,40);camera.position.set(0,1,12);camera.lookAt(0,0,0);
 const effect=new OutlineEffect(renderer,{defaultThickness:.003,defaultColor:[.13,.11,.09],defaultKeepAlive:true});
 const ink=new THREE.MeshBasicMaterial({color:0x302b26});ink.userData.outlineParameters={visible:false};
 const paper=new THREE.MeshBasicMaterial({color:0xe0d6c3});
 // Object-space crosshatching stays attached to the 3D surface as it turns.
 paper.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 sketchPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nsketchPosition = position;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 sketchPosition;').replace('#include <color_fragment>',`#include <color_fragment>
   float stroke=step(.87,fract((sketchPosition.x+sketchPosition.y*.8+sketchPosition.z*.4)*19.));
   float crossStroke=step(.94,fract((sketchPosition.x-sketchPosition.y)*13.));
   diffuseColor.rgb *= 1.0-.15*stroke-.08*crossStroke;`);
 };
 const whale=new THREE.Group();scene.add(whale);
 function oval(parent,scale,position,material=paper){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),material);mesh.scale.set(...scale);mesh.position.set(...position);parent.add(mesh);return mesh;}
 // Tapered body, broad rounded head, narrow tail stock.
 const vertices=[],indices=[],rings=33,sides=24;
 for(let i=0;i<rings;i++){const u=i/(rings-1),x=-2.2+u*4.1;const radius=Math.pow(Math.sin(Math.PI*u),.55)*(.20+.8*u);
  for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2;vertices.push(x,Math.cos(a)*radius,Math.sin(a)*radius*.78);}}
 for(let i=0;i<rings-1;i++)for(let j=0;j<sides;j++){let a=i*(sides+1)+j,b=a+sides+1;indices.push(a,a+1,b,b,a+1,b+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();whale.add(new THREE.Mesh(geo,paper));
 const tail=new THREE.Group();tail.position.set(-2.05,0,0);whale.add(tail);
 oval(tail,[.65,.09,.38],[-.48,.05,.30]).rotation.y=-.45;
 oval(tail,[.65,.09,.38],[-.48,.05,-.30]).rotation.y=.45;
 const fin=oval(whale,[.62,.07,.22],[.12,-.48,.65]);fin.rotation.z=-.65;fin.rotation.y=-.3;
 const backFin=oval(whale,[.35,.28,.08],[-.8,.45,0]);backFin.rotation.z=-.4;
 oval(whale,[.055,.055,.025],[1.23,.12,.59],ink);
 function line(points,parent=whale,material=new THREE.LineBasicMaterial({color:0x4a4036,transparent:true,opacity:.7})){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  parent.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)),material));
 }
 line([[1.70,-.09,.37],[1.25,-.24,.62],[.70,-.26,.67],[.35,-.23,.66]]);
 for(let i=0;i<5;i++)line([[1.4-i*.10,-.28,.53],[.9-i*.12,-.48,.52],[.25-i*.10,-.53,.46]]);
 const bubbles=[];
 for(let i=0;i<7;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.045+i*.006,.008,4,16),ink);scene.add(ring);bubbles.push(ring);}
 const companion=new THREE.Group();scene.add(companion);companion.visible=false;
 let mascotMixer,mascotLoaded=false,petMode=false,colored=false,loading=false;
 const petMaterials=[];
 async function loadMascot(){
  if(mascotLoaded||loading)return;loading=true;
  try{
   const gltf=await new GLTFLoader().loadAsync('./assets/mascot/pencil-web.glb');
   const model=gltf.scene;const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
   const normalizer=new THREE.Group();normalizer.scale.setScalar(3.7/size.y);model.position.sub(center);normalizer.add(model);companion.add(normalizer);
   model.traverse(o=>{if(!o.isMesh)return;const color=o.material.color.clone();const gray=color.r*.299+color.g*.587+color.b*.114;const material=new THREE.MeshBasicMaterial({color:colored?color:(gray>.12?0xe7ddc9:0x302b26)});material.userData.outlineParameters={thickness:.002};petMaterials.push({material,color});o.material=material;});
   mascotMixer=new THREE.AnimationMixer(model);gltf.animations.forEach(clip=>mascotMixer.clipAction(clip).play());mascotLoaded=true;
  }catch(error){petMode=false;whale.visible=true;companion.visible=false;status.textContent='The pencil could not load. The whale is still here.';console.error(error);}
  loading=false;request();
 }
 let paused=reduced.matches,visible=true,raf=0,last=0,paint=0,time=0,previousPose=0;
 function request(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(frame);}
 function frame(now){raf=0;if(!visible||document.hidden){last=0;return;}if(!paused&&now-paint<70){request();return;}paint=now;
  const dt=last?Math.min((now-last)/1000,.12):0;last=now;if(!paused)time+=dt;
  const t=Math.floor(time*12)/12; // Deliberate held poses, not random camera jitter.
  const rect=stage.getBoundingClientRect();
  const depth=reduced.matches?0:THREE.MathUtils.clamp((innerHeight/2-rect.top-rect.height/2)/innerHeight,-.65,.65);
  whale.position.set(Math.sin(t*.55)*.7+depth*.35,Math.sin(t*1.5)*.13+depth*.3,Math.cos(t*.55)*.65+depth*.4);
  whale.rotation.set(Math.sin(t*1.5)*.045,Math.sin(t*.7)*.30,-.06+Math.sin(t*.9)*.035);
  tail.rotation.x=Math.sin(t*3)*.35;tail.rotation.z=Math.sin(t*3)*.17;fin.rotation.z=-.65+Math.sin(t*3-1)*.13;
  whale.visible=!petMode;companion.visible=petMode&&mascotLoaded;
  companion.position.set(0,Math.sin(t*2)*.07,0);companion.rotation.z=Math.sin(t*2)*.025;
  if(mascotMixer){mascotMixer.update(paused?0:Math.max(0,t-previousPose));}previousPose=t;
  bubbles.forEach((bubble,i)=>{bubble.visible=!petMode;bubble.position.set(-3.3+i*.48,((t*.5+i*.63)%3.2)-1.4,-.5);});
  if(petMode)renderer.render(scene,camera);else effect.render(scene,camera);stage.dataset.pose=String(t);stage.dataset.mode=petMode?'pencil':'whale';
  if(!paused)request();
 }
 function resize(){const r=stage.getBoundingClientRect(),a=r.width/r.height;const h=a<1.1?3.2:2.5;camera.left=-h*a;camera.right=h*a;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix();effect.setSize(r.width,r.height);request();}
 new ResizeObserver(resize).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}request();},{threshold:.01}).observe(stage);
 document.addEventListener('visibilitychange',()=>{last=0;request();});
 window.addEventListener('scroll',()=>{if(visible&&!reduced.matches)request();},{passive:true});
 const pause=document.querySelector('#sketch-pause');
 function announce(){pause.textContent=paused?'Play sketch':'Pause sketch';pause.setAttribute('aria-pressed',String(paused));}
 pause.disabled=false;pause.addEventListener('click',()=>{paused=!paused;last=0;announce();request();});
 const switcher=document.querySelector('#sketch-pet');switcher.disabled=false;
 switcher.addEventListener('click',()=>{petMode=!petMode;switcher.textContent=petMode?'Back to the whale':'Meet the pencil';document.querySelector('#sketch-color').hidden=!petMode;status.textContent=petMode?'Pencil companion study · chatbot connection comes later.':'Sunken Greed · a hand-drawn take on an underwater world.';if(petMode)loadMascot();request();});
 document.querySelector('#sketch-color').addEventListener('click',event=>{colored=!colored;petMaterials.forEach(({material,color})=>{if(colored)material.color.copy(color);else material.color.set(color.r+color.g+color.b>.36?0xe7ddc9:0x302b26);});event.currentTarget.textContent=colored?'Back to graphite':'Bring him to color';request();});
 reduced.addEventListener('change',()=>{if(reduced.matches)paused=true;announce();request();});
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();visible=false;if(raf)cancelAnimationFrame(raf);status.textContent='The 3D sketch was interrupted. Reload to restore it.';});
 stage.setAttribute('aria-busy','false');status.textContent='Sunken Greed · a hand-drawn take on an underwater world.';announce();resize();
}



