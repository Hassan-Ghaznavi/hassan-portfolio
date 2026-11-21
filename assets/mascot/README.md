# Pencil assistant source

## Prepared motion pass

`pencil-animated.blend` and `pencil-animated.glb` restore visible source emission colors and add a whole-character control named CTRL_Pencil_Body. The Wake action is a 72-frame squash, hop and settling sway at 24 fps. `pencil-wake-preview.mp4` is the rendered motion study. This is an object animation control, not a skeletal limb rig; the face and limbs retain the original pose. The full Hassan-to-sketch transformation is still pending.

Modifications: material reconstruction and whole-body animation by the portfolio project. Original creator attribution below is retained.

Original file supplied by Hassan: pencil_tpot.glb. Preserved as pencil-original.glb.

Embedded asset attribution: **Pencil (TPOT)** by **JossyBoy** (https://sketchfab.com/JossyBoy).
Source: https://sketchfab.com/3d-models/pencil-tpot-71ff73300d84423ab71afd294b31b8c3
License recorded in the GLB: **CC BY 4.0**, http://creativecommons.org/licenses/by/4.0/.
Retain attribution when used in the portfolio; document subsequent modifications.

The supplied asset contains materials but no image textures, skeleton, or animation clips. pencil-preparation.blend is an imported preparation scene, not a completed animation rig. inspection.json records mesh statistics. The original model is unmodified.

Planned sequence: Hassan becomes a floating graphite sketch, draws the pencil assistant, the assistant fills with color and wakes up, then Hassan returns. A short rendered transition will hand over to the live assistant. The RAG backend is a separate pending component.
