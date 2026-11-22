"""Build an explicit source archive; never walk arbitrary project or secret folders."""
from pathlib import Path
import zipfile,json,hashlib
root=Path(__file__).resolve().parents[1]
archive=root/'output/hassan-portfolio-source.zip';archive.parent.mkdir(exist_ok=True)
files=[]
# The production allowlist already contains only approved presentation media.
for p in (root/'dist/assets').rglob('*'):
 if p.is_file():files.append((p,'source/'+str(p.relative_to(root/'dist')).replace('\\','/')))
for p in root.glob('*.js'):files.append((p,'source/'+p.name))
for name in ['index.html','styles.css','README.md','vercel.json','.env.example','content-permissions.json']:
 files.append((root/name,'source/'+name))
for folder in ['api','lib']:
 for p in (root/folder).glob('*.mjs'):files.append((p,'source/'+str(p.relative_to(root)).replace('\\','/')))
for name in ['build-site.mjs','serve-story-preview.mjs','check-chat.mjs','check-contact.mjs','validate-rig-export.py','build-report.py','package-submission.py','prepare-game-captures.py','render-project-process.py','render-process-pair.py']:
 files.append((root/'tools'/name,'source/tools/'+name))
files.append((root/'assets/avatar/hassan-doodle-rigged.blend','source/assets/avatar/hassan-doodle-rigged.blend'))
files.append((root/'assets/avatar/rig-export-validation.json','evidence/avatar-export-validation.json'))
files.append((root/'assets/mascot/README.md','source/assets/mascot/README.md'))
files.append((root/'output/pdf/hassan-portfolio-implementation-report.pdf','report/hassan-portfolio-implementation-report.pdf'))
for p in (root/'output/screenshots').glob('*.jpg'):files.append((p,'evidence/screenshots/'+p.name))
notes='THE MANUAL IS WRONG - CURRENT SOURCE PACKAGE\nHassan Ghaznavi | Web3D portfolio | 22 November 2026\n\nStart: open source/README.md, then run node tools/build-site.mjs and\nnode tools/serve-story-preview.mjs from source/.\n\nIncludes approved frontend media, backend API routes, rigged Blender source,\nanimated GLB, report, screenshots and validation tools. The rigged .blend is\nsource/assets/avatar/hassan-doodle-rigged.blend.\n\nLIVE REQUIREMENTS STILL PENDING\n- AI provider credentials and real answer/citation evidence.\n- Email provider key, permitted sender, private receiving inbox, delivery evidence.\n- Physical phone testing by the student.\n- Promotional MP4 and After Effects .aep: intentionally deferred.\n\nCredentials, receiving email configuration, raw internship source and gameplay,\nprivate asset collections and unrelated files are not part of this archive.\n'
manifest=[]
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for path,name in files:
  if not path.is_file():raise FileNotFoundError(path)
  assert '.env.local' not in name and '.git/' not in name and not name.endswith(('.keystore','.jks'))
  z.write(path,name);manifest.append({'path':name,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
 z.writestr('START-HERE.txt',notes)
 z.writestr('manifest.json',json.dumps(manifest,indent=2))
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 required=['source/index.html','source/api/chat.mjs','source/api/contact.mjs','source/assets/avatar/hassan-doodle-rigged.blend','source/assets/avatar/hassan-doodle-rigged.glb','report/hassan-portfolio-implementation-report.pdf']
 assert all(name in z.namelist() for name in required)
print(json.dumps({'archive':str(archive),'files':len(manifest),'bytes':archive.stat().st_size,'integrity':'passed','secretsIncluded':False}))
