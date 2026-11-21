import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

export async function mountAvatar() {
  const stage = document.querySelector('#avatar-stage');
  const canvas = document.querySelector('#avatar-canvas');
  const poster = document.querySelector('#avatar-poster');
  const status = document.querySelector('#avatar-status');
  const buttons = [...document.querySelectorAll('[data-avatar-clip]')];
  const pause = document.querySelector('#avatar-pause');
  const reset = document.querySelector('#avatar-reset');
  const outlineToggle = document.querySelector('#avatar-outlines');
  const headInput = document.querySelector('#avatar-head');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer, model, controls;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 720 ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2, 2, 2.2, -2.2, .1, 40);
    camera.position.set(4, 4.1, 9);
    controls = new OrbitControls(camera, canvas);
    controls.target.set(.05, 1.8, 0);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = .12;
    controls.minZoom = .8;
    controls.maxZoom = 1.65;
    controls.minPolarAngle = Math.PI * .28;
    controls.maxPolarAngle = Math.PI * .55;
    controls.update();
    controls.saveState();
    scene.add(new THREE.HemisphereLight(0xfff8e8, 0x8d7e67, 1.8));
    const key = new THREE.DirectionalLight(0xfff4df, 2.2);
    key.position.set(-3, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 5, bottom: -2, near: .1, far: 15 });
    key.shadow.bias = -.0005;
    key.shadow.normalBias = .025;
    scene.add(key);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: .13 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = .055;
    ground.receiveShadow = true;
    ground.material.userData.outlineParameters = { visible: false };
    scene.add(ground);
    const effect = new OutlineEffect(renderer, { defaultThickness: .002, defaultColor: [.10, .075, .055], defaultKeepAlive: true });
    const gltf = await new GLTFLoader().loadAsync('./assets/avatar/hassan-doodle-rigged.glb', event => {
      status.textContent = event.total ? `Bringing the sketch to life… ${Math.round(event.loaded / event.total * 100)}%` : 'Loading the character…';
    });
    model = gltf.scene;
    const materials = new Map();
    model.traverse(object => {
      if (!object.isMesh) return;
      object.frustumCulled = false; // The baked poses move outside the neutral mesh bounds.
      object.castShadow = !/eye|pupil|brow|mustache|nose|smile|hair.*mark/i.test(object.name);
      const convert = source => {
        if (materials.has(source.uuid)) return materials.get(source.uuid);
        const material = source.clone();
        material.roughness = 1;
        material.metalness = 0;
        const detailed = /ink|glasses|groove/i.test(source.name);
        material.userData.outlineParameters = { thickness: detailed ? .0006 : .0018, color: [.10, .075, .055], visible: true };
        materials.set(source.uuid, material);
        return material;
      };
      object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material);
    });
    scene.add(model);
    const mixer = new THREE.AnimationMixer(model);
    const actions = new Map(gltf.animations.map(clip => [clip.name, mixer.clipAction(clip)]));
    for (const name of ['Idle', 'Draw', 'Point']) if (!actions.has(name)) throw new Error(`Missing animation: ${name}`);
    const head = model.getObjectByName('head');
    // Track an actual skinned graphite vertex, so ink follows the exported rig.
    let tipMesh, tipIndex = 0, lowest = Infinity;
    model.updateMatrixWorld(true);
    model.traverse(object => {
      if (!object.isMesh || !/graphite/i.test(object.name)) return;
      const positions = object.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const point = new THREE.Vector3().fromBufferAttribute(positions, i);
        if (object.isSkinnedMesh) object.applyBoneTransform(i, point);
        object.localToWorld(point);
        if (point.y < lowest) { lowest = point.y; tipMesh = object; tipIndex = i; }
      }
    });
    const inkGeometry = new THREE.BufferGeometry();
    const inkPositions = new Float32Array(600 * 18);
    inkGeometry.setAttribute('position', new THREE.BufferAttribute(inkPositions, 3).setUsage(THREE.DynamicDrawUsage));
    inkGeometry.setDrawRange(0, 0);
    const inkMaterial = new THREE.MeshBasicMaterial({ color: 0xa92e21, side: THREE.DoubleSide });
    inkMaterial.userData.outlineParameters = { visible: false };
    const ink = new THREE.Mesh(inkGeometry, inkMaterial);
    ink.frustumCulled = false;
    scene.add(ink);
    const reveal = document.createElement('a');
    reveal.className = 'avatar-project-reveal';
    reveal.href = '#paper-dash';
    reveal.textContent = 'Paper Plane Dash ↗';
    reveal.hidden = true;
    stage.append(reveal);
    let previousTip = null, segments = 0, drawingTime = 0;
    function clearInk() {
      previousTip = null; segments = 0; drawingTime = 0;
      inkGeometry.setDrawRange(0, 0); reveal.hidden = true;
    }
    function traceInk(delta) {
      if (currentName !== 'Draw' || paused || !tipMesh) return;
      drawingTime += delta;
      model.updateMatrixWorld(true);
      const point = new THREE.Vector3().fromBufferAttribute(tipMesh.geometry.attributes.position, tipIndex);
      if (tipMesh.isSkinnedMesh) tipMesh.applyBoneTransform(tipIndex, point);
      tipMesh.localToWorld(point);
      // Ignore the approach to the page during the pose crossfade.
      if (point.y > .085) { previousTip = null; return; }
      point.y = .062;
      if (previousTip && segments < 600 && point.distanceTo(previousTip) > .0008) {
        const normal = new THREE.Vector3(point.z - previousTip.z, 0, previousTip.x - point.x).normalize().multiplyScalar(.009);
        const a = previousTip.clone().add(normal), b = previousTip.clone().sub(normal);
        const c = point.clone().add(normal), d = point.clone().sub(normal);
        [a,b,c,b,d,c].forEach((v,i) => v.toArray(inkPositions, segments * 18 + i * 3));
        segments++;
        inkGeometry.attributes.position.needsUpdate = true;
        inkGeometry.setDrawRange(0, segments * 6);
      }
      previousTip = point;
      if (drawingTime > 1.6 && segments > 8) reveal.hidden = false;
      stage.dataset.inkSegments = String(segments);
    }
    let current = actions.get('Idle');
    let currentName = 'Idle';
    let paused = reduced.matches;
    let headAngle = 0;
    const baseHead = head?.quaternion.clone();
    let visible = true;
    let raf = 0;
    let lastTime = 0;
    let lastPaint = 0;
    let frames = 0;
    current.play();
    mixer.update(0);
    if (head) baseHead.copy(head.quaternion);
    function announce() {
      pause.textContent = paused ? 'Play' : 'Pause';
      pause.setAttribute('aria-label', paused ? 'Play avatar animation' : 'Pause avatar animation');
      status.textContent = `${currentName} · ${paused ? 'paused' : 'playing'}${reduced.matches && paused ? ' · reduced motion respected' : ''}`;
      stage.dataset.clip = currentName;
      stage.dataset.playing = String(!paused);
    }
    function requestFrame() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
    function frame(time) {
      raf = 0;
      if (!visible || document.hidden) { lastTime = 0; return; }
      // Desktop follows display frames; small screens retain a modest 30 fps budget.
      if (!paused && innerWidth < 720 && time - lastPaint < 32) { requestFrame(); return; }
      const delta = lastTime ? Math.min((time - lastTime) / 1000, .06) : 0;
      lastTime = time; lastPaint = time;
      if (head) head.quaternion.copy(baseHead);
      mixer.update(paused ? 0 : delta);
      if (head) { baseHead.copy(head.quaternion); head.rotateY(headAngle); }
      traceInk(paused ? 0 : delta);
      const moved = controls.update();
      if (outlineToggle.checked) effect.render(scene, camera); else renderer.render(scene, camera);
      stage.dataset.renderedFrames = String(++frames);
      stage.dataset.drawCalls = String(renderer.info.render.calls);
      if (!paused || moved) requestFrame();
    }
    function resize() {
      const { width, height } = stage.getBoundingClientRect();
      const aspect = width / height;
      const halfHeight = Math.max(2.2, 1.85 / aspect);
      Object.assign(camera, { left: -halfHeight * aspect, right: halfHeight * aspect, top: halfHeight, bottom: -halfHeight });
      camera.updateProjectionMatrix();
      effect.setSize(width, height);
      requestFrame();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      lastTime = 0;
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      requestFrame();
    }, { threshold: .01 });
    visibilityObserver.observe(stage);
    document.addEventListener('visibilitychange', () => { lastTime = 0; requestFrame(); });
    for (const button of buttons) {
      button.disabled = false;
      button.addEventListener('click', () => {
        const next = actions.get(button.dataset.avatarClip);
        if (button.dataset.avatarClip === 'Draw') {
          clearInk();
          if (reduced.matches) reveal.hidden = false;
        }
        if (next !== current) {
          next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
          if (reduced.matches || paused) current.stop(); else current.crossFadeTo(next, .25, false);
          current = next;
          currentName = button.dataset.avatarClip;
        }
        if (!reduced.matches) paused = false;
        for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
        announce(); requestFrame();
      });
    }
    for (const input of [pause, reset, outlineToggle, headInput]) input.disabled = false;
    if (!head) headInput.disabled = true;
    pause.addEventListener('click', () => { paused = !paused; lastTime = 0; announce(); requestFrame(); });
    reset.addEventListener('click', () => { controls.reset(); headAngle = 0; headInput.value = '0'; document.querySelector('#avatar-head-value').value = '0°'; requestFrame(); });
    outlineToggle.addEventListener('change', requestFrame);
    headInput.addEventListener('input', () => {
      headAngle = THREE.MathUtils.degToRad(Number(headInput.value));
      document.querySelector('#avatar-head-value').value = `${headInput.value}°`;
      requestFrame();
    });
    controls.addEventListener('change', requestFrame);
    canvas.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') controls.reset();
      else {
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), event.key === 'ArrowLeft' ? -.14 : .14);
        camera.position.copy(controls.target).add(offset); controls.update();
      }
      requestFrame();
    });
    reduced.addEventListener('change', event => { if (event.matches) paused = true; announce(); requestFrame(); });
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault(); visible = false; if (raf) cancelAnimationFrame(raf); raf = 0;
      canvas.hidden = true; poster.hidden = false;
      [...buttons, pause, reset, outlineToggle, headInput].forEach(input => input.disabled = true);
      status.textContent = 'The 3D view was interrupted. Reload the page to bring him back.';
    });
    canvas.hidden = false; poster.hidden = true;
    stage.setAttribute('aria-busy', 'false'); stage.dataset.ready = 'true';
    resize(); announce(); requestFrame();
  } catch (error) {
    controls?.dispose(); renderer?.dispose();
    canvas.hidden = true; poster.hidden = false;
    throw error;
  }
}
