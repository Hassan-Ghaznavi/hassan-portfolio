# The Manual Is Wrong

Hassan Ghaznavi’s portfolio prototype.

## Run locally

From this folder, run:

    python -m http.server 4174 --bind 127.0.0.1

Open http://127.0.0.1:4174/. Select **Try flying**, then **Start flight**. Move the pointer, drag on touch, or use the arrow keys to line up with the gate.

## Add a project

Add an entry to `projects.js` with a unique `id`, `title`, `tools`, `role`, and `contribution`. Optional fields are `cover: { src, alt }` and `youtubeId` (the 11-character video ID). The video player loads on demand. The cover index links to featured entries by ID.

The cover illustration is AI-generated concept art. The approved Blender avatar is now integrated in the Avatar section; real gameplay media remains a later milestone.

## Interactive avatar

Open `http://127.0.0.1:4174/#avatar`. Choose Idle, Draw, or Point; drag to orbit, use the head slider to turn his head, and select Pause to inspect a pose. Reset view restores the camera and head angle. Ink outlines can be toggled independently. The focused canvas supports left/right arrow keys and Home to reset the camera.

The viewer loads near the section and uses the local `assets/avatar/hassan-doodle-rigged.glb`. Three.js 0.180.0 and its MIT license are bundled under `assets/vendor/three`; no runtime CDN is required. Serve over HTTP as above, rather than opening index.html directly.

Animation rendering is capped at 30 fps and suspended offscreen. Pixel density is capped, reduced-motion preference starts the avatar paused, and a poster remains available if loading fails. The Draw clip leaves a red ribbon traced from the animated graphite tip and reveals a Paper Plane Dash link. Select Draw again to clear and replay the ink. Reduced-motion users receive the link immediately. Mobile layout has been checked at 390px width; performance on a physical phone is still to be measured.

Blender source, animation details, and rig validation are documented in `assets/avatar/README.md`. The existing portfolio is still a prototype: RAG, contact delivery, promotional video, and deployment remain separate milestones.

`nProject chapters also accept chapterLabel, rule, correction, mechanics (title/text entries), and mediaPending. Set youtubeId to replace the pending gameplay slot with a click-to-load video. All text is rendered through textContent.

## Deployment preparation
Run node tools/build-site.mjs to produce dist. Vercel uses vercel.json and serves only this explicit asset allowlist. Rebuild dist after edits when previewing that directory. Internship entries use approved images only; gameplay and Unity source must stay private. Remote GitHub repository creation is pending account access.


## Three.js sketch study
The sketch-sea section uses a procedural whale, object-space crosshatching, OutlineEffect, and held poses sampled at 12 fps. The pencil mascot loads only on selection. Rendering pauses offscreen and in hidden tabs; reduced-motion preference starts paused. This is a visual study: the pencil has whole-body motion only and no RAG connection yet. Attribution appears in the page. Its web GLB restores original source colors into unlit base colors.

