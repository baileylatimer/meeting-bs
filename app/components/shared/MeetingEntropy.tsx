/**
 * MeetingEntropy — 3D particle visualization.
 *
 * Visualizes "Meeting Entropy": organized waveforms at the top (productive work)
 * dissolving into chaotic noise at the bottom (pure BS).
 *
 * Color: gold at top → coral/red at bottom.
 * Driven by bsScore (0–100) which controls chaos intensity.
 *
 * Client-only — lazy-loaded to avoid SSR issues with Three.js.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ROWS = 120;
const COLS = 200;
const COUNT = ROWS * COLS;

interface ParticlesProps {
  bsScore: number;
}

function Particles({ bsScore }: ParticlesProps) {
  const { scene } = useThree();

  // Derive control values from bsScore
  const chaos = (bsScore / 100) * 2.4;
  const pulse = 0.5 + (bsScore / 100) * 0.8;
  const spread = 15 + (bsScore / 100) * 40;
  const density = 2.2;

  // Pre-allocate typed arrays once
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const colors = useMemo(() => new Float32Array(COUNT * 3), []);

  // Build the Points object once and add to scene
  const ptsRef = useRef<THREE.Points | null>(null);
  const geoRef = useRef<THREE.BufferGeometry | null>(null);

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
    ptsRef.current = pts;
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

      const x = col * 0.3 * density + noiseX * chaosAmount * spread * 0.5;
      const y =
        (60 - row) * 0.5 +
        wave * (8.0 - chaosAmount * 3.0) +
        noiseY * chaosAmount * spread * 0.3;
      const z =
        wave * 2.0 * (1.0 - orderDecay) + noiseZ * chaosAmount * spread * 0.4;

      const breathe =
        Math.sin(time * 0.8 + rowNorm * Math.PI) * pulse * orderDecay;

      positions[i * 3]     = x + breathe * noiseX * 2.0;
      positions[i * 3 + 1] = y + breathe * 0.5;
      positions[i * 3 + 2] = z + breathe * noiseZ;

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
  return (
    <Canvas
      camera={{ position: [0, 0, 80], fov: 55 }}
      style={{ width: "100%", height: "100%", background: "#2A2A2A" }}
      gl={{ alpha: false, antialias: false }}
    >
      <Particles bsScore={bsScore} />
    </Canvas>
  );
}
