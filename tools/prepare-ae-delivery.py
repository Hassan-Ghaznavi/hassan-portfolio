"""Prepare the supplied AE archive or a web copy of its selected final export."""
from pathlib import Path
import sys, json, hashlib, zipfile, subprocess

ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('C:/Users/hp/Downloads/The_Manual_Is_Wrong_AE')
FINAL=SOURCE/'MAIN_The_Manual_Is_Wrong_1080p.mp4'
def digest(path):
 h=hashlib.sha256()
 with path.open('rb') as stream:
  for block in iter(lambda:stream.read(1024*1024),b''):h.update(block)
 return h.hexdigest()

if '--archive' in sys.argv:
 out=ROOT/'output/ae-video';out.mkdir(parents=True,exist_ok=True)
 files=sorted(p for p in SOURCE.rglob('*') if p.is_file())
 manifest=[];dest=out/'The_Manual_Is_Wrong_AE.zip'
 with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as archive:
  for path in files:
   before=path.stat();name='The_Manual_Is_Wrong_AE/'+path.relative_to(SOURCE).as_posix()
   archive.write(path,name)
   if (path.stat().st_size,path.stat().st_mtime_ns)!=(before.st_size,before.st_mtime_ns):raise RuntimeError('Source changed during archive preparation')
   manifest.append({'path':name,'bytes':before.st_size,'sha256':digest(path)})
 with zipfile.ZipFile(dest) as archive:
  assert len(archive.infolist())==len(files)
  bad=archive.testzip()
  if bad:raise RuntimeError('Archive integrity error: '+bad)
 result={'archive':dest.name,'bytes':dest.stat().st_size,'sha256':digest(dest),'file_count':len(files),'source_root':SOURCE.name,'selected_film':FINAL.name,'files':manifest}
 (out/'ae-package-manifest.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
 (out/'SHA256SUMS.txt').write_text(result['sha256']+'  '+dest.name+'\n',encoding='utf-8')
 print(json.dumps({k:v for k,v in result.items() if k!='files'}),flush=True)

if '--media' in sys.argv:
 sys.path.insert(0,str(ROOT/'tools/media-deps'))
 import imageio_ffmpeg,cv2
 from PIL import Image
 out=ROOT/'assets/promo';out.mkdir(parents=True,exist_ok=True)
 dest=out/'manual-film.mp4'
 subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(FINAL),'-map','0:v:0','-map','0:a:0','-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-threads','2','-c:a','aac','-b:a','160k','-movflags','+faststart',str(dest)],check=True)
 cap=cv2.VideoCapture(str(FINAL));cap.set(cv2.CAP_PROP_POS_MSEC,3000);ok,frame=cap.read();fps=cap.get(cv2.CAP_PROP_FPS);duration=cap.get(cv2.CAP_PROP_FRAME_COUNT)/fps;cap.release()
 if not ok:raise RuntimeError('No poster frame')
 im=Image.fromarray(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB));im.thumbnail((1280,720));im.save(out/'manual-film.webp',quality=89,method=6)
 metadata={'source':FINAL.name,'source_sha256':digest(FINAL),'web_export':dest.name,'web_sha256':digest(dest),'duration_seconds':duration,'resolution':'1920x1080','audio':'AAC stereo, retained from source','optimization':'H.264 CRF 22; AAC 160k; faststart; click-to-load'}
 (out/'film-info.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
 print(json.dumps({'web_bytes':dest.stat().st_size,**metadata}),flush=True)
