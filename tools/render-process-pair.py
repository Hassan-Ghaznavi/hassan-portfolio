import bpy
from pathlib import Path
root=Path(__file__).resolve().parents[1];out=root/'assets'/'process';out.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(root/'assets/avatar/hassan-doodle-rigged.blend'))
s=bpy.context.scene
rig=bpy.data.objects.get('Hassan_Rig')
if rig and rig.animation_data:
 rig.animation_data.action=None
 for track in rig.animation_data.nla_tracks:track.mute=True
s.frame_set(1);s.render.film_transparent=True
for ob in s.objects:
 if ob.type=='MESH' and any(word in ob.name.lower() for word in ['stage','correction','floor']):ob.hide_render=True
s.render.engine='BLENDER_WORKBENCH';s.render.use_freestyle=False
s.render.resolution_x=700;s.render.resolution_y=800;s.render.resolution_percentage=100
s.render.image_settings.media_type='IMAGE';s.render.image_settings.file_format='PNG'
sh=s.display.shading;sh.light='STUDIO';sh.color_type='MATERIAL';sh.show_shadows=True;sh.show_cavity=True;sh.cavity_type='BOTH';sh.show_object_outline=True;sh.show_specular_highlight=False
sh.background_type='WORLD';s.world.color=(.76,.69,.58);s.display.render_aa='8'
s.render.filepath=str(out/'avatar-finished.png');bpy.ops.render.render(write_still=True)
for ob in s.objects:
 if ob.type!='MESH' or ob.hide_render:continue
 if ob.type=='MESH':
  mod=ob.modifiers.new('Actual mesh topology','WIREFRAME');mod.thickness=.0017;mod.use_replace=True
sh.color_type='SINGLE';sh.single_color=(.25,.19,.13);sh.show_shadows=False;sh.show_cavity=False
s.render.filepath=str(out/'avatar-wire.png');bpy.ops.render.render(write_still=True)
print('Rendered matched geometry comparison without modifying source blend')
