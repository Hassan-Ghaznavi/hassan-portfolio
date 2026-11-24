"""Rebuild the code-based evaluation handbook. No credentials or provider calls."""
from pathlib import Path
from html import escape
import json
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
PDF=OUT/'hassan-portfolio-evaluation-guide.pdf'
HTML=OUT/'hassan-portfolio-evaluation-guide.html'
pages=[]
def page(title,*blocks): pages.append((title,blocks))
def p(text): return ('p',text)
def h(text): return ('h',text)
def bullets(*items): return ('bullets',items)
def table(headers,*rows): return ('table',(headers,rows))
def code(text): return ('code',text)

page('Your project in one minute',
p('Hassan Ghaznavi | The Manual Is Wrong | Evaluation handbook | 25 November 2026'),
p('This guide explains the actual portfolio source, the files to open during evaluation, how its 3D and backend features work, and the security controls and limits. It is a preparation handbook, not a claim that every semester deliverable is finished.'),
h('A short introduction you can say'),
p('My portfolio is an interactive sketchbook for my game development and 3D environment work. I built a readable scrolling website with optional Three.js scenes, a rigged Blender avatar, project videos, a retrieval-augmented assistant named Doodle, and a server-side email form. Vercel serves both the frontend and API functions. Public project notes ground the assistant, while private environment variables protect provider credentials.'),
h('The links and the authoritative source'),
p('Live: https://hassan-portfolio-two-rho.vercel.app/<br/>Repository: https://github.com/Hassan-Ghaznavi/hassan-portfolio<br/>Local project: '+str(ROOT).replace('\\','/') ),
p('The inspected source includes the scroll-study update at commit 199d746 plus the sketchbook framing and documentation changes prepared with this guide. Backend statements below come from the local handlers and libraries; provider account settings are not re-audited here.'),
h('Three distinctions to remember'),
bullets('A WebGL scene is real 3D; a screenshot, SVG drawing or CSS book is a different presentation technique.', 'Gemini generation, server keyword retrieval and browser saved-note replies are three distinct paths.', 'Implemented protection is not a guarantee of perfect security or permanent provider availability.'),
h('Find the answer quickly'),
p('Pages 4-6: folders and files. Pages 8-10: Three.js and avatar. Pages 11-12: RAG. Pages 13-14: email and deployment. Pages 15-18: security and privacy. Pages 19-20: setup and expansion. Pages 21-24: demonstration, questions and submission. The HTML companion has a clickable contents list.'))

page('How the semester requirements map to the build',
table(['Requirement','Implementation and evidence'],
['Module 1 Web portfolio','Profile, About, skills, projects, achievements, journey and contact; responsive layouts; navigation, CV download and interactive scenes. index.html, main.js and styles.css.'],
['Module 2 Blender avatar','Final rigged .blend and exported GLB; Idle, Draw and Point; head rotation, orbit, pause and outlines. assets/avatar and avatar-scene.js.'],
['Module 3 After Effects','Final 30-60 second promotional MP4 and native .aep remain deferred with the collaborator. The CSS manual opening does not replace this requirement.'],
['Module 4 RAG chatbot','Curated notes, overlapping chunks, Gemini embeddings, cosine ranking and grounded generation with linked source IDs. API and browser fallback paths are implemented.'],
['Module 5 Email','Validated form, Resend server route, signed delivery receipt and status polling. A successful delivery was recorded earlier; the guide does not send a new test.'],
['Module 6 Submission','Public Vercel URL and GitHub repository, README, PDF reports, screenshots and a source packaging script. Existing release v0.9.0 is a fixed older snapshot.']),
h('Extra credit already represented'),
p('Light and night themes; pointer-responsive 3D and paper depth; animated avatar actions; project/collection search; chapter finder; keyboard and reduced-motion support; Doodle source links; optional read-aloud answers. Read-aloud is speech output, not microphone-based voice input. Urdu support was deliberately removed.'),
p('Analytics, a task ordering system, microphone chat and CAPTCHA are not implemented. Physical-device performance acceptance and the final AE deliverables still need to be retained as submission evidence.'))

page('Architecture and request flow',
('diagram',None),
h('What happens when the site opens'),
p('The browser receives index.html, styles.css and ES modules. An import map resolves the bundled Three.js runtime. Project modules create their sections from local data. IntersectionObserver delays expensive viewers until nearby or visible; videos load only after a visitor requests playback.'),
h('What is deployed as the backend'),
p('api/chat.mjs and api/contact.mjs are serverless Node handlers deployed by Vercel from the repository. They are not copied into the static dist folder. Vercel routes /api/chat and /api/contact to those handlers. There is no separate always-running Express server or separate backend URL.'),
h('What is not a portfolio database'),
p('MongoDB, Supabase, Firebase and SQL Server appear as Hassan\'s skills or as technologies used inside showcased games. This portfolio itself does not use them to store visitor chats or contact submissions. Redis is used for counters and public embedding cache; Resend handles email.'))

page('Folders and where to find them',
p('All relative paths below start at '+str(ROOT).replace('\\','/')+'. Open this folder in the editor, not the generated dist folder.'),
table(['Folder or file','What it contains'],
['index.html','Page skeleton, static sections, import map, script entry points and contact/chat markup.'],
['styles.css','Layout, paper texture, themes, media mounts, CSS book/fold animation and responsive rules.'],
['Root .js files','Frontend content and interaction modules; detailed map on the next page.'],
['api/','Two server endpoints: chat.mjs and contact.mjs. Secrets are read server-side.'],
['lib/','Retrieval math, shared Redis limiter and embedding cache. conversation.mjs is a legacy unused helper.'],
['assets/','Approved runtime media, GLBs, source comparisons, CV and vendored Three.js. Some local working files are deliberately untracked.'],
['tools/','Build, preview, mocked checks, media preparation, Blender preview and report/archive scripts. Experimental scripts are not all submission files.'],
['dist/','Generated website allowlist. Recreated by the build. Never edit this as the source.'],
['output/','Reports, screenshots, archive and verification artifacts. Not copied into the public website by default.'],
['tmp/','Local temporary work. Not an authoritative source or public asset location.'],
['.gitignore and .env.example','Ignored private/build files and a blank configuration template. Real private values are not in the template.'],
['vercel.json and content-permissions.json','Deployment/browser headers and internship publishing rules.']))

page('Frontend file map',
table(['Module','Responsibility'],
['main.js / projects.js','Build project chapters, render-room films and study controls; Canvas 2D flight demo. projects.js holds expandable project data.'],
['two-lights.js','Flagship chapter, linked light windows, gameplay player and two award photographs.'],
['internship.js','Seven-game AIRIDEV field book, 21 approved captures, thumbnail selection, bookmarks, local search and hash opening.'],
['manual.js / preferences.js','Opening, skip/replay and reading progress; light default, saved theme and night toggle.'],
['chapter-finder.js / margin-notes.js','Searchable chapter dialog with Ctrl/Cmd K; decorative SVG margin drawings.'],
['scroll-motion.js / story-scenes.js','Visible section reveals, scroll variables, frame/sketch reveal, pointer paper depth, contextual questions and optional sound cues.'],
['project-sketches.js / mini-scenes.js','Lazy bootstrap and one shared Three.js renderer for card miniatures.'],
['sketch-preview.js / sketch-sea.js','Lazy bootstrap and procedural scroll-driven whale scene.'],
['avatar-preview.js / avatar-scene.js','Lazy bootstrap, GLB avatar viewer, animation mixer, controls and ink tracing.'],
['companion.js / companion-scene.js','Chat panel, API calls, saved-note fallback, retry/read-aloud; lazy 3D pencil model.'],
['portfolio-notes.js','Approved factual corpus shared by backend retrieval and the browser fallback.'],
['contact.js / video-controls.js','Contact submission and delivery polling; explicit player-specific Collapse video lifecycle.']),
p('A bootstrap module decides when to load a larger scene module. This keeps the first page lighter and separates presentation, data and server responsibilities.'))

page('Asset locations and original work',
table(['Relative path under assets/','Contents and use'],
['avatar/','hassan-doodle-rigged.blend is the final Blender source; hassan-doodle-rigged.glb is the web export; hassan-doodle-final-v2.png is the poster; rig-export-validation.json records export checks.'],
['mascot/','pencil-web.glb is Doodle\'s deployed asset. README.md records creator, CC BY 4.0 attribution and modification history; older local preparations are not the active viewer.'],
['vendor/three/','Three.js 0.180.0 module/core runtime, loaders, orbit controls, outline effect and MIT license.'],
['blender-motion/ and studies/','Approved Blender film MP4/poster files; forest.webp, perfume.webp and cube.webp still renders. Films preserve original audio where present.'],
['process/','Matched solid/wireframe WebP previews for cave, ocean, AirPods and avatar; stylized sketch SVGs are separate from genuine wireframes.'],
['two-lights/','Approved gameplay MP4, gameplay-clear.webp, GameCon photo and evaluation-clear.webp.'],
['project-frames/ and internship/','Paper Dash and Behind the Smile covers; 21 approved internship game screenshots.'],
['documents/ and paper-grain.webp','hassan-ghaznavi-cv.pdf for download; a small repeating paper grain texture.']),
h('Original source folders supplied by Hassan'),
p('D:/Projects Videos and Info - original project media.<br/>D:/Unity Internship Projects - internship working projects, not public source.<br/>D:/Documents/Blender projects - cave.blend, stormy ocean.blend and airpods.blend source inputs.<br/>C:/Users/hp/Downloads/Personal/Hassan Ghaznavi CV.pdf - originally supplied CV location; the deployed copy is under assets/documents/.'),
p('The website runs from approved copies inside this repository. It does not depend on visitors having these D: drive folders. Do not upload raw internship recordings or source.'))

page('The sketchbook interface',
h('Visual vocabulary'),
p('Warm paper, graphite outlines, red corrections, hand-drawn diagrams, mounted photographs and small 3D objects create the manual theme. The latest framing uses irregular soft corner radii, subtle mount shadows, tape on awards, pencil inset rules and ruled expandable notes. These effects do not generate replacement artwork or blur authentic screenshots.'),
h('Reading and navigation'),
p('The manual opening is CSS 3D with a skip button. Session storage suppresses repeated automatic openings in the same session. Replay clears the hash and returns to the start before opening again. The reading line reflects the actual scroll position. Chapter search and the CV download remain independent of the 3D scenes.'),
h('Light and night paper'),
p('preferences.js reads a saved explicit theme. A visitor without a saved choice starts in light mode, even if the device prefers dark. CSS custom properties set paper, ink, accent and line colors. Night mode changes surfaces and text, rather than applying a global darkening filter to photographs. Paper grain remains visible.'),
h('Interactions are placed in context'),
bullets('Paper Plane Dash keeps the Unreal project information, gameplay and small browser flight interpretation together.', 'The whale belongs to Sunken Greed. Doodle stays at bottom right as the portfolio guide.', 'Opening the AIRIDEV book reveals projects. Bookmarks and source links can reveal a target even when the book was closed.', 'Film sketch reveals and real wireframe comparisons use sliders; horizontal dragging does not replace normal vertical page scrolling.'),
h('Accessibility'),
p('Semantic headings, labeled inputs, buttons, alt text, focus styles, keyboard sliders, Escape close behavior and live status regions support navigation. prefers-reduced-motion bypasses the introduction and reduces motion. This is practical accessibility work, not a claim of a complete WCAG audit.'))

page('Three.js explained for your evaluation',
table(['Concept','Example in this project'],
['Scene','A collection of geometry, cameras and lights. Each mini-scene has its own Scene.'],
['Geometry and mesh','Geometry supplies vertices and triangles; a mesh combines geometry with material. Trees use cones and cylinders; the bottle uses extruded rounded shapes.'],
['Material','MeshToonMaterial gives simplified shading. Paper hatching modifies shader code; edge lines reinforce the drawing style.'],
['Camera','Perspective cameras project the 3D scene onto a 2D canvas. Camera aspect updates to the visible region dimensions.'],
['Lighting','Hemisphere and directional lighting make volumes readable. Lightweight flat shadow meshes suggest contact without expensive shadow maps.'],
['Transforms and groups','Position, rotation and scale are applied to groups; e.g. cube layer groups rotate their cubies together.'],
['Renderer','WebGLRenderer draws using the GPU. Alpha permits the paper background to show behind scenes.'],
['AnimationMixer','Plays imported skeletal/object animation clips in the avatar and pencil models.'],
['OrbitControls','Allows dragging the avatar view and resetting the camera.'],
['GLTFLoader and OutlineEffect','Load the exported GLB; add an ink-like silhouette around the avatar/whale.']),
p('The runtime is vendored locally and resolved by index.html\'s import map. The project uses plain ES modules, HTML and CSS, not React or a required npm framework build.'),
p('The small Paper Plane Dash browser demo in main.js uses a Canvas 2D context with manual perspective projection and facet drawing. The original game was made in Unreal. Do not present this browser interpretation as a port or as a Three.js scene.'))

page('Scroll scenes and performance',
h('How scroll controls an object'),
p('The scene measures its section with getBoundingClientRect, maps its position to a clamped progress value from 0 to 1, and uses that value for transforms. The whale links section progress to travel; delta-time smoothing reduces abrupt jumps. The Blender study figures similarly drive forest growth, perfume-cap lift and cube-layer turns. A manual range control can override progress; Follow my scroll restores automatic control.'),
h('Why a shared renderer matters'),
p('mini-scenes.js uses one transparent fixed canvas with viewport and scissor regions. Each card still has a separate scene and camera, but only its matching part of the shared canvas is drawn. This avoids a separate WebGL context for every card. The avatar, whale and Doodle have separate viewers with different lifecycles.'),
h('Where the budget is saved'),
bullets('IntersectionObserver tracks visibility; hidden tabs and offscreen viewers stop work.', 'Dynamic imports delay large scene code and GLB loading. Videos use click-to-load, not automatic full downloads.', 'Miniatures cap pixel ratio at 1 on small screens and 1.25 on larger screens; avatar caps are 1.25 and 1.5. The whale cap is 1.4.', 'The avatar uses a modest 30 fps budget on small screens; desktop follows display frames. Other scenes use their own visibility and motion policies.', 'WebP assets reduce media size. YouTube embeds load on request. Pause controls and reduced-motion behavior avoid unnecessary movement.'),
h('Be precise about performance'),
p('These are optimizations in the source, not a universal 60 fps guarantee. A 390px responsive browser check is not equivalent to profiling a physical phone. Device GPU, thermal limits, scroll behavior and browser UI can still affect rendering.'))

page('The avatar and Doodle are different assets',
h('Hassan avatar'),
p('The final custom source is assets/avatar/hassan-doodle-rigged.blend. Blender exports the model, materials, skin weights, skeleton and clips into hassan-doodle-rigged.glb. The recorded validation reports 18 skin joints, all primitives skinned, and the Idle, Draw and Point clips. Sampled source/export bounding errors were approximately 0.000003 Blender units; that is a sampled export check, not exhaustive proof of every possible pose.'),
p('avatar-scene.js uses AnimationMixer and action transitions. The head slider adds a limited Y-axis rotation on top of the animation pose, rather than replacing the full skeleton. Draw samples the moving pencil tip to build a red ink trace. Orbit, reset, pause, outline controls and a poster fallback make the viewer usable.'),
h('Doodle pencil companion'),
p('Doodle uses assets/mascot/pencil-web.glb. The pencil is an adapted third-party Pencil (TPOT) model by JossyBoy, under CC BY 4.0. Attribution is kept in the panel and asset notes. Material preparation and a whole-character wake motion were added for this portfolio. Do not claim that this pencil was sculpted from scratch or has an independently rigged finger/limb system.'),
p('companion-scene.js loads the GLB only on first panel opening, plays its animation clips and stops active rendering when closed or hidden. This is the visual companion; companion.js and api/chat.mjs implement its intelligence separately.'),
h('Ideas still separate from implemented functionality'),
p('The full sequence where Hassan becomes a sketch, draws Doodle and returns has not been completed as an integrated final cinematic. The portfolio\'s animated opening and live avatar do not imply that this transformation or the AE promotional video is already finished.'))

page('Doodle RAG step by step',
bullets('1. Source selection: portfolio-notes.js holds approved facts about projects, contribution, skills, education and achievements. Raw private project folders are not indexed.', '2. Chunking: makeIndex splits each note into windows of up to 140 words, stepping by 100 words. Longer notes therefore overlap by 40 words. Many present notes fit in one chunk.', '3. Corpus embeddings: gemini-embedding-001 turns source title plus chunk text into 768-dimensional document vectors using RETRIEVAL_DOCUMENT.', '4. Query embedding: the current question is embedded with RETRIEVAL_QUERY. No full chat history is sent.', '5. Ranking: cosine similarity ranks vectors. A small 0.06 boost favors chunks also found by lexical retrieval. Results scoring at least 0.3 are limited to the top three.', '6. Generation: gemini-3.5-flash-lite receives system instructions, the question and retrieved source chunks. It is asked for short English answers in structured JSON.', '7. Validation: the handler checks answer shape/length and retains only source IDs from retrieved context. Factual responses without a valid retrieved citation are replaced by an unknown-information reply.', '8. Display: the browser renders text with textContent and approved internal source links. Clicking a source takes the visitor to the relevant portfolio chapter.'),
h('Where the vectors are stored'),
p('The active vector index is an in-memory array per function instance. Redis caches the approved corpus vectors for 24 hours, keyed by a SHA-256 hash of the corpus, model and dimensions. Redis here is not performing a vector similarity search; the function performs cosine ranking. A changed corpus produces a different cache key.'),
p('Cosine similarity is dot(query, document) divided by the product of their lengths. Lexical recovery normalizes TF-IDF vectors: frequent local terms are weighted, common corpus terms are downweighted, and results above 0.16 are limited to three chunks. This is distinct from semantic embeddings.'),
p('Explain RAG as retrieval plus generation. It is not fine-tuning: Hassan\'s documents do not retrain the Gemini model.'))

page('RAG grounding and failure recovery',
h('Guardrails around model behavior'),
p('System instructions limit factual claims to the retrieved notes and prohibit inferring unsupported personal details or solo credit. The question and sources are serialized as data. JSON output requests responseType, answer and sourceIds. Conversation mode allows brief social exchanges; portfolio answers require supporting retrieved IDs. The model is not given tools to access files, execute code, browse arbitrary URLs or send email.'),
h('Three paths you must distinguish'),
table(['Path','What really happens'],
['Normal vector RAG','Embedding succeeds, cosine ranking selects context, Gemini writes the response.'],
['Server keyword recovery','A transient embedding problem triggers normalized TF-IDF retrieval; Gemini still generates from the matched public notes. Authentication and quota failures are not bypassed.'],
['Browser saved-note fallback','If generation/API communication fails, companion.js may show the matching saved note, labeled From my saved portfolio notes. This is retrieval only, not an LLM answer.']),
h('Why Gemini can pass once and fail later'),
p('Earlier diagnostics showed 503 responses and timeouts. A working key does not guarantee capacity or quota. The code allows at most two attempts per provider operation for selected transient HTTP failures and timeout/abort errors, with about one second of backoff and jitter. It does not automatically retry quota or authentication failures. The provider budget is 42 seconds; embedding work has a smaller 9-second budget. The browser POST timeout is 55 seconds.'),
p('The API returns 429 for free quota exhaustion or throttling and a recoverable 502 for generation/provider failure. Retry AI answer is user initiated. No paid fallback is enabled. GET /api/chat only indicates configuration readiness; it does not prove Gemini is responding.'),
p('Citation validation checks membership, not semantic truth. A valid source ID does not mathematically prove every word of an answer. Prompt injection risk is reduced, not eliminated.'))

page('Email from form to confirmed receipt',
h('Frontend sequence'),
p('The browser checks form validity, collects name, email, subject and message, and adds a request UUID, form start time and honeypot field. contact.js posts JSON to /api/contact. Preview paper fold is visual only and never sends the note.'),
h('Server sequence'),
bullets('Check allowed origin, content type, payload size and field bounds. Reject header newlines, filled honeypot or implausible form timing.', 'Apply shared Redis and per-instance contact limits. Build a plain-text email with a fixed configured recipient and sender. The visitor\'s email is reply_to, not the sender identity.', 'Call Resend server-side. A hash of request UUID plus message fields becomes an idempotency key, reducing duplicate sending when the same accepted request is retried.', 'Return HTTP 202 with a signed receipt containing only provider email ID and timestamp. Acceptance is not treated as confirmed delivery.', 'Poll delivery using that receipt. The browser makes up to ten status checks. The handler maps provider events into pending, delivered or failed. The paper folds only after delivered/opened/clicked is reported.'),
h('Receipt protection'),
p('HMAC-SHA256 signs the receipt using the server-side Resend key. timingSafeEqual compares signatures. Tokens expire after ten minutes and future timestamps are bounded. The signature prevents changing the email ID to enumerate arbitrary messages. The token is signed, not encrypted: treat it as a short-lived bearer capability.'),
p('Delivery means the receiving mail server accepted the email; it does not guarantee primary-inbox placement or that a human read it. Pending/failed states preserve the note and avoid claiming success. The app does not implement a general contact-message database.'),
p('Sending limits are 4 valid POST requests per ten-minute per-IP window. The receipt GET route is token protected but does not currently use the same shared rate limiter; this is a remaining hardening opportunity.'))

page('Environment and production deployment',
table(['Variable name','Purpose'],
['GEMINI_API_KEY','Server credential for embeddings and generation. Never put it in frontend code.'],
['GEMINI_FREE_TIER_CONFIRMED','Must be the string true to allow outgoing Gemini calls. It is a code gate, not a billing-system control.'],
['RESEND_API_KEY','Server credential used for email send, delivery retrieval and receipt signing. Must allow required provider operations.'],
['CONTACT_TO_EMAIL','Fixed destination inbox, kept in private configuration.'],
['CONTACT_FROM_EMAIL','Sender identity permitted by the email provider; a Gmail receiver is not automatically a verified sender.'],
['SITE_URL','Explicit production origin, or localhost origin in a private local setup.'],
['UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN','Private Redis REST endpoint and access credential for shared counters/cache.'],
['VERCEL_URL','Vercel-provided deployment host used in the origin allowlist.']),
h('Build and publishing'),
p('vercel.json runs node tools/build-site.mjs and serves dist. The build recreates only the known generated dist directory, then copies an explicit file/media allowlist. API handlers are deployed separately by Vercel from api/. The final .blend is tracked for evaluation but is not copied into website assets.'),
p('A main-branch push triggers the connected production deployment. The live URL and repository URL stay the same when the latest deployment succeeds. Environment-variable edits need a new deployment to take effect. Do not print private values or export them into JavaScript.'),
h('GitHub and releases'),
p('The repository is public. Teachers can inspect tracked code and approved assets, including the final Blender source. Ignored/untracked files on the laptop are not automatically visible. A tag/release remains a fixed snapshot; editing main does not update an old release archive. The older v0.9.0 release predates this handbook.'))

page('Security controls A to H',
table(['Control','Implementation and limits'],
['A API credentials','Read only via process.env in server functions. .env files are ignored; .env.example is blank. Never put a real key in code, screenshots, browser storage or the handbook.'],
['B Build boundary','tools/build-site.mjs copies approved frontend assets only. Git publication and static deployment are separate boundaries: a tracked source file can be on GitHub without being in dist.'],
['C Content and citations','Only curated public notes enter RAG. Output source IDs must match retrieved chunks; frontend links must match internal hash syntax. This limits forged links, not all hallucinations.'],
['D Distributed throttling','Redis uses an atomic Lua INCR plus 600-second expiry for per-IP counters. Chat allows 15 and contact 4 POST requests. Separate scopes prevent one endpoint using the other\'s allowance.'],
['E Email validation','Server repeats client validation. Name 2-80, subject 3-120, message 10-4000, email up to 254 characters; regex checks syntax and rejects header newlines. It does not verify visitor ownership of that address.'],
['F Fail closed','If configured Redis fails, protected POST requests return 503 before calling a provider. When Redis is absent, shared limiting is skipped and only bounded per-instance throttling remains.'],
['G Guardrails','System prompt restricts scope, unknown facts and contribution claims. Structured output and retrieved-ID checks add layers. These are not an injection-proof sandbox or a semantic fact checker.'],
['H Headers','nosniff; strict-origin-when-cross-origin referrer policy; DENY framing; CSP frame-ancestors none, object-src none, base-uri self and form-action self. Full policy limits are on the next pages.']))

page('Security controls I to Q',
table(['Control','Implementation and limits'],
['I Idempotency','A SHA-256 digest of request ID and fields is sent as the Resend idempotency key. Reusing the same accepted request reduces duplicate email. Editing its contents creates a different digest.'],
['J JSON and size limits','Chat requires JSON, body length checks around 2400 and a 2-500 character question. Contact checks around 12000 and validates fields. These application checks are not a replacement for platform request-size limits.'],
['K Key rotation','Production secrets can be replaced in Vercel and redeployed. A key that was exposed must be revoked at its provider; .gitignore cannot undo exposure. This guide does not certify all historical keys were revoked.'],
['L Logs','Chat logs limited stage/status/error type, not raw prompts, credentials or full provider responses. Contact does not log form contents. Hosting/providers can maintain their own operational records.'],
['M Method and origin checks','Only GET and POST are accepted. POST Origin must match approved hosts. Origin checking reduces browser cross-site abuse; non-browser callers can forge Origin, so it is not authentication.'],
['N No model actions','Doodle is a question-answering service, not an autonomous tool-using agent. It cannot use a prompt to read private local files, invoke the email handler or run shell commands.'],
['O Output rendering','Chat text uses textContent instead of inserting LLM HTML. User input sent by email is plain text. Trusted static templates still use innerHTML; do not extend them to accept untrusted HTML.'],
['P Prompt injection','Question/source text is treated as data and constrained by system instructions. A malicious prompt may still influence generation. Restrict sources, validate output and avoid adding privileged tools.'],
['Q Quota and free-only','Allowlisted models and free-tier confirmation gate; no paid fallback or automatic quota bypass. Account billing must still be checked by the owner. Request limits are abuse controls, not a contractual spend cap.']))

page('Security controls R to Z',
table(['Control','Implementation and limits'],
['R Receipt signing','HMAC-SHA256 with timing-safe comparison, ten-minute expiry, provider ID pattern check and small token bound. Signing prevents tampering; it does not hide the receipt payload.'],
['S Spam controls','Honeypot website field and 2-second to 24-hour form timing check supplement rate limits. Bots can imitate both. No CAPTCHA, Turnstile or Cloudflare proxy is configured by this project.'],
['T Transport','Production API and provider requests use HTTPS. The local preview uses loopback HTTP. The source does not define its own HSTS header; do not claim one was added here.'],
['U User and database access','There are no visitor accounts, SQL queries, writable content database or public admin dashboard in this portfolio. Database row-level security is therefore not implemented or required by this architecture.'],
['V Vector and cache privacy','Redis embedding cache stores only public corpus vectors, keyed by model/dimensions/content hash, TTL 24 hours. Query vectors, API keys and chat history are not written by that cache.'],
['W Web permissions','Permissions-Policy disables camera, microphone and geolocation. Read-aloud needs no microphone. Public media embeds still involve third parties after being loaded.'],
['X Cross-site framing','X-Frame-Options DENY and CSP frame-ancestors none prevent other sites embedding this portfolio. They do not prohibit its own YouTube embeds. CSP lacks default-src/script-src and is only a baseline policy.'],
['Y Your content permissions','AIRIDEV images allowed; raw source and gameplay forbidden. A public GitHub repository must follow the same permissions even for files not used by the site.'],
['Z Zero absolute guarantees','No full penetration test, complete dependency audit, formal WCAG certification or injection-proof claim. Known limitations and test evidence must be stated honestly.']))

page('Privacy and remaining security work',
h('What leaves the visitor device'),
table(['Action','Destination and data'],
['Ask Doodle','The question goes to the portfolio API; embedding and generation requests send it and selected public notes to Google. Backend does not send the browser\'s full chat transcript.'],
['Submit contact','Name, email, subject and message go to the API and Resend, then the fixed configured inbox. Receipt polling uses a short-lived signed token in the request URL.'],
['Load public media','YouTube video requests are click initiated and use youtube-nocookie embeds. Google Fonts is requested by the CSS import. Vendor privacy/storage behavior is outside app control.'],
['Rate limiting','The server hashes the forwarded client IP into a counter key. SHA-256 is unsalted pseudonymization here, not guaranteed anonymity. Shared keys expire after 600 seconds.'],
['Browser preferences','localStorage saves the chosen theme; sessionStorage records whether the introduction opened. Browser chat display is capped and is not persisted by the app.']),
h('Hardening opportunities, not completed features'),
bullets('Add verified bot challenges only if abuse justifies them; Cloudflare is optional infrastructure, not a prerequisite for Vercel functions.', 'Consider receipt polling throttling, a separate receipt signing secret and tighter provider credential scopes.', 'A stronger CSP requires inventorying inline import maps, remote fonts, frames and WebGL-related needs before enforcing script/connect/font restrictions.', 'Guardrails can reject unsupported IDs, but semantic support and prompt-injection resistance need adversarial evaluation. Broader hardening should be a separate measured change.', 'Review provider project billing/privacy settings and credential rotation privately. No local code flag can guarantee an external account\'s settings.'),
p('Do not tell the examiner that Redis, origin checks or a private env file alone make the system fully secure. Explain the threat each control reduces and the cases it does not cover.'))

page('Run and inspect the project locally',
h('Static website preview'),
code('node tools/build-site.mjs\npython -m http.server 4174 --bind 127.0.0.1 --directory dist'),
p('Open http://127.0.0.1:4174/. This serves files only. It does not execute /api handlers; chatbot and email should not be judged as production services from this static server.'),
h('Preview with the API handlers'),
code('node tools/build-site.mjs\nnode tools/serve-story-preview.mjs'),
p('Open http://127.0.0.1:4175/. For private local provider testing, create an ignored .env.local from the blank .env.example, set SITE_URL=http://127.0.0.1:4175, and start with:'),
code('node --env-file=.env.local tools/serve-story-preview.mjs'),
p('Use a recent Node version that supports ES modules, fetch, AbortSignal.timeout and --env-file. The site is buildless plain JavaScript; there is no package.json-based npm start workflow to invent. API functions rely on the Vercel Node runtime in production.'),
h('Low-cost verification commands'),
code('node tools/check-chat.mjs\nnode tools/check-chat-resilience.mjs\nnode tools/check-contact.mjs\nnode tools/check-video-controls.mjs\nnode tools/build-site.mjs'),
p('These backend checks replace provider fetch with mocks. They do not send real email or consume Gemini quota. Passing mocks verifies selected code behavior, not current external service uptime. Rebuild dist after source changes. The preview server contains range handling for video playback and a path boundary check.'))

page('How to expand and maintain the portfolio',
h('Add a new personal project'),
bullets('Add a stable id and factual title, tools, role, contribution and overview to projects.js. Optional fields include cover, youtubeId, rule/correction and mechanics. Use collection more when appropriate.', 'Place approved compressed screenshots in the relevant assets folder. Add explicit copies to tools/build-site.mjs if the destination folder is not already allowed.', 'Add the factual source note, search terms and a correct internal href to portfolio-notes.js. A source-note change automatically changes the embedding-cache key.', 'For a major chapter, update static index links and the chapter-finder.js chapter list. Keep the project demo with its own information.', 'For a new miniature, add a kind to mini-scenes.js and a matching data-mini-sketch region. Reuse the shared renderer and visibility behavior.'),
h('Add an internship entry'),
p('Use internship.js entries, approved screenshots and the publishing permission record. Existing capture naming is assets/internship/{slug}-play-{0,1,2}.webp, with three screenshots per game. Update the build allowlist and Doodle facts. Collection counts derive from entries, but the current seven-experiments title and any other written totals also need editing.'),
h('Update the avatar or a film'),
p('Preserve the Idle, Draw and Point clip names and expected head/pencil objects, export GLB, then validate after rig changes. For a film, prepare a compressed MP4 with audio retained where present, poster and optional comparison assets; do not silently replace a real source comparison with generated sketch art.'),
h('Source package and releases'),
p('tools/package-submission.py creates the explicit source ZIP and SHA-256 manifest. Its allowlist must be updated when new required files are added. Rebuilding a ZIP locally does not update a GitHub release attachment. Keep final AE .aep/MP4 and any new submission snapshot explicitly organized.'))

page('A focused evaluation demonstration',
table(['Time','What to show and explain'],
['0:00-0:45','Open the manual, skip/replay if needed, introduce the theme, role and portfolio purpose. Use the stable live URL.'],
['0:45-1:45','Two Lights: demonstrate scroll-linked light windows, full scene, clear screenshots, two award records and your team contribution.'],
['1:45-2:45','Paper Plane Dash and Sunken Greed: distinguish the original game from the Canvas demo; scroll the whale and explain geometry/camera/transforms.'],
['2:45-3:45','Render room: scrub forest/perfume/cube; show a film and Collapse video; reveal real source wireframe comparison.'],
['3:45-4:30','Open AIRIDEV book, search one title, select another screenshot, close the collection. Explain image-only permissions.'],
['4:30-5:30','Avatar: choose Draw/Point, turn the head, orbit and reset. Open final .blend and GLB paths if asked.'],
['5:30-6:30','Doodle: ask Which game won twice? Open its citation. Ask an unsupported detail such as a salary and explain unknown/fallback handling. Avoid rapid repeated requests.'],
['6:30-7:30','Contact: demonstrate validation and fold preview. Use a labeled real delivery test only if needed; explain accepted versus delivered.'],
['7:30-8:30','Show API handlers, env names without values, Redis limiter and build allowlist. Toggle night paper and demonstrate keyboard chapter search/CV.']),
h('Prepare before presenting'),
p('Use a fresh tab to avoid stale cached files, confirm the production build loaded, and keep local source and final avatar files ready. Have screenshots of a previously successful cited answer and email delivery available in case a provider is unavailable. Explain an outage honestly rather than presenting a saved-note response as live AI.'))

page('Questions your examiner may ask',
h('Why Three.js instead of only videos'),
p('Three.js lets the viewer explore real geometry and lets scroll/pointer input change objects at runtime. Videos are used for authentic project footage; they cannot replace interactive scene transformations.'),
h('Is Doodle just a hard-coded chatbot'),
p('The normal API route performs embeddings, retrieval and Gemini generation. A separate browser fallback searches saved notes when the provider fails. The fallback is explicitly identified and is not presented as an LLM response.'),
h('Where is the vector database'),
p('The small corpus is searched through an in-memory vector index. Redis persists cached corpus vectors for 24 hours; it does not run vector search. A dedicated vector database would be a future scaling choice, not a current dependency.'),
h('How do you avoid invented facts'),
p('Curated source notes, scoped instructions, short structured answers and retrieved-source ID validation reduce unsupported output. Unknown information is acknowledged. These measures improve grounding; they are not a proof that every answer is correct.'),
h('Where is the backend deployed'),
p('Both api handlers deploy as Vercel Node functions from the same repository. The frontend is generated into dist. The production hostname routes API requests and static assets without needing a separate server URL.'),
h('Can someone steal the key from the browser'),
p('The browser calls my API, which reads credentials server-side. Public assets do not contain the keys. This protects direct disclosure, while rate limits and validation reduce misuse of the public endpoint. Exposed keys still need revocation and rotation.'),
h('What is original and what is credited'),
p('The custom Hassan avatar and procedural scene motifs are portfolio work. Doodle\'s pencil comes from a credited CC BY asset. Team games retain team credit and specific contributions. Internship projects show only approved screenshots. Be transparent about AI/automation assistance if asked.'))

page('Troubleshooting during evaluation',
table(['Symptom','First checks'],
['Doodle reports connection failure','Do not assume invalid key. Check live /api/chat readiness, Vercel function stage/status logs, provider status/quota and recent deployment. A 503/timeout differs from 401/403 credential restrictions.'],
['Doodle uses saved notes','Generation failed or readiness was unavailable. Refresh after recovery and use Retry AI answer; do not remove the honest fallback label.'],
['429 response','Can be local/shared throttling or provider quota. Avoid repeated requests; inspect the server error classification privately. No paid bypass is configured.'],
['503 before a provider call','Configured Redis might be unavailable and the limiter fails closed. Check Redis connectivity/configuration without exposing its token.'],
['Contact accepted but not delivered','Wait for status. Verify permitted sender, provider event and destination. Do not repeatedly resend an accepted message or claim inbox placement.'],
['Video has no sound','Start playback with a user gesture, inspect player volume and system/site audio, and confirm the current exported MP4 contains an audio track. Source clips differ.'],
['3D viewer missing','Check WebGL support, lazy loading, GLB path and console errors. Poster/static content remains available. Pause and reduced-motion settings can make a scene stationary.'],
['Source changes invisible','Rebuild dist locally. For production, inspect the latest deployment and cache-version URL. Environment edits require redeployment.'],
['Night layout looks wrong','Check saved theme, theme custom properties and specific surface/text overrides. Do not solve contrast by globally filtering screenshots.']),
h('Useful HTTP meanings'),
p('400 invalid input; 403 wrong origin; 405 method not allowed; 413 body bound; 415 non-JSON; 429 throttle/quota; 502 upstream/response failure; 503 unconfigured or temporarily unavailable dependency. Exact route messages determine which condition occurred.'))

page('Evidence and final submission checklist',
h('What this handbook verifies'),
p('The explanations were prepared from the current repository files: index.html, frontend modules, api/chat.mjs, api/contact.mjs, lib/retrieval.mjs, lib/shared-limit.mjs, lib/embedding-cache.mjs, vercel.json, the build allowlist, .gitignore, asset attribution and rig-export-validation.json. No secrets are included and no new paid AI or email calls are needed to generate it.'),
h('Earlier evidence versus current availability'),
p('Previous project records show a real cited AI response and Resend delivery verified on 22 November, followed by intermittent Gemini 503/timeouts. The 25 November interface pass checked desktop and 390px study layouts. These are dated observations, not continuous uptime or a complete security audit. output/screenshots contains the retained browser evidence.'),
h('Before final submission'),
bullets('Submit the stable live URL and public repository link. Make sure the latest deployment succeeds.', 'Retain the final original .blend and animated GLB with the source. Use the correct files under assets/avatar/.', 'Add the final promotional MP4, embed it, and retain the native .aep; this remains the deferred module.', 'Consolidate the final project report and screenshots. The older implementation PDF is a historical working report; this newer handbook explains the current system.', 'Capture successful source-linked chat, unknown answer behavior, delivered email, core interactions, light/night and mobile views.', 'Check content credits, internship publishing restrictions and key rotation privately. Do not show env values during evaluation.', 'Test on a physical phone and PC. Keep honest notes about provider dependence and performance limits.', 'Create a new tag/release only when you want a new fixed snapshot; existing release assets do not follow main automatically.'),
h('Files you should open if asked to prove the design'),
p('Three.js: mini-scenes.js and avatar-scene.js.<br/>RAG: api/chat.mjs, portfolio-notes.js and lib/retrieval.mjs.<br/>Security: lib/shared-limit.mjs, api/contact.mjs and vercel.json.<br/>Deployment: tools/build-site.mjs and README.md.<br/>Model: assets/avatar/hassan-doodle-rigged.blend and .glb.'),
p('The strongest evaluation answer connects a visible interaction to its source code, explains why the design was chosen, and states its limits.'))

pdfmetrics.registerFont(TTFont('Guide','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('GuideBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFont(TTFont('GuideMono','C:/Windows/Fonts/consola.ttf'))
ink=HexColor('#26211c'); red=HexColor('#a33325'); muted=HexColor('#675e53')
body=ParagraphStyle('body',fontName='Guide',fontSize=10.2,leading=14.5,textColor=ink,spaceAfter=10)
heading=ParagraphStyle('heading',parent=body,fontName='GuideBold',fontSize=12,leading=16,spaceBefore=8,spaceAfter=6,keepWithNext=True)
title=ParagraphStyle('title',parent=body,fontName='GuideBold',fontSize=25,leading=29,spaceAfter=20)
cell=ParagraphStyle('cell',parent=body,fontSize=9.1,leading=12.8,spaceAfter=0)
mono=ParagraphStyle('code',parent=body,fontName='GuideMono',fontSize=9,leading=13,backColor=HexColor('#eee8de'),borderPadding=9,spaceBefore=7,spaceAfter=15)

def para(t,sty=body): return Paragraph(t,sty)
def diagram():
    rows=[['BROWSER','VERCEL FUNCTIONS','PRIVATE SERVICES'],['HTML CSS JavaScript\nThree.js and GLB\nVideos and project notes','/api/chat\nValidate and retrieve\nGenerate and cite','Google Gemini\nEmbeddings and LLM'],['Contact form\nSigned receipt polling','/api/contact\nValidate and send\nVerify delivery','Resend\nSending and status'],['Theme and intro\nBrowser preferences','Rate checks and\ncorpus cache access','Redis REST\nCounters and vectors']]
    t=Table([[para(escape(v).replace('\n','<br/>'),cell) for v in r] for r in rows],colWidths=[160,160,170],hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#dfd4c1')),('GRID',(0,0),(-1,-1),.5,HexColor('#b5a58f')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]));return t

story=[]; html=['<!doctype html><html lang="en"><meta charset="utf-8"><title>Hassan Portfolio Evaluation Guide</title><style>body{font:16px/1.65 system-ui;color:#26211c;background:#eee8de;margin:0}main{max-width:960px;margin:auto;background:#fffdf7;padding:3rem}section{break-before:page;border-top:1px solid #baa98e;padding:2rem 0}h1{font-size:2rem}h2{font-size:1.25rem}table{border-collapse:collapse;width:100%;font-size:.95rem}td,th{padding:.65rem;border:1px solid #c9bca8;text-align:left;vertical-align:top}th,pre{background:#eee8de}pre{white-space:pre-wrap;padding:1rem}a{color:#a33325}@media print{body,main{background:white}main{padding:0}section{border:0}}</style><main><h1>Hassan Portfolio Evaluation Guide</h1><p>25 November 2026 | The Manual Is Wrong</p><nav><ol>']
html.extend('<li><a href="#chapter-'+str(i)+'">'+escape(t)+'</a></li>' for i,(t,b) in enumerate(pages,1));html.append('</ol></nav>')
for i,(t,blocks) in enumerate(pages,1):
    if i>1:story.append(PageBreak())
    story.append(para(t,title));html.append('<section id="chapter-'+str(i)+'"><h1>'+escape(t)+'</h1>')
    for kind,data in blocks:
        if kind=='p':story.append(para(data));html.append('<p>'+data+'</p>')
        elif kind=='h':story.append(para(data,heading));html.append('<h2>'+escape(data)+'</h2>')
        elif kind=='bullets':
            html.append('<ul>')
            for text in data:story.append(para('• '+text));html.append('<li>'+text+'</li>')
            html.append('</ul>')
        elif kind=='code':story.append(para(escape(data).replace('\n','<br/>'),mono));html.append('<pre>'+escape(data)+'</pre>')
        elif kind=='diagram':story.append(diagram());story.append(Spacer(1,14));html.append('<p>Browser → Vercel API → Google Gemini / Resend / Redis. Responses return through the API.</p>')
        elif kind=='table':
            heads,rows=data;values=[[para(escape(str(v)),cell) for v in row] for row in [heads,*rows]]
            widths=[155,335] if i not in [4,5,6] else [145,345]
            grid=Table(values,colWidths=widths,repeatRows=1,hAlign='LEFT')
            grid.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#dfd4c1')),('ROWBACKGROUNDS',(0,1),(-1,-1),[HexColor('#fffdf7'),HexColor('#f5f1e9')]),('GRID',(0,0),(-1,-1),.45,HexColor('#c7bba7')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
            story.extend([grid,Spacer(1,12)]);html.append('<table><tr>'+''.join('<th>'+escape(v)+'</th>' for v in heads)+'</tr>')
            html.extend('<tr>'+''.join('<td>'+escape(str(v))+'</td>' for v in row)+'</tr>' for row in rows);html.append('</table>')
    html.append('</section>')
html.append('</main></html>');HTML.write_text('\n'.join(html),encoding='utf-8')
def furniture(c,doc):
    c.saveState();w,h=doc.pagesize;c.setFillColor(red);c.setFont('GuideBold',8);c.drawString(52,h-35,'HASSAN GHAZNAVI  /  PORTFOLIO EVALUATION GUIDE');c.setStrokeColor(HexColor('#c7bba7'));c.line(52,h-45,w-52,h-45);c.setFillColor(muted);c.setFont('Guide',8);c.drawString(52,28,'25 November 2026  |  Code based preparation handbook');c.drawRightString(w-52,28,str(doc.page));c.restoreState()
doc=SimpleDocTemplate(str(PDF),pagesize=(595.28,841.89),rightMargin=52,leftMargin=52,topMargin=64,bottomMargin=50,title='Hassan Portfolio Evaluation Guide',author='Hassan Ghaznavi')
doc.build(story,onFirstPage=furniture,onLaterPages=furniture)
print(json.dumps({'pdf':str(PDF),'html':str(HTML),'chapters':len(pages)}))
