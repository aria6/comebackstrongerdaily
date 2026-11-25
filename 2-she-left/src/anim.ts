import { Easing, interpolate, spring } from "remotion";
import { findScene, getWords } from "./data/timing";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring 0→1 mulai di frame `at`. Minimal 0.001 (bukan 0) supaya transform scale(0) tidak membuat Chrome Linux crash. */
export const pop = (frame: number, at: number, fps: number, damping = 12) =>
  Math.max(0.001, spring({ frame: frame - at, fps, config: { damping, stiffness: 140, mass: 0.7 } }));

export const prog = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "");

/** Frame (relatif awal scene) saat kata `needle` mulai diucapkan */
export const wordFrame = (sceneId: string, needle: string, fallback: number, occurrence = 0) => {
  const found = findScene(sceneId);
  if (!found) return fallback;
  const target = norm(needle);
  let seen = 0;
  for (const w of getWords(found.s)) {
    if (norm(w.text).startsWith(target)) {
      if (seen === occurrence) return Math.round((found.t.lead + w.start) * found.t.fps);
      seen++;
    }
  }
  return fallback;
};
