import bpy,json,sys
from pathlib import Path
base=Path('D:/Documents/Blender projects');out=Path(__file__).resolve().parents[1]/'assets/process';report=[]
for filename,slug in [('airpods.blend','airpods'),('stormy ocean.blend','ocean'),('cave.blend','cave')]:
 if '--skip-airpods' in sys.argv and slug=='airpods':continue
 if '--airpods-only' in sys.argv and slug!='airpods':continue
 if '--refresh' not in sys.argv and (out/(slug+'-solid.png')).exists() and (out/(slug+'-wire.png')).exists():continue
 bpy.ops.wm.open_mainfile(filepath=str(base/filename));s=bpy.context.scene
 s.render.engine='BLENDER_WORKBENCH';s.render.use_freestyle=False;s.render.film_transparent=True;s.render.resolution_x=960;s.render.resolution_y=540;s.render.resolution_percentage=100;s.render.image_settings.media_type='IMAGE';s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.use_compositing=False;s.render.use_sequencer=False
 sh=s.display.shading;sh.background_type='VIEWPORT';sh.background_color=(.88,.83,.74);sh.light='STUDIO';sh.color_type='MATERIAL';sh.show_shadows=True;sh.show_cavity=True;sh.cavity_type='BOTH';sh.show_object_outline=True;sh.show_specular_highlight=False;s.display.render_aa='8'
 # Match ordinary viewport-level subdivision in both views; do not alter the source file.
 for ob in s.objects:
  for mod in ob.modifiers:
   if mod.type=='SUBSURF':mod.render_levels=min(mod.render_levels,1)
   if mod.type=='OCEAN':
    for field in ['resolution','viewport_resolution']:
     if hasattr(mod,field):setattr(mod,field,min(getattr(mod,field),7))
 if slug=='airpods':
  for ob in s.objects:
   if ob.type=='MESH' and ob.name=='Plane':ob.hide_render=True
 s.frame_set(80 if slug=='ocean' else s.frame_current)
 s.render.filepath=str(out/(slug+'-solid.png'))
 if '--wire-only' not in sys.argv:bpy.ops.render.render(write_still=True)
 depsgraph=bpy.context.evaluated_depsgraph_get()
 # Bake world transforms into temporary render-only meshes. Non-uniform or
 # flattened source scales must not magnify the wireframe thickness into spikes.
 for ob in list(s.objects):
  if ob.type not in {'MESH','CURVE','FONT','SURFACE'} or ob.hide_render:continue
  if slug=='airpods' and min(ob.dimensions)<.001:
   ob.hide_render=True;continue
  try:mesh=bpy.data.meshes.new_from_object(ob.evaluated_get(depsgraph),depsgraph=depsgraph)
  except RuntimeError:continue
  if not mesh:continue
  mesh.transform(ob.matrix_world)
  wire=bpy.data.objects.new('Source preview - '+ob.name,mesh)
  for collection in ob.users_collection:collection.objects.link(wire)
  mod=wire.modifiers.new('Source mesh edge display','WIREFRAME');mod.thickness=.0012;mod.use_replace=True;mod.use_even_offset=False
  ob.hide_render=True
 sh.color_type='SINGLE';sh.single_color=(.22,.18,.14);sh.show_shadows=False;sh.show_cavity=False
 s.render.filepath=str(out/(slug+'-wire.png'));bpy.ops.render.render(write_still=True)
 report.append({'source':filename,'frame':s.frame_current,'camera':s.camera.name,'views':'Matched source solid and wireframe previews; viewport subdivision; no source saved'})
 print('Completed source pair:',slug,flush=True)
(out/'source-previews.json').write_text(json.dumps(report,indent=2))
