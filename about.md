import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { clamp } from "./utils.js";

export const initThreeParticles = () => {
  const canvas = document.getElementById("hero_particles");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 6;

  const group = new THREE.Group();
  scene.add(group);

  const makeParticles = () => {
    const count = 280;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      positions[ix + 0] = (Math.random() - 0.5) * 10;
      positions[ix + 1] = (Math.random() - 0.5) * 6;
      positions[ix + 2] = (Math.random() - 0.5) * 6;
      sizes[i] = 0.6 + Math.random() * 1.4;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(0xc9a227),
      transparent: true,
      opacity: 0.26,
      size: 0.03,
      sizeAttenuation: true,
      depthWrite: false
    });

    const points = new THREE.Points(geo, mat);
    return points;
  };

  const points = makeParticles();
  group.add(points);

  const onResize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || 520;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  onResize();
  window.addEventListener("resize", onResize);

  let t = 0;
  const tick = () => {
    t += 0.0035;
    group.rotation.y = Math.sin(t) * 0.05;
    group.rotation.x = Math.cos(t * 0.8) * 0.03;

    const scrollY = window.scrollY || 0;
    const par = clamp(scrollY / 900, 0, 1);
    group.position.y = -par * 0.35;
    group.position.x = par * 0.25;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();
};
