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

## Doodle companion

The bottom-right Doodle launcher is persistent and opens a non-modal guide panel. Its 3D model loads only on first opening and rendering stops while closed or the page is hidden. Escape closes the panel and returns focus to the launcher.

Doodle uses a shared curated corpus in portfolio-notes.js. Without server credentials, the client searches normalized sparse TF-IDF vectors and clearly labels the mode as Local portfolio notes. This local mode does not claim to be LLM generation.

api/chat.mjs implements the full optional RAG route: approved source notes are divided into overlapping chunks, embedded with text-embedding-3-small (512 dimensions), cached in a per-instance in-memory vector index, and ranked by cosine similarity with a small lexical relevance boost. The best three chunks ground a structured Responses API answer. Only validated citations to those retrieved chunks reach the interface. Unknown details, unsupported citations and provider failures have explicit fallbacks. No private source code, visitor conversation history or raw CV is uploaded. AI requests use store:false. The in-memory index is rebuilt after a cold start; a persistent vector service would be appropriate if the corpus grows substantially.

Set OPENAI_API_KEY in Vercel to enable live AI; optional RAG_CHAT_MODEL and RAG_EMBEDDING_MODEL override the defaults. The current deployment has no provider credentials, so live LLM verification remains pending. Run node tools/check-chat.mjs for mocked retrieval, grounding/citation, configuration and failure checks without paid calls. Official API references: https://developers.openai.com/api/docs/guides/embeddings and https://developers.openai.com/api/docs/guides/structured-outputs .

Pencil (TPOT) by JossyBoy is used under CC BY 4.0. Original model: https://sketchfab.com/3d-models/pencil-tpot-71ff73300d84423ab71afd294b31b8c3 . Materials and whole-body animation were adapted for the portfolio. Attribution is available in the companion panel.

## Avatar

The lazy-loaded viewer uses assets/avatar/hassan-doodle-rigged.glb with Idle, Draw and Point clips, orbit controls, head turning, pause, reset and ink outlines. The Draw clip traces red ink from the animated pencil tip. Rendering pauses offscreen and in hidden tabs, with capped pixel density and a poster fallback. Three.js 0.180.0 and its MIT license are bundled under assets/vendor/three.

## Content permissions and remaining modules

Internship work is shown through approved images only, credited as solo development. Internship gameplay, Unity source, raw project folders and credentials must not enter the public build. See content-permissions.json.

Public gameplay videos load only after a visitor requests them. The Two Lights recording is a compressed approved personal project video; the other gameplay links use YouTube embeds. New render images are compressed WebP assets.

Mobile layout has been checked at 390px width. Physical-device performance still needs measurement. Live AI verification, contact email delivery, the deferred promotional animation, and final submission evidence remain unfinished.

Live deployment: https://hassan-portfolio-two-rho.vercel.app/
Repository: https://github.com/Hassan-Ghaznavi/hassan-portfolio

## Blender films and 3D project miniatures

The render room includes Cave Scene, Stormy Ocean and AirPods from the supplied project folder. Compressed silent MP4s and poster frames live in assets/blender-motion. Video sources are assigned only after Play is requested, and playback pauses when the video leaves the viewport. The three clips total approximately 3.7 MB. tools/prepare-blender-films.py reproduces these exports from the local originals.

project-sketches.js lazy-loads mini-scenes.js. One shared Three.js renderer uses viewport scissoring to place fifteen independent miniatures into their cards: falling ink and ripples, coupled extruded gears, exposed fossil layers, oscillating wave bars, cave crystals, a storm buoy with sketched lightning, an opening earbud case, a theatre mask, twin lights, orbiting worlds, valves, reflected light, salt grains, trees, a perfume bottle and a cube. These are original stylized presentation motifs; the project footage remains separate. Only visible scenes animate, pixel density is capped, hidden tabs suspend rendering, both sketch controls share a pause state, and reduced-motion preferences show stationary scenes. The existing illustrations remain as fallbacks where available.

Sunken Greed is credited as a team project following Hassan's correction. Hassan confirmed asset integration, shared programming, and story development as his contributions.

## Connected story interactions

story-scenes.js adds scroll-driven sketch-to-final treatments for the Blender film cards, a paper-plane route connecting Paper Plane Dash to its browser demo, pointer-responsive paper-card depth, keyboard/touch note disclosures, contextual Doodle questions/reactions, and optional synthesized sound cues. Sound starts off and needs a user gesture. No external music is used. The sketch treatments are generated from final frames; they are not claimed to be original modeling wireframes.

The Behind the Build divider uses two matched renders of the actual avatar Blender source. tools/render-process-pair.py renders the pair without saving changes to the source. Only compressed WebP images and the small SVG treatments enter dist; the raw PNGs and Blender files stay local. Project-specific source comparisons are now included for the cave, ocean and AirPods from the supplied original files.

## Contact note and email setup

The contact form and paper-fold preview are implemented. api/contact.mjs is a Vercel Node function using Resend through server-side fetch. Configure RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL in the Vercel project, using a sender authorized by your email provider. SITE_URL should match the production origin. See .env.example. Credentials are never copied into dist or sent to the browser.

Until configured, the form clearly reports that delivery is unavailable and disables Send; the fold can still be previewed without transmitting a note. Provider acceptance does not count as delivery: a signed, ten-minute receipt allows polling only that email's status. The success fold runs only after the provider reports delivered, opened or clicked. Notes remain on screen when confirmation is pending or fails.

Validation covers field lengths, email format, header newlines, JSON size, same-origin submissions, a honeypot, and a minimum form-fill time. A bounded per-instance rate limiter provides basic throttling; it is not a shared distributed rate-limit store. Requests use provider idempotency keys so retries of the same accepted note do not duplicate it. No user input or provider credentials are logged by the handler.

Run node tools/check-contact.mjs for isolated validation and delivery-receipt checks. The test replaces the provider fetch locally and never sends email. Real delivery verification still requires configuring the service and receiving a test message in the designated inbox.

For a local preview that also serves the API, rebuild dist then run node tools/serve-story-preview.mjs and open http://127.0.0.1:4175/. The ordinary Python static server does not run Vercel functions.

Provider references: https://vercel.com/docs/functions/runtimes/node-js , https://resend.com/docs/api-reference/emails/send-email , https://resend.com/docs/api-reference/emails/retrieve-email .


### Project-specific Blender source comparisons

The provided D:/Documents/Blender projects folder contains the original airpods.blend, stormy ocean.blend and cave.blend files. Each Blender film card now includes its own Behind the Build comparison using matched solid and wireframe previews from those sources. These previews use source cameras and the same frame in both views, with viewport-level subdivision for readability and rendering cost. They are distinct from the finished animation and from the stylized sketch-to-final-frame reveal.

tools/render-project-process.py reads the sources with Blender auto-execution disabled, prepares temporary render-only geometry and outputs comparison images without saving the original files. Flat AirPods decals and its studio floor are omitted from the wireframe presentation to avoid degenerate display geometry. Only compressed preview images enter the public build; original .blend files remain local.


## Manual opening and refreshed collection

manual.js adds a short CSS 3D book opening with Hassan’s name, a skip control, a footer replay button, session-only replay suppression, and reading progress. Reduced-motion visitors bypass the opening. Desktop avatar animation now follows display frames; mobile retains its lighter frame budget. Whale travel uses delta-time smoothing. Shared miniatures remain visibility-driven.

The AIRIDEV collection now uses 21 actual game captures from approved publishing folders, with seven cards, selectable thumbnail strips and a local search. Old promotional artwork is excluded from the clean build. Paper Plane Dash and Behind the Smile use actual preview frames from their linked YouTube videos. All internship recordings and source files remain excluded.


## Current verification and submission report

output/pdf/hassan-portfolio-implementation-report.pdf is a working implementation report with module mapping, architecture, source permissions, screenshots, verification and the remaining live-service/video evidence. It is not marked as a finished semester submission. tools/build-report.py recreates it using ReportLab. output/screenshots contains the accompanying browser evidence.

Run node tools/check-chat.mjs and node tools/check-contact.mjs, then node tools/build-site.mjs. The tests use mocked providers and never send real email or paid AI calls. Live service checks require configuration and must be recorded separately. For local service testing, use a private .env.local file with SITE_URL=http://127.0.0.1:4175 and start with node --env-file=.env.local tools/serve-story-preview.mjs. Never commit that file.

Approved screenshot exports can be reproduced with python tools/prepare-game-captures.py. This reads screenshot files only. The production build cleans its generated dist directory before copying the explicit allowlist, so unused concept art and older promotional artwork cannot linger in a deployment.


## Internship field book and editorial margins

The AIRIDEV chapter starts with a compact CSS 3D field book. Opening it reveals the searchable gallery; Close returns focus to the cover. Project hash links and Doodle citations automatically reveal their target, including a repeated link to the current hash. Reduced motion removes the opening transition. Print styles expand the collection. Add new entries and approved screenshot files in internship.js, then update the deployment allowlist. Cover and search counts derive from the entries.

margin-notes.js adds small section-specific vector diagrams to the wider headings and the About margin. They draw once on entry, have no perpetual render loop, are decorative for assistive technology, and withdraw on narrower screens. Section spacing is tightened rather than filling every gap with extra animation.

## Enable live services

Open https://vercel.com/hassan-ghaznavis-projects/hassan-portfolio/settings/environment-variables and add the following server-side values for Production (and Preview if needed), then redeploy:

- OPENAI_API_KEY: your own active API key; the current RAG implementation uses OpenAI embeddings and Responses. Never paste the key into chat or frontend files.
- RESEND_API_KEY: your Resend sending key.
- CONTACT_TO_EMAIL: the receiving inbox Hassan supplied privately. It is saved in the ignored local configuration, not this repository or archive.
- CONTACT_FROM_EMAIL: a sender permitted by the email provider. A receiving Gmail address is not automatically a verified sending identity.
- SITE_URL: https://hassan-portfolio-two-rho.vercel.app

The backend code cannot obtain provider credentials from a Vercel login. Provider account creation, API access and any billing must be configured by the account owner. Do not enable paid usage until you have reviewed the provider settings. Official setup references: https://resend.com/docs/send-with-nodejs , https://developers.openai.com/api/docs/quickstart and https://vercel.com/docs/environment-variables .

After redeploying, verify /api/chat reports ready:true and ask Doodle about Two Lights, Sunken Greed contributions and a deliberately unknown fact. Verify /api/contact reports ready:true; send a clearly labeled delivery test to the configured inbox and retain the received message and delivery result as submission evidence. No successful delivery or live LLM test is claimed until those checks pass.


## Source archive

After rebuilding dist and the report, run python tools/package-submission.py. It writes output/hassan-portfolio-source.zip from an explicit allowlist, with a SHA-256 manifest and ZIP integrity check. The archive includes the current frontend/backend, approved web assets, screenshots, report, original rigged avatar .blend and exported GLB. It excludes local inbox configuration, API credentials, raw internship source and recordings. START-HERE.txt records the remaining live-service, physical-device and deferred video requirements. This is the current source package, not a claim of completed service verification.

The latest Blender source/export round-trip check passed for Idle, Draw and Point, all skinned primitives and 18 joints. The rigged source is not modified by validation. Book interaction was checked with keyboard input at desktop, 768px tablet and 390px mobile widths, including search, screenshots, close/focus restoration and repeated same-hash citations.
