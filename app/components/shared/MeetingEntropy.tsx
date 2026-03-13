/**
 * MeetingEntropy — 3D particle visualization.
 *
 * Visualizes "Meeting Entropy": organized waveforms at the top (productive work)
 * dissolving into chaotic noise at the bottom (pure BS).
 *
 * Color: gold at top → coral/red at bottom.
 * Driven by bsScore (0–100) which controls chaos intensity.
 *
 * Cursor interaction: particles repel from mouse, ease back on mouse leave.
 *
 * Client-only — lazy-loaded to avoid SSR issues with Three.js.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ROWS = 120;
const COLS = 200;
const COUNT = ROWS * COLS;

// Repulsion radius in world units
const REPEL_RADIUS = 18;
const REPEL_STRENGTH = 28;

interface ParticlesProps {
  bsScore: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
}

function Particles({ bsScore, mouseRef }: ParticlesProps) {
  const { scene, camera, size } = useThree();

  // Derive control values from bsScore
  const chaos = (bsScore / 100) * 2.4;
  const pulse = 0.5 + (bsScore / 100) * 0.8;
  const spread = 15 + (bsScore / 100) * 40;
  const density = 2.2;

  // Pre-allocate typed arrays once
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const colors = useMemo(() => new Float32Array(COUNT * 3), []);

  // Separate array for repulsion offsets (lerped each frame)
  const repelOffsets = useMemo(() => new Float32Array(COUNT * 3), []);

  const geoRef = useRef<THREE.BufferGeometry | null>(null);

  // Mouse influence scalar — 1 when active, decays to 0 when mouse leaves
  const influenceRef = useRef(0);

  // Projected mouse in world space (z=0 plane)
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndcMouse = useMemo(() => new THREE.Vector2(), []);
  const zPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useEffect(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    geoRef.current = geo;

    return () => {
      scene.remove(pts);
      geo.dispose();
      mat.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const geo = geoRef.current;
    if (!geo) return;

    // Update mouse influence scalar
    const targetInfluence = mouseRef.current.active ? 1 : 0;
    influenceRef.current += (targetInfluence - influenceRef.current) * 0.06;
    const influence = influenceRef.current;

    // Project mouse to world space (z=0 plane) when active
    if (influence > 0.01) {
      ndcMouse.set(
        (mouseRef.current.x / size.width) * 2 - 1,
        -(mouseRef.current.y / size.height) * 2 + 1
      );
      raycaster.setFromCamera(ndcMouse, camera);
      raycaster.ray.intersectPlane(zPlane, mouseWorld);
    }

    const mx = mouseWorld.x;
    const my = mouseWorld.y;
    const rr = REPEL_RADIUS * REPEL_RADIUS;

    for (let i = 0; i < COUNT; i++) {
      const norm = i / COUNT;
      const row = Math.floor(norm * ROWS);
      const col = (i % COLS) - COLS / 2;
      const rowNorm = row / ROWS;

      const baseFreq = 3.0 + rowNorm * 8.0;
      const wave =
        Math.sin(col * 0.08 * baseFreq + time * 1.5 + row * 0.05) *
        (1.0 - rowNorm * 0.7);

      const orderDecay = Math.pow(rowNorm, 1.8);

      const noiseX =
        Math.sin(i * 13.37 + time * 0.4) * Math.cos(i * 7.13 + time * 0.7);
      const noiseY =
        Math.cos(i * 11.51 + time * 0.3) * Math.sin(i * 5.79 + time * 0.6);
      const noiseZ =
        Math.sin(i * 9.23 + time * 0.5) * Math.cos(i * 3.47 + time * 0.8);

      const chaosAmount = orderDecay * chaos;

      const naturalX = col * 0.3 * density + noiseX * chaosAmount * spread * 0.5;
      const naturalY =
        (60 - row) * 0.5 +
        wave * (8.0 - chaosAmount * 3.0) +
        noiseY * chaosAmount * spread * 0.3;
      const naturalZ =
        wave * 2.0 * (1.0 - orderDecay) + noiseZ * chaosAmount * spread * 0.4;

      const breathe =
        Math.sin(time * 0.8 + rowNorm * Math.PI) * pulse * orderDecay;

      const baseX = naturalX + breathe * noiseX * 2.0;
      const baseY = naturalY + breathe * 0.5;
      const baseZ = naturalZ + breathe * noiseZ;

      // Repulsion: compute target offset toward/away from cursor
      let targetRepelX = 0;
      let targetRepelY = 0;

      if (influence > 0.01) {
        const dx = baseX - mx;
        const dy = baseY - my;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < rr && dist2 > 0.001) {
          const dist = Math.sqrt(dist2);
          const falloff = 1.0 - dist / REPEL_RADIUS; // 1 at center, 0 at edge
          const force = falloff * falloff * REPEL_STRENGTH;
          targetRepelX = (dx / dist) * force;
          targetRepelY = (dy / dist) * force;
        }
      }

      // Lerp repel offsets toward target (fast in, slow out)
      const lerpSpeed = influence > 0.5 ? 0.12 : 0.05;
      repelOffsets[i * 3]     += (targetRepelX * influence - repelOffsets[i * 3]) * lerpSpeed;
      repelOffsets[i * 3 + 1] += (targetRepelY * influence - repelOffsets[i * 3 + 1]) * lerpSpeed;
      repelOffsets[i * 3 + 2] += (0 - repelOffsets[i * 3 + 2]) * lerpSpeed;

      positions[i * 3]     = baseX + repelOffsets[i * 3];
      positions[i * 3 + 1] = baseY + repelOffsets[i * 3 + 1];
      positions[i * 3 + 2] = baseZ + repelOffsets[i * 3 + 2];

      // Color: gold (hue ~0.12) at top → coral/red (hue ~0.0) at bottom
      const hue = 0.12 + (0.0 - 0.12) * Math.pow(orderDecay, 0.6);
      const sat = 0.7 + orderDecay * 0.3;
      const light =
        0.45 +
        Math.sin(time + i * 0.01) * 0.08 * orderDecay +
        (1.0 - orderDecay) * 0.15;

      tmpColor.setHSL(hue, sat, light);
      colors[i * 3]     = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = geo.getAttribute("color") as THREE.BufferAttribute;
    posAttr.set(positions);
    colAttr.set(colors);
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return null;
}

interface MeetingEntropyProps {
  bsScore: number;
}

export function MeetingEntropy({ bsScore }: MeetingEntropyProps) {
  // Mouse state shared between DOM events and the R3F render loop
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  return (
    <Canvas
      camera={{ position: [0, 0, 80], fov: 55 }}
      style={{ width: "100%", height: "100%", cursor: "crosshair" }}
      gl={{ alpha: false, antialias: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#0A0A0A"), 1);
      }}
      onPointerMove={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
      }}
      onPointerLeave={() => {
        mouseRef.current.active = false;
      }}
    >
      <Particles bsScore={bsScore} mouseRef={mouseRef} />
    </Canvas>
  );
}
