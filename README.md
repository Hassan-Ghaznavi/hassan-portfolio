# The Manual Is Wrong

Hassan Ghaznavi's game development and 3D environment art portfolio.

## Run locally

    node tools/build-site.mjs
    python -m http.server 4174 --bind 127.0.0.1 --directory dist

Open http://127.0.0.1:4174/. Rebuild dist after changing source files. Vercel runs the same build command and deploys only the explicit asset allowlist in tools/build-site.mjs.

## Project flow

Two Lights One Escape leads the work, followed by Paper Plane Dash (description, click-to-load gameplay, mechanics and browser flight together). Sunken Greed has its own project context, scroll-driven Three.js whale and gameplay. Behind the Smile and three Blender renders follow, before the internship collection and personal background. The avatar has a separate character section.

Add entries to projects.js with id, title, tools, role and contribution. Optional fields include overview, cover: {src, alt}, youtubeId, chapterLabel, rule, correction, and mechanics: [{title, text}]. Set collection: 'more' for the second project group. Studies accept [{id,title,note}] with images under assets/studies. Add approved assets to the build allowlist. Featured chapter index links are maintained in index.html.

## Animation

The cover is editable SVG line art with individually animated elements. Cover animations stop offscreen, when paused, and in hidden tabs. A small static paper texture provides background grain.

scroll-motion.js updates visible project illustrations only on scroll and resize. Paper Plane Dash has a flying paper cutout, Two Lights brings its light windows together on scroll until manual interaction, internship cards have mechanic doodles, and the render gallery has gentle image motion. These presentation effects are not gameplay recordings.

The whale is procedural Three.js geometry with surface hatching and outlines. Its travel is linked to scroll position within a sticky paper stage. The swim cycle runs smoothly while visible. Reduced-motion users receive a stationary scene; Pause sketch stops motion. No pencil model is mixed into this project.

## Pencil companion

The bottom-left launcher is persistent and opens a non-modal guide panel. Its 3D model loads only on first opening and rendering stops while closed or the page is hidden. Escape closes the panel and returns focus to the launcher.

The current guide is a local keyword-based lookup over curated portfolio notes, with section links and an explicit unknown-answer fallback. It is **not a completed RAG system**: document chunking, embeddings/vector retrieval, server-side LLM generation and environment-variable configuration remain to be implemented. No API key belongs in frontend JavaScript.

Pencil (TPOT) by JossyBoy is used under CC BY 4.0. Original model: https://sketchfab.com/3d-models/pencil-tpot-71ff73300d84423ab71afd294b31b8c3 . Materials and whole-body animation were adapted for the portfolio. Attribution is available in the companion panel.

## Avatar

The lazy-loaded viewer uses assets/avatar/hassan-doodle-rigged.glb with Idle, Draw and Point clips, orbit controls, head turning, pause, reset and ink outlines. The Draw clip traces red ink from the animated pencil tip. Rendering pauses offscreen and in hidden tabs, with capped pixel density and a poster fallback. Three.js 0.180.0 and its MIT license are bundled under assets/vendor/three.

## Content permissions and remaining modules

Internship work is shown through approved images only, credited as solo development. Internship gameplay, Unity source, raw project folders and credentials must not enter the public build. See content-permissions.json.

Public gameplay videos load only after a visitor requests them. The Two Lights recording is a compressed approved personal project video; the other gameplay links use YouTube embeds. New render images are compressed WebP assets.

Mobile layout has been checked at 390px width. Physical-device performance still needs measurement. Full RAG integration, contact email delivery, the promotional animation, and final submission documentation remain unfinished.

Live deployment: https://hassan-portfolio-two-rho.vercel.app/
Repository: https://github.com/Hassan-Ghaznavi/hassan-portfolio

## Blender films and 3D project miniatures

The render room includes Cave Scene, Stormy Ocean and AirPods from the supplied project folder. Compressed silent MP4s and poster frames live in assets/blender-motion. Video sources are assigned only after Play is requested, and playback pauses when the video leaves the viewport. The three clips total approximately 3.7 MB. tools/prepare-blender-films.py reproduces these exports from the local originals.

project-sketches.js lazy-loads mini-scenes.js. One shared Three.js renderer uses viewport scissoring to place seven independent miniatures into their cards: falling ink and ripples, coupled extruded gears, exposed fossil layers, oscillating wave bars, cave crystals, a rocking buoy, and an opening earbud case. These are original stylized presentation motifs; the project footage remains separate. Only visible scenes animate, pixel density is capped, hidden tabs suspend rendering, both sketch controls share a pause state, and reduced-motion preferences show stationary scenes. The existing illustrations remain as fallbacks where available.

Sunken Greed is credited as a team project following Hassan's correction. Individual contribution details are still awaiting his description.

## Connected story interactions

story-scenes.js adds scroll-driven sketch-to-final treatments for the Blender film cards, a paper-plane route connecting Paper Plane Dash to its browser demo, pointer-responsive paper-card depth, keyboard/touch note disclosures, contextual Pencil questions/reactions, and optional synthesized sound cues. Sound starts off and needs a user gesture. No external music is used. The sketch treatments are generated from final frames; they are not claimed to be original modeling wireframes.

The Behind the Build divider uses two matched renders of the actual avatar Blender source. tools/render-process-pair.py renders the pair without saving changes to the source. Only compressed WebP images and the small SVG treatments enter dist; the raw PNGs and Blender files stay local. Matching project-specific source comparisons can be added when the cave/ocean/AirPods source files or captures are provided.

## Contact note and email setup

The contact form and paper-fold preview are implemented. api/contact.mjs is a Vercel Node function using Resend through server-side fetch. Configure RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL in the Vercel project, using a sender authorized by your email provider. SITE_URL should match the production origin. See .env.example. Credentials are never copied into dist or sent to the browser.

Until configured, the form clearly reports that delivery is unavailable and disables Send; the fold can still be previewed without transmitting a note. Provider acceptance does not count as delivery: a signed, ten-minute receipt allows polling only that email's status. The success fold runs only after the provider reports delivered, opened or clicked. Notes remain on screen when confirmation is pending or fails.

Validation covers field lengths, email format, header newlines, JSON size, same-origin submissions, a honeypot, and a minimum form-fill time. A bounded per-instance rate limiter provides basic throttling; it is not a shared distributed rate-limit store. Requests use provider idempotency keys so retries of the same accepted note do not duplicate it. No user input or provider credentials are logged by the handler.

Run node tools/check-contact.mjs for isolated validation and delivery-receipt checks. The test replaces the provider fetch locally and never sends email. Real delivery verification still requires configuring the service and receiving a test message in the designated inbox.

For a local preview that also serves the API, rebuild dist then run node tools/serve-story-preview.mjs and open http://127.0.0.1:4175/. The ordinary Python static server does not run Vercel functions.

Provider references: https://vercel.com/docs/functions/runtimes/node-js , https://resend.com/docs/api-reference/emails/send-email , https://resend.com/docs/api-reference/emails/retrieve-email .
