from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
ROOT=Path(__file__).resolve().parents[1]
pdfmetrics.registerFont(TTFont('Body','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('Bold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFont(TTFont('Italic','C:/Windows/Fonts/georgiai.ttf'))
W,H=595.28,841.89;ink=HexColor('#211b17');red=HexColor('#a92e21');muted=HexColor('#65574a')
out=ROOT/'output/pdf/hassan-portfolio-implementation-report.pdf';out.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(out),pagesize=(W,H));c.setTitle('The Manual Is Wrong - Implementation Report');c.setAuthor('Hassan Ghaznavi')
style=ParagraphStyle('body',fontName='Body',fontSize=10,leading=15,textColor=ink,spaceAfter=10)
small=ParagraphStyle('small',parent=style,fontSize=8,leading=12,textColor=muted)
page=0;y=0
def begin(label,title):
 global page,y
 page+=1;c.setFillColor(HexColor('#f5ebdc'));c.rect(0,0,W,H,fill=1,stroke=0);c.setStrokeColor(HexColor('#c6b69e'));c.line(44,H-44,W-44,H-44);c.setFillColor(red);c.setFont('Bold',8);c.drawString(44,H-34,'HASSAN GHAZNAVI / WEB3D PORTFOLIO');c.setFillColor(muted);c.setFont('Body',8);c.drawRightString(W-44,26,f'{page:02d}');c.drawString(44,26,'Implementation report | 22 November 2026');y=H-80;para(label.upper(),small);c.setFillColor(ink);c.setFont('Bold',27);c.drawString(44,y-26,title);y-=54

def para(text,sty=style):
 global y
 p=Paragraph(text,sty);_,h=p.wrap(W-88,H);p.drawOn(c,44,y-h);y-=h+10

def heading(text):
 global y
 y-=6;c.setFillColor(red);c.setFont('Bold',13);c.drawString(44,y-14,text);y-=27

def image(name,height=220):
 global y
 p=ROOT/'output/screenshots'/name
 if p.exists():
  im=ImageReader(str(p));iw,ih=im.getSize();width=min(W-88,height*iw/ih);actual=width*ih/iw;c.drawImage(im,44,y-actual,width=width,height=actual,preserveAspectRatio=True,mask='auto');y-=actual+12

def end():c.showPage()
begin('Design and development','The Manual Is Wrong.')
para('An interactive 3D portfolio for <b>Hassan Ghaznavi</b>, Game Developer and 3D Environment Artist, Karachi, Pakistan.')
para('<b>Working implementation report.</b> This document records the implemented system and the remaining submission requirements. It does not claim successful live AI generation or email delivery before service configuration.')
image('manual-opening.jpg',265)
heading('Concept')
para('A paper manual becomes a playable collection of worlds. Graphite outlines, warm paper, restrained red marks and small three-dimensional sketches connect the professional portfolio to its game-development subject.')
para('The default experience is a readable scrolling portfolio. Optional exploration, video playback and chatbot interaction stay within each project chapter. Animation supports the work rather than gating access to it.')
para('<b>Live:</b> https://hassan-portfolio-two-rho.vercel.app/<br/><b>Repository:</b> https://github.com/Hassan-Ghaznavi/hassan-portfolio',small);end()
begin('Modules 1 and 2','A manual with depth')
heading('Responsive web portfolio')
para('The site includes profile, skills, education, experience, achievements, selected projects and contact. Two Lights One Escape is the featured game, with GameCon and project-evaluation wins. Paper Plane Dash keeps its Unreal gameplay and browser flight together. Sunken Greed is credited as a Unity VR team project.')
heading('Three.js presentation')
para('A procedural whale uses surface hatching and outlined geometry, with scroll-driven travel and a gentle swim cycle. Fifteen card-scale 3D scenes share a single scissored renderer: lights, mask, crystals, storm buoy and lightning, earbuds, trees, bottle, cube, ink, fossil layers, waves, orbits, valves, mirrors and salt. Only visible regions render. Pointer movement adds subtle depth.')
heading('Avatar and rig')
para('The custom Blender avatar is integrated as a GLB with Idle, Draw and Point clips, head rotation, orbit controls, pause, reset and outlines. The Draw animation traces ink from the pencil. The original Blender source remains local and must be included separately in the student submission.')
heading('Source comparisons and authentic media')
para('Matched solid and wireframe views come from the original avatar, cave, ocean and AirPods Blender files. Source files are opened with auto-execution disabled and never saved by the preview scripts. Preview subdivision and geometry display are simplified for readability; they are not final-film renders.')
para('A compact interactive field book opens the internship collection: 21 approved game screenshots across seven games, with selectable thumbnails, local search, and deep-link support. Internship gameplay, Unity source and credentials are excluded from the public build.');end()
begin('Visual evidence','From paper to motion')
image('render-room.jpg',285)
para('The render room: project-specific miniatures above actual animation frames. The storm scene includes paper clouds, rain marks and a red lightning bolt.',small)
image('internship-book.jpg',240)
para('The AIRIDEV field book keeps the default page compact. Opening it reveals actual screenshots and project miniatures; media sources are assigned only on first opening.',small);end()
begin('Module 4','Doodle and the notes')
heading('Source corpus')
para('portfolio-notes.js contains approved profile facts and project descriptions derived from the information supplied by Hassan. Team attribution is preserved. Hassan confirmed asset integration, shared programming and story development for Sunken Greed.')
heading('Retrieval and generation pipeline')
para('<b>1. Chunk:</b> divide documents into windows of up to 140 words with a 100-word stride, retaining section links and source titles.<br/><b>2. Embed:</b> when configured, use gemini-embedding-001 with 768 dimensions; keep a vector index cached within the warm server function.<br/><b>3. Retrieve:</b> embed the question, compute cosine similarity and combine a small lexical relevance boost; select three source chunks.<br/><b>4. Generate:</b> send only the retrieved public notes and current question to the Gemini API, with a strict answer/citation schema.<br/><b>5. Ground:</b> accept source IDs only from retrieved chunks. Reject unsupported citation output and return an unknown-answer fallback when evidence is missing.')
heading('Current live configuration')
para('At the last live verification, provider credentials were not active. The user is configuring a replacement key in a verified Free-tier Google project. Until a successful live test, the interface remains in <b>Local portfolio notes</b> mode. It uses sparse TF-IDF vectors and source links without pretending to generate an LLM answer. The server-side RAG route is implemented and mock-tested, but a live provider test remains required after configuration.')
heading('Configuration and boundaries')
para('Set GEMINI_API_KEY and GEMINI_FREE_TIER_CONFIRMED=true only for a verified unbilled Free-tier Google project. Generation uses gemini-3.5-flash-lite. There is no paid-provider fallback. The browser never receives a key. No private Unity source or conversation history is part of the corpus. Google states that free-tier inputs may be used to improve its products; the interface identifies Google as the AI provider. Per-instance rate limits and input bounds provide basic abuse protection; larger deployment requires a shared rate-limit store.')
para('Official references: ai.google.dev/api/embeddings and ai.google.dev/api/generate-content',small);end()
begin('Modules 5 and 6','Delivery and verification')
heading('Contact system')
para('The contact form includes name, email, subject and message, frontend and backend validation, a honeypot, timing checks, same-origin validation, rate limits and idempotent provider requests. Credentials stay in environment variables. The paper folds away only after a signed receipt reports provider-confirmed delivery. A separate preview is clearly labeled as unsent.')
para('<b>Pending:</b> configure RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL. Complete a real delivery test and save evidence. A simulated or provider-accepted request is not evidence of successful delivery.')
heading('Performance and accessibility')
para('Actual game captures are compressed WebP images, totaling approximately 906 KB across 21 images. Videos are loaded on request and paused offscreen. GLB viewers initialize lazily. Shared miniatures cap pixel density and stop when hidden. Desktop avatar rendering follows display frames; smaller screens retain a lighter 30 fps budget. Whale scroll movement uses delta-time interpolation.')
para('Native controls support touch and keyboard, visible focus, Escape to close Doodle, readable non-3D fallbacks and reduced-motion handling. The manual opening is short, skippable and bypassed for reduced motion. Checks at 390 px confirmed that the panel and collection fit without horizontal overflow. Physical-device profiling remains outstanding.')
heading('Checks performed')
para('JavaScript syntax and clean static build; actual screenshot loading; thumbnail selection; collection search; source comparison sliders; Doodle source-linked answers and unknown facts; desktop and mobile layouts. Automated mocked checks cover RAG retrieval/citations/provider failures and contact validation, receipts and failure cases. No real AI call or email was made by those tests.');end()
begin('Submission status','Finish the last pages')
heading('Implemented and available')
para('Frontend source; Vercel API routes; responsive professional portfolio; interactive Three.js elements; custom rigged avatar and exported GLB; public live deployment and GitHub repository; original Blender source comparisons; actual project imagery; Doodle guide; promotional-video-independent opening animation; setup README and test tools.')
heading('Still required before final submission')
para('<b>Live RAG:</b> configure a provider key, verify grounded answers with real questions, record retrieval/citation examples and unknown-answer behavior.<br/><b>Email:</b> configure sender and destination, verify successful delivery and capture evidence.<br/><b>Promotional video:</b> 30-60 second MP4 and native After Effects .aep. Deferred by the student.<br/><b>Source package:</b> the current source archive includes the rigged .blend and GLB, with a passed source/export animation comparison.<br/><b>Content:</b> Sunken Greed contribution is now confirmed; add further approved achievement evidence where desired.<br/><b>Final audit:</b> test on a physical phone and desktop, check media loading and error states, then update this working report to reflect the completed modules.')
heading('Reproduce and expand')
para('Run node tools/build-site.mjs, then node tools/serve-story-preview.mjs and open http://127.0.0.1:4175/. The ordinary static Python server does not execute API routes. Vercel uses the same explicit build allowlist. Rebuild before previewing source changes.')
para('Add projects to projects.js, approved corpus notes to portfolio-notes.js, and screenshots to the collection entries. Add only approved media to the build allowlist. New procedural motifs can join mini-scenes.js without adding a renderer for every card.')
para('This report is a working technical record, not a claim that all semester requirements have already been fulfilled.',small);end()
c.save();print(out)

