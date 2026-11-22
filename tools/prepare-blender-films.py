import sys,subprocess,concurrent.futures
from pathlib import Path
import cv2
from PIL import Image
sys.path.insert(0,'tools/media-deps');import imageio_ffmpeg
exe=imageio_ffmpeg.get_ffmpeg_exe();out=Path('assets/blender-motion');out.mkdir(exist_ok=True)
clips=[('Airpods.mp4','airpods',9),('Cave Scene.mp4','cave',6.5),('StormyOcean.mp4','ocean',3)]
def prepare(item):
 name,slug,at=item;src=Path('D:/Projects Videos and Info')/name
 subprocess.run([exe,'-hide_banner','-loglevel','error','-y','-i',str(src),'-vf',('scale=848:-2' if slug=='cave' else 'scale=960:-2'),'-c:v','libx264','-preset','slow','-crf','25','-pix_fmt','yuv420p','-map','0:v:0','-map','0:a?','-c:a','aac','-b:a','128k','-movflags','+faststart',str(out/(slug+'.mp4'))],check=True)
 cap=cv2.VideoCapture(str(src));cap.set(cv2.CAP_PROP_POS_MSEC,at*1000);ok,frame=cap.read();cap.release()
 if ok:
  im=Image.fromarray(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB));im.thumbnail((960,600));im.save(out/(slug+'.webp'),quality=82,method=6)
 return (slug,(out/(slug+'.mp4')).stat().st_size)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(prepare,clips):print(result)
