import React from "react";
import { C } from "../theme";

/**
 * Siluet pria yang bisa diberi pose (SVG). Sudut dalam derajat:
 *  - torso / neck : 0 = tegak ke atas, positif = condong ke depan (kanan)
 *  - tungkai      : [atas absolut, bawah relatif]; 0 = lurus ke bawah, 90 = ke depan, -90 = ke belakang
 * Figur otomatis "menapak" di garis `ground` (titik terendah menempel ke tanah).
 */
export type Limb = [number, number];
export type Pose = { torso: number; neck: number; armB: Limb; armF: Limb; legB: Limb; legF: Limb };

const L = { torso: 150, neck: 26, head: 36, upper: 82, fore: 78, thigh: 104, shin: 100 };
const W = { torso: 56, limb: 32 };

export const POSES: Record<string, Pose> = {
  stand: { torso: 0, neck: 0, armB: [-6, 4], armF: [7, 6], legB: [-5, 3], legF: [6, -2] },
  slump: { torso: 12, neck: 70, armB: [34, 44], armF: [42, 38], legB: [116, -78], legF: [124, -82] },
  lying: { torso: 90, neck: 8, armB: [-90, 0], armF: [-86, 0], legB: [-90, 0], legF: [-92, 0] },
  pushup: { torso: 76, neck: 14, armB: [-4, 0], armF: [4, 0], legB: [-56, 0], legF: [-53, 0] },
  kneel: { torso: 8, neck: 2, armB: [-12, 10], armF: [58, -24], legB: [-14, -76], legF: [92, -92] },
  fist: { torso: -2, neck: -10, armB: [-12, 6], armF: [168, 8], legB: [-7, 3], legF: [8, -2] },
  pushdown: { torso: 84, neck: 16, armB: [-58, 104], armF: [-50, 100], legB: [-72, 0], legF: [-70, 0] },
  holdLow: { torso: 6, neck: 14, armB: [146, 50], armF: [140, 56], legB: [-14, -76], legF: [92, -92] },
  holdHigh: { torso: 0, neck: -6, armB: [176, 2], armF: [172, 4], legB: [-6, 3], legF: [8, -2] },
  walk: { torso: 4, neck: 0, armB: [-26, 12], armF: [24, 14], legB: [-20, 8], legF: [22, -4] },
  fallen: { torso: 28, neck: 30, armB: [40, 10], armF: [55, 20], legB: [-8, 70], legF: [20, 60] },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpLimb = (a: Limb, b: Limb, t: number): Limb => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

/** Pose lari, `ph` = fase (radian) */
export const runPose = (ph: number): Pose => {
  const s = Math.sin(ph);
  return {
    torso: 14,
    neck: -6,
    armF: [44 * s, 86],
    armB: [-44 * s, 86],
    legF: [42 * s, -10 - 60 * Math.max(0, -s)],
    legB: [-42 * s, -10 - 60 * Math.max(0, s)],
  };
};

export const mix = (a: Pose, b: Pose, t: number): Pose => ({
  torso: lerp(a.torso, b.torso, t),
  neck: lerp(a.neck, b.neck, t),
  armB: lerpLimb(a.armB, b.armB, t),
  armF: lerpLimb(a.armF, b.armF, t),
  legB: lerpLimb(a.legB, b.legB, t),
  legF: lerpLimb(a.legF, b.legF, t),
});

/** Rangkai beberapa pose: keys = [[t0, pose0], [t1, pose1], ...], t = progres 0..1 */
export const chain = (keys: [number, Pose][], t: number): Pose => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, p0] = keys[i - 1];
      const [t1, p1] = keys[i];
      const k = (t - t0) / (t1 - t0);
      return mix(p0, p1, k * k * (3 - 2 * k));
    }
  }
  return keys[keys.length - 1][1];
};

type P = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const dir = (p: P, len: number, a: number): P => [p[0] + len * Math.sin(rad(a)), p[1] + len * Math.cos(rad(a))];

const joints = (pose: Pose) => {
  const hip: P = [0, 0];
  const up = 180 - pose.torso;
  const neck = dir(hip, L.torso, up);
  const shoulder = dir(hip, L.torso * 0.9, up);
  const headC = dir(neck, L.neck + L.head * 0.7, 180 - (pose.torso + pose.neck));
  const limb = (from: P, l1: number, l2: number, [a, b]: Limb): [P, P, P] => {
    const mid = dir(from, l1, a);
    return [from, mid, dir(mid, l2, a + b)];
  };
  return {
    hip,
    neck,
    headC,
    armB: limb(shoulder, L.upper, L.fore, pose.armB),
    armF: limb(shoulder, L.upper, L.fore, pose.armF),
    legB: limb(hip, L.thigh, L.shin, pose.legB),
    legF: limb(hip, L.thigh, L.shin, pose.legF),
  };
};

const path = (pts: P[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

export const Figure: React.FC<{
  pose: Pose;
  x: number;
  ground: number;
  scale?: number;
  color?: string;
  back?: string;
  flip?: boolean;
  opacity?: number;
  glow?: string;
  /** rambut panjang (siluet wanita) */
  hair?: boolean;
  /** lempeng beban (barbel tampak samping) di tangan depan */
  plate?: boolean;
}> = ({ pose, x, ground, scale = 1, color = C.bone, back = C.boneDark, flip = false, opacity = 1, glow, hair = false, plate = false }) => {
  const j = joints(pose);
  const pts: P[] = [j.hip, j.neck, ...j.armB, ...j.armF, ...j.legB, ...j.legF];
  const maxY = Math.max(...pts.map((p) => p[1] + W.limb / 2), j.headC[1] + L.head, j.hip[1] + W.torso / 2);
  const ty = ground - maxY * scale;
  const line = (pts2: P[], c: string, w: number) => (
    <path d={path(pts2)} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  );
  return (
    <g
      transform={`translate(${x} ${ty}) scale(${flip ? -scale : scale} ${scale})`}
      opacity={opacity}
      style={glow ? { filter: `drop-shadow(0 0 24px ${glow})` } : undefined}
    >
      {hair && (
        <path
          d={`M${j.headC[0] - 38} ${j.headC[1] - 6} Q${j.headC[0] - 46} ${j.headC[1] + 70} ${j.headC[0] - 20} ${j.headC[1] + 96} L${j.headC[0] + 14} ${j.headC[1] + 70} Q${j.headC[0] + 36} ${j.headC[1] + 20} ${j.headC[0] + 34} ${j.headC[1] - 10} Z`}
          fill={back}
        />
      )}
      {line(j.armB, back, W.limb)}
      {line(j.legB, back, W.limb + 4)}
      {line([j.hip, j.neck], color, W.torso)}
      {line(j.legF, color, W.limb + 4)}
      {line(j.armF, color, W.limb)}
      <circle cx={j.headC[0]} cy={j.headC[1]} r={L.head} fill={color} />
      {plate && (
        <g>
          <circle cx={j.armF[2][0]} cy={j.armF[2][1]} r={70} fill={C.steel} stroke={C.ash} strokeWidth={10} />
          <circle cx={j.armF[2][0]} cy={j.armF[2][1]} r={16} fill={C.ash} />
        </g>
      )}
    </g>
  );
};
