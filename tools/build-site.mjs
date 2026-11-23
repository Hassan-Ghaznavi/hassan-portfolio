import { mkdir, copyFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const target = new URL('../dist/', import.meta.url);
// The generated dist directory is the only cleanup target.
if(fileURLToPath(target)!==fileURLToPath(new URL('../dist/',import.meta.url)))throw Error('Unexpected build output');
await rm(target,{recursive:true,force:true});
await mkdir(target, { recursive: true });
// Explicit deployment allowlist: raw files and recordings never enter the site.
for (const file of ['video-controls.js','preferences.js','index.html','styles.css','main.js','projects.js','two-lights.js','internship.js','avatar-preview.js','avatar-scene.js','sketch-preview.js','sketch-sea.js','scroll-motion.js','companion.js','companion-scene.js','project-sketches.js','mini-scenes.js','story-scenes.js','contact.js','manual.js','margin-notes.js','portfolio-notes.js']) {
  await copyFile(new URL(file,root),new URL(file,target));
}
for (const dir of ['assets/vendor','assets/two-lights','assets/studies','assets/blender-motion']) {
  await cp(new URL(dir,root),new URL(dir,target),{recursive:true});
}
await mkdir(new URL('assets/avatar/',target),{recursive:true});
await mkdir(new URL('assets/mascot/',target),{recursive:true});
await copyFile(new URL('assets/mascot/pencil-web.glb',root),new URL('assets/mascot/pencil-web.glb',target));
for (const file of ['assets/paper-grain.webp','assets/avatar/hassan-doodle-rigged.glb','assets/avatar/hassan-doodle-final-v2.png']) {
  await copyFile(new URL(file,root),new URL(file,target));
}
console.log(`Prepared website: ${fileURLToPath(target)}`);


await mkdir(new URL('assets/process/',target),{recursive:true});
for(const file of ['cave-solid.webp','cave-wire.webp','ocean-solid.webp','ocean-wire.webp','airpods-solid.webp','airpods-wire.webp','avatar-finished.webp','avatar-wire.webp','cave-sketch.svg','ocean-sketch.svg','airpods-sketch.svg']) await copyFile(new URL('assets/process/'+file,root),new URL('assets/process/'+file,target));

await mkdir(new URL('assets/internship/',target),{recursive:true});
for(const slug of ['ink-bleed','fossil-layer','glass-resonance','orbit-switch','pressure-vent','mirror-maze','brine-cure'])for(let i=0;i<3;i++)await copyFile(new URL(`assets/internship/${slug}-play-${i}.webp`,root),new URL(`assets/internship/${slug}-play-${i}.webp`,target));
await mkdir(new URL('assets/project-frames/',target),{recursive:true});
for(const slug of ['paper-dash','behind-smile'])await copyFile(new URL(`assets/project-frames/${slug}.webp`,root),new URL(`assets/project-frames/${slug}.webp`,target));

await mkdir(new URL('lib/',target),{recursive:true});
await copyFile(new URL('lib/retrieval.mjs',root),new URL('lib/retrieval.mjs',target));
