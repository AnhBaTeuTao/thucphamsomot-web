"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type OrbitalRingDef = {
  radius: number;
  tube: number;
  ringColor: number;
  ringOpacity: number;
  rotation: [number, number, number];
  speed: number;
  phaseOffset: number;
  primaryColor: number;
  secondaryColor: number;
};

const ORBITAL_RINGS: OrbitalRingDef[] = [
  {
    radius: 1.92,
    tube: 0.011,
    ringColor: 0x34d399,
    ringOpacity: 0.28,
    rotation: [0.58, 0.22, 0.12],
    speed: 0.42,
    phaseOffset: 0.2,
    primaryColor: 0xf5c84c,
    secondaryColor: 0x4ade80,
  },
  {
    radius: 2.38,
    tube: 0.01,
    ringColor: 0xf5c84c,
    ringOpacity: 0.24,
    rotation: [-0.64, 0.56, 0.28],
    speed: -0.32,
    phaseOffset: 2.1,
    primaryColor: 0x4ade80,
    secondaryColor: 0xf5c84c,
  },
  {
    radius: 2.84,
    tube: 0.009,
    ringColor: 0x34d399,
    ringOpacity: 0.22,
    rotation: [0.24, -0.78, 0.46],
    speed: 0.24,
    phaseOffset: 4.0,
    primaryColor: 0xf5c84c,
    secondaryColor: 0x34d399,
  },
];

/**
 * Lightweight native Three.js 3D Cold-Chain Supply Hub.
 * Uses performance.now() directly (zero THREE.Clock deprecation warning, minimal bundle & GPU cost).
 */
export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // Studio Emerald + Gold lighting
    const ambient = new THREE.AmbientLight(0xd1fae5, 0.75);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 6, 5);
    const emeraldLight = new THREE.PointLight(0x34d399, 2.4, 14);
    emeraldLight.position.set(3.2, 1.8, 2.5);
    const goldLight = new THREE.PointLight(0xf5c84c, 1.2, 12);
    goldLight.position.set(1.2, -2.0, 2.0);
    scene.add(ambient, keyLight, emeraldLight, goldLight);

    const hubGroup = new THREE.Group();
    hubGroup.position.set(2.4, 0.15, -1.2);
    scene.add(hubGroup);

    const coreGeo = new THREE.IcosahedronGeometry(1.18, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.16,
      metalness: 0.2,
      transmission: 0.55,
      transparent: true,
      opacity: 0.44,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);

    const wireGeo = new THREE.IcosahedronGeometry(1.42, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    const wireCore = new THREE.Mesh(wireGeo, wireMat);
    hubGroup.add(innerCore, wireCore);

    const nodeGeo = new THREE.SphereGeometry(0.056, 12, 12);
    const haloGeo = new THREE.SphereGeometry(0.125, 12, 12);
    const disposableGeos: THREE.BufferGeometry[] = [coreGeo, wireGeo, nodeGeo, haloGeo];
    const disposableMats: THREE.Material[] = [coreMat, wireMat];

    const orbitNodes: Array<{
      nodeA: THREE.Group;
      nodeB: THREE.Group;
      radius: number;
      speed: number;
      phaseOffset: number;
    }> = [];

    for (const cfg of ORBITAL_RINGS) {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(cfg.rotation[0], cfg.rotation[1], cfg.rotation[2]);

      const torusGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 10, 84);
      const torusMat = new THREE.MeshBasicMaterial({
        color: cfg.ringColor,
        transparent: true,
        opacity: cfg.ringOpacity,
        depthWrite: false,
      });
      disposableGeos.push(torusGeo);
      disposableMats.push(torusMat);
      ringGroup.add(new THREE.Mesh(torusGeo, torusMat));

      const makeNode = (color: number) => {
        const g = new THREE.Group();
        const m1 = new THREE.MeshBasicMaterial({ color });
        const m2 = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.24,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        disposableMats.push(m1, m2);
        g.add(new THREE.Mesh(nodeGeo, m1), new THREE.Mesh(haloGeo, m2));
        return g;
      };

      const nodeA = makeNode(cfg.primaryColor);
      const nodeB = makeNode(cfg.secondaryColor);
      ringGroup.add(nodeA, nodeB);
      hubGroup.add(ringGroup);

      orbitNodes.push({
        nodeA,
        nodeB,
        radius: cfg.radius,
        speed: cfg.speed,
        phaseOffset: cfg.phaseOffset,
      });
    }

    // 84 Cold-Mist Particles
    const count = 84;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const mint = new THREE.Color("#a7f3d0");
    const gold = new THREE.Color("#fde68a");
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399963229728653;
      const radial = 1.6 + ((i * 37) % 100) * 0.032;
      positions[i * 3] = 2.1 + Math.cos(angle) * radial;
      positions[i * 3 + 1] = (((i * 19) % 100) / 100 - 0.5) * 4.4;
      positions[i * 3 + 2] = -1.2 + (((i * 53) % 100) / 100 - 0.5) * 3.2;
      const c = i % 4 === 0 ? gold : mint;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    mistGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mistMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposableGeos.push(mistGeo);
    disposableMats.push(mistMat);
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    scene.add(mistPoints);

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let motionScale = reducedMq.matches ? 0.25 : 1;
    const handleReducedChange = () => {
      motionScale = reducedMq.matches ? 0.25 : 1;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);
    reducedMq.addEventListener("change", handleReducedChange);

    let rafId = 0;
    let lastTs = performance.now();
    let elapsed = 0;

    const animate = (now: number) => {
      rafId = window.requestAnimationFrame(animate);
      if (document.hidden) {
        lastTs = now;
        return;
      }
      const delta = Math.min((now - lastTs) / 1000, 0.05) * motionScale;
      lastTs = now;
      elapsed += delta;

      innerCore.rotation.y = elapsed * 0.14;
      innerCore.rotation.x = Math.sin(elapsed * 0.25) * 0.12;
      wireCore.rotation.y = -elapsed * 0.09;
      wireCore.rotation.z = elapsed * 0.06;

      hubGroup.position.y = 0.15 + Math.sin(elapsed * 1.1) * 0.14;
      hubGroup.rotation.y = THREE.MathUtils.lerp(hubGroup.rotation.y, pointer.x * 0.25, 0.045);
      hubGroup.rotation.x = THREE.MathUtils.lerp(hubGroup.rotation.x, -pointer.y * 0.18, 0.045);

      for (const orb of orbitNodes) {
        const a = elapsed * orb.speed + orb.phaseOffset;
        const b = a + Math.PI;
        orb.nodeA.position.set(Math.cos(a) * orb.radius, Math.sin(a) * orb.radius, 0);
        orb.nodeB.position.set(Math.cos(b) * orb.radius, Math.sin(b) * orb.radius, 0);
      }

      mistPoints.rotation.y = elapsed * 0.028;
      mistPoints.position.y = Math.sin(elapsed * 0.45) * 0.14;

      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      reducedMq.removeEventListener("change", handleReducedChange);
      disposableGeos.forEach((g) => g.dispose());
      disposableMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="b2b-hero__canvas"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
    />
  );
}
