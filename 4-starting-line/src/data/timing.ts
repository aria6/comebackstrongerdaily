import p1 from "./timing/part1.json";

export type Word = { text: string; start: number; end: number };
export type SceneTiming = {
  id: string;
  text: string;
  startFrame: number;
  durationInFrames: number;
  audio: string;
  voDuration: number;
  words: Word[];
};
export type Timing = {
  generated: boolean;
  fps: number;
  lead: number;
  rate: string;
  totalFrames: number;
  scenes: SceneTiming[];
};
export type PartId = "part1";

export const timings: Record<PartId, Timing> = { part1: p1 as Timing };
const all = [timings.part1];

export const assetsReady = all.every((t) => t.generated);

export const findScene = (id: string) => {
  for (const t of all) {
    const s = t.scenes.find((x) => x.id === id);
    if (s) return { t, s };
  }
  return null;
};

export const getWords = (scene: SceneTiming): Word[] => {
  if (scene.words.length > 0) return scene.words;
  const tokens = scene.text.split(/\s+/).filter(Boolean);
  const totalChars = tokens.reduce((a, w) => a + w.length + 1, 0);
  let t = 0;
  return tokens.map((w) => {
    const d = (scene.voDuration * (w.length + 1)) / totalChars;
    const word = { text: w, start: t, end: t + d };
    t += d;
    return word;
  });
};
