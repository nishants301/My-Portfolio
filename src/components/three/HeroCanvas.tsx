"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import { useCanRender3D } from "@/lib/hooks";

/** Thin orbital rings — the "instrument" read, and near-free to render. */
function ScanRings() {
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  const c = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (a.current) a.current.rotation.z += d * 0.10;
    if (b.current) b.current.rotation.z -= d * 0.07;
    if (c.current) c.current.rotation.y += d * 0.05;
  });

  const ring = (r: number, opacity: number) => (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[r, 0.0035, 3, 220]} />
      <meshBasicMaterial color="#4ade80" transparent opacity={opacity} />
    </mesh>
  );

  return (
    <>
      <group ref={a} rotation={[0.5, 0, 0]}>{ring(2.75, 0.22)}</group>
      <group ref={b} rotation={[-0.35, 0.4, 0]}>{ring(3.15, 0.13)}</group>
      <group ref={c} rotation={[1.2, 0, 0.3]}>{ring(2.45, 0.09)}</group>
    </>
  );
}

/** Static stand-in used when WebGL is unavailable or motion is reduced. */
function Fallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(74,222,128,0.16) 0%, rgba(74,222,128,0.05) 28%, transparent 62%)",
      }}
    />
  );
}

export default function HeroCanvas() {
  const capable = useCanRender3D();

  // `null` = still probing. Render nothing rather than mounting a canvas we
  // may immediately tear down.
  if (capable === null) return null;
  if (!capable) return <Fallback />;

  return (
    // On wide screens the field is pushed into the right half so the headline
    // sits on clean ground — particles behind type destroy legibility, and the
    // copy has to win that fight every time.
    <div
      className="absolute inset-y-0 left-0 right-0 lg:left-[38%] lg:right-[-6%]"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        // Clamped DPR: retina at 3x costs 9x the fragments for no visible gain
        // on a particle field this soft.
        dpr={[1, 1.6]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <ParticleField />
          <ScanRings />
        </Suspense>
      </Canvas>
    </div>
  );
}
