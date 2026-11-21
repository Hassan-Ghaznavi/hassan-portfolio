import { mkdir, copyFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const target = new URL('../dist/', import.meta.url);
await mkdir(target, { recursive: true });
// Explicit deployment allowlist: raw files and recordings never enter the site.
for (const file of ['index.html','styles.css','main.js','projects.js','two-lights.js','internship.js','avatar-preview.js','avatar-scene.js','sketch-preview.js','sketch-sea.js']) {
  await copyFile(new URL(file,root),new URL(file,target));
}
for (const dir of ['assets/vendor','assets/internship','assets/two-lights']) {
  await cp(new URL(dir,root),new URL(dir,target),{recursive:true});
}
await mkdir(new URL('assets/avatar/',target),{recursive:true});
await mkdir(new URL('assets/mascot/',target),{recursive:true});
await copyFile(new URL('assets/mascot/pencil-web.glb',root),new URL('assets/mascot/pencil-web.glb',target));
for (const file of ['assets/controller-cartoon.webp','assets/paper-plane-dash.webp','assets/avatar/hassan-doodle-rigged.glb','assets/avatar/hassan-doodle-final-v2.png']) {
  await copyFile(new URL(file,root),new URL(file,target));
}
console.log(`Prepared website: ${fileURLToPath(target)}`);

