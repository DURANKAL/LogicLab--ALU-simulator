import * as THREE from "three";

function designColor(name) {
  return new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
}

function disposeScene(scene) {
  const geometries = new Set();
  const materials = new Set();
  scene.traverse((object) => {
    if (!object.isMesh && !object.isLine) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
    }
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
}

export function mountHeroScene(canvas) {
  const cyan = designColor("--color-signal");
  const violet = designColor("--color-violet");
  const slate = designColor("--color-border");
  const board = designColor("--color-panel");
  const raised = designColor("--color-panel-raised");
  const dark = designColor("--color-ink");
  const text = designColor("--color-text");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (error) {
    throw new Error("WebGL is unavailable for the optional LogicLab hero scene.", { cause: error });
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 3.7, 8.5);
  camera.lookAt(0, 0, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.HemisphereLight(text, dark, 1.8));
  const keyLight = new THREE.DirectionalLight(cyan, 2.2);
  keyLight.position.set(3, 6, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(violet, 1.1);
  fillLight.position.set(-5, 1, -4);
  scene.add(fillLight);

  const boardMaterial = new THREE.MeshStandardMaterial({ color: board, roughness: 0.82, metalness: 0.12 });
  const chipMaterial = new THREE.MeshStandardMaterial({
    color: raised,
    roughness: 0.42,
    metalness: 0.28,
    emissive: dark,
    emissiveIntensity: 0.3,
  });
  const lineMaterial = new THREE.MeshStandardMaterial({ color: slate, roughness: 0.55, metalness: 0.35 });
  const signalMaterial = new THREE.MeshStandardMaterial({
    color: cyan,
    emissive: cyan,
    emissiveIntensity: 1.2,
    roughness: 0.3,
  });
  const zeroMaterial = new THREE.MeshStandardMaterial({ color: slate, roughness: 0.7 });
  const chip = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.38, 1.75), chipMaterial);
  chip.position.y = 0.2;
  scene.add(chip);

  const base = new THREE.Mesh(new THREE.BoxGeometry(8, 0.12, 5), boardMaterial);
  base.position.y = -0.12;
  scene.add(base);

  const routeGeometry = new THREE.BoxGeometry(0.035, 0.025, 1.25);
  const routePairs = [[-3.5, -1.6], [-3.5, -0.55], [-3.5, 0.55], [-3.5, 1.6], [3.5, -1.6], [3.5, -0.55], [3.5, 0.55], [3.5, 1.6]];
  for (const [x, z] of routePairs) {
    const route = new THREE.Mesh(routeGeometry, lineMaterial);
    route.position.set(x / 2, 0.01, z);
    scene.add(route);
  }

  for (let index = 0; index < 8; index += 1) {
    const side = index < 4 ? -1 : 1;
    const row = index % 4;
    const pin = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.04, 0.24),
      lineMaterial,
    );
    pin.position.set(side * 1.35, 0.12, -0.63 + row * 0.42);
    scene.add(pin);
  }

  const bitGeometry = new THREE.SphereGeometry(0.09, 12, 8);
  const signals = Array.from({ length: 12 }, (_, index) => {
    const bit = new THREE.Mesh(bitGeometry, index % 3 === 2 ? signalMaterial : zeroMaterial);
    bit.userData.route = index % 4;
    bit.userData.side = index < 4 ? -1 : index < 8 ? 0 : 1;
    bit.userData.offset = index / 12;
    scene.add(bit);
    return bit;
  });

  const timer = new THREE.Timer();
  timer.connect(document);
  let result = { binaryA: "0101", binaryB: "0011", binary: "0110", carryOut: 0 };
  let visible = true;
  let inViewport = true;
  let disposed = false;
  const resizeObserver = new ResizeObserver(resize);

  function resize() {
    if (disposed) return;
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
    renderer.setSize(bounds.width, bounds.height, false);
  }

  function update(next) {
    if (!next || !/^[01]{4}$/.test(next.binaryA) || !/^[01]{4}$/.test(next.binaryB) || !/^[01]{4}$/.test(next.binary)) return;
    result = next;
    signals.forEach((signal, index) => {
      const bit = index < 4 ? result.binaryA[index] : index < 8 ? result.binaryB[index - 4] : result.binary[index - 8];
      signal.material = bit === "1" ? signalMaterial : zeroMaterial;
    });
  }

  function animate() {
    if (!visible || disposed) return;
    timer.update();
    const elapsed = timer.getElapsed();
    chip.rotation.y = Math.sin(elapsed * 0.28) * 0.035;
    signals.forEach((signal) => {
      const direction = signal.userData.side;
      const progress = (elapsed * 0.14 + signal.userData.offset) % 1;
      const targetX = direction === 0 ? Math.sin(progress * Math.PI * 2) * 0.42 : direction * (1.7 + progress * 1.25);
      signal.position.set(targetX, 0.25 + Math.sin(progress * Math.PI * 2) * 0.07, -1.55 + signal.userData.route * 0.95);
    });
    renderer.render(scene, camera);
  }

  function setVisible(nextVisible) {
    inViewport = nextVisible;
    visible = inViewport && document.visibilityState === "visible";
    renderer.setAnimationLoop(visible && !disposed ? animate : null);
  }

  const handleVisibilityChange = () => setVisible(inViewport);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  resizeObserver.observe(canvas);
  const intersectionObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
  intersectionObserver.observe(canvas);
  resize();
  update(result);
  setVisible(true);

  return {
    update,
    dispose() {
      if (disposed) return;
      disposed = true;
      renderer.setAnimationLoop(null);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      timer.dispose();
      disposeScene(scene);
      renderer.dispose();
    },
  };
}
