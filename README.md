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

api/chat.mjs implements the full optional RAG route: approved source notes are divided into overlapping chunks, embedded with gemini-embedding-001 (768 dimensions), cached in a per-instance in-memory vector index, and ranked by cosine similarity with a small lexical relevance boost. The best three chunks ground a structured Gemini answer. Only validated citations to those retrieved chunks reach the interface. Unknown details, unsupported citations and provider failures have explicit fallbacks. No private source code, visitor conversation history or raw CV is uploaded. Only the current question and public source chunks are sent to Google. Free-tier content may be used by Google to improve its products; the chat interface identifies Google as the provider. The in-memory index is rebuilt after a cold start; a persistent vector service would be appropriate if the corpus grows substantially.

Set GEMINI_API_KEY and GEMINI_FREE_TIER_CONFIRMED=true in Vercel only after verifying that its Google project is on the unbilled Free tier. The backend uses the allowlisted gemini-3.5-flash-lite and gemini-embedding-001 models; it has no paid-provider fallback. Quota exhaustion returns a recoverable error. The current deployment has no provider credentials, so live LLM verification remains pending. Run node tools/check-chat.mjs for mocked retrieval, grounding/citation, configuration and failure checks without paid calls. Official API references: https://ai.google.dev/api/embeddings and https://ai.google.dev/api/generate-content .

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

- GEMINI_API_KEY: a dedicated key for your unbilled Google AI Studio project. Never paste the key into chat or frontend files.
- GEMINI_FREE_TIER_CONFIRMED: true only after verifying the project is on Free tier without linked paid billing. This flag gates all outgoing model requests; it does not change Google billing settings.
- RESEND_API_KEY: your Resend sending key.
- CONTACT_TO_EMAIL: the receiving inbox Hassan supplied privately. It is saved in the ignored local configuration, not this repository or archive.
- CONTACT_FROM_EMAIL: a sender permitted by the email provider. A receiving Gmail address is not automatically a verified sending identity.
- SITE_URL: https://hassan-portfolio-two-rho.vercel.app

The backend code cannot obtain provider credentials from a Vercel login. Provider account creation, API access and any billing must be configured by the account owner. Do not enable paid usage until you have reviewed the provider settings. Official setup references: https://resend.com/docs/send-with-nodejs , https://ai.google.dev/gemini-api/docs/quickstart and https://vercel.com/docs/environment-variables .

After redeploying, verify /api/chat reports ready:true and ask Doodle about Two Lights, Sunken Greed contributions and a deliberately unknown fact. Verify /api/contact reports ready:true; send a clearly labeled delivery test to the configured inbox and retain the received message and delivery result as submission evidence. No successful delivery or live LLM test is claimed until those checks pass.


## Source archive

After rebuilding dist and the report, run python tools/package-submission.py. It writes output/hassan-portfolio-source.zip from an explicit allowlist, with a SHA-256 manifest and ZIP integrity check. The archive includes the current frontend/backend, approved web assets, screenshots, report, original rigged avatar .blend and exported GLB. It excludes local inbox configuration, API credentials, raw internship source and recordings. START-HERE.txt records the remaining live-service, physical-device and deferred video requirements. This is the current source package, not a claim of completed service verification.

The latest Blender source/export round-trip check passed for Idle, Draw and Point, all skinned primitives and 18 joints. The rigged source is not modified by validation. Book interaction was checked with keyboard input at desktop, 768px tablet and 390px mobile widths, including search, screenshots, close/focus restoration and repeated same-hash citations.


## Project bookmarks and Doodle reactions

Each project has a keyboard-accessible bookmark at the top of the open field book. The selected bookmark is marked with aria-current. Activating one clears an incompatible search and opens its project. Doodle offers a short contextual introduction and an optional Ask button, with an eight-second dismissal and a manual close. These reactions use local facts and make no automatic AI calls. Reduced motion removes the gesture. Doodle celebrates only the contact system’s confirmed delivery event.

The AI provider was changed to Gemini at Hassan’s explicit free-only request. Do not add billing, automatic recharge or a paid fallback. Provider quotas and availability remain outside the portfolio’s control; always verify the project’s actual billing tier before enabling credentials.

The film-card sketch reveals also support a horizontal rub gesture with an eraser marker. The native labeled slider remains available for keyboard and touch users; vertical page scrolling remains enabled. This reveals real project frames under the sketch treatment.


## Submission snapshot — 24 November 2026

Live portfolio: https://hassan-portfolio-two-rho.vercel.app/
Repository: https://github.com/Hassan-Ghaznavi/hassan-portfolio

The frontend and serverless backend are deployed together on Vercel. Gemini RAG and Resend are configured using private Production variables. One real cited AI answer and email delivery were verified on 22 November. Gemini subsequently returned a provider 503; bounded retry and an explicitly identified local-notes fallback are implemented. Continuous provider availability is not claimed.

Shared Redis rate limiting is configured for chat (15 requests per ten minutes per IP) and contact (4). Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN privately to enable it on another deployment. With configured Redis unavailable, protected requests fail closed. Without Redis configuration, only per-instance limits apply. Use a free plan with auto-upgrade disabled.

Security includes input bounds, plain-text answer rendering, curated public retrieval notes, validated source links, origin checks, contact honeypot/timing checks, idempotency and signed delivery receipts, plus baseline browser headers. Origin checks are not authentication, prompt guardrails are not injection-proof, and CAPTCHA/bot verification is not implemented. API keys never belong in browser code or Git. Resend requires a key capable of both sending and retrieving delivery status.

Final avatar source: assets/avatar/hassan-doodle-rigged.blend; web export: assets/avatar/hassan-doodle-rigged.glb. The final source is intentionally tracked; rejected iterations, backups, raw internship source/gameplay and local credentials remain excluded. The build allowlist excludes the Blender source from web delivery.

The promotional MP4 and native After Effects .aep are still in production with the student’s collaborator and are not included as completed deliverables. The existing PDF is a working implementation report dated 22 November; this README records later changes. Final report/evidence consolidation and physical-device acceptance remain outstanding.

Run node tools/build-site.mjs, node tools/check-chat.mjs, node tools/check-contact.mjs and node tools/check-video-controls.mjs for local checks. Backend checks use mocks and do not send email or spend AI quota.

A release is a fixed, tagged submission snapshot. Future main-branch commits continue updating the same live URL; they do not change an existing release’s tagged source. Use a new release for a later snapshot.


## Doodle provider recovery

AI requests have a 42-second provider budget, one retry with backoff/jitter for transient 5xx responses and timeouts, and no automatic retry for quota/authentication failures. The approved public-note embedding index is cached in Redis for 24 hours and keyed by a hash of the corpus, embedding model and dimensions; note edits invalidate it automatically. Visitor questions and API keys are not stored in this cache. Cache failures fall back to generating vectors; the separate configured Redis rate limiter still fails closed. Diagnostics record the failing stage/status/type, never questions or credential values. Run node tools/check-chat-resilience.mjs for mocked timeout, 503 and cold-instance cache checks.

When vector retrieval encounters a transient failure, Doodle can retrieve relevant public notes using its local text index and still ask Gemini for a cited answer. Authentication and quota errors are not bypassed. This fallback is identified as keyword retrieval in API responses; it is distinct from the browser’s saved-note fallback when generation also fails.
