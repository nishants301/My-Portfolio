"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A shell of points distributed evenly over a sphere (Fibonacci lattice) and
 * displaced by layered trig noise in the vertex shader.
 *
 * Trig noise rather than simplex: it is a fraction of the instruction count,
 * which is what keeps this at frame rate on integrated graphics — the audience
 * is founders and recruiters on ordinary laptops, not GPU owners.
 */

const COUNT = 4200;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec2  uPointer;
  uniform float uIntro;

  attribute float aScale;
  attribute float aSeed;

  varying float vFade;
  varying float vSeed;

  void main() {
    vec3 p = position;

    // Layered trig displacement — cheap stand-in for curl noise.
    float t = uTime * 0.22;
    float n =
        sin(p.x * 2.1 + t)        * 0.5
      + sin(p.y * 1.7 - t * 1.3)  * 0.35
      + sin(p.z * 2.4 + t * 0.8)  * 0.30;

    // Breathe along the surface normal so the shell keeps its silhouette.
    p += normalize(p) * n * 0.18;

    // Pointer parallax: points nearer the camera lean further, which reads
    // as depth without moving the camera itself.
    p.x += uPointer.x * (0.28 + aSeed * 0.42);
    p.y += uPointer.y * (0.28 + aSeed * 0.42);

    // Intro: points fly in from a larger radius on first paint.
    p *= mix(1.9, 1.0, uIntro);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Perspective size attenuation.
    gl_PointSize = uSize * aScale * (1.0 / -mv.z);

    // Depth fade — far points recede instead of flattening the shell.
    vFade = smoothstep(9.0, 2.0, -mv.z) * uIntro;
    vSeed = aSeed;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vFade;
  varying float vSeed;

  void main() {
    // Round, soft-edged point sprite.
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.06, d);

    // A minority of points carry the signal colour; the rest stay near-white
    // so the accent stays an accent.
    vec3 col = mix(uColorA, uColorB, step(0.82, vSeed));

    gl_FragColor = vec4(col, alpha * vFade * 0.9);
  }
`;

export default function ParticleField({ radius = 2.05 }: { radius?: number }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const pointer = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);

    // Fibonacci sphere — even coverage without the pole clustering you get
    // from naive spherical coordinates.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;

      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;

      scales[i] = 0.5 + Math.random() * 1.6;
      seeds[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [radius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 34 },
      uIntro: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#dfe4e8") },
      uColorB: { value: new THREE.Color("#4ade80") },
    }),
    []
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05); // clamp so a stalled tab does not jump
    if (mat.current) {
      const u = mat.current.uniforms;
      u.uTime.value += d;
      u.uIntro.value = THREE.MathUtils.damp(u.uIntro.value, 1, 1.6, d);

      target.current.set(
        (state.pointer.x * viewport.width) / 24,
        (state.pointer.y * viewport.height) / 24
      );
      pointer.current.lerp(target.current, 1 - Math.pow(0.001, d));
      u.uPointer.value.copy(pointer.current);
    }
    if (points.current) {
      points.current.rotation.y += d * 0.055;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
    }
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
