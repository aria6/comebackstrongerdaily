import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { getWords, SceneTiming, Word } from "../data/timing";
import { C, display } from "../theme";

const MAX_WORDS = 3;

const chunkWords = (words: Word[]) => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= MAX_WORDS || /[.,!?]$/.test(w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

const outline = "3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 8px 24px rgba(0,0,0,0.8)";

/** Subtitle Inggris per kata (1–3 kata), kata yang sedang diucapkan berwarna emas */
export const Captions: React.FC<{ scene: SceneTiming; lead: number }> = ({ scene, lead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - lead;
  const chunks = chunkWords(getWords(scene));
  if (t < 0 || chunks.length === 0) return null;
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (chunks[i][0].start <= t) idx = i;
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const lastEnd = chunks[chunks.length - 1].slice(-1)[0].end;
  if (t > lastEnd + 0.4) return null;

  const s = spring({ frame: frame - Math.round((chunk[0].start + lead) * fps), fps, config: { damping: 15, stiffness: 240 } });

  return (
    <div style={{ position: "absolute", top: 1460, width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 22px",
          maxWidth: 960,
          fontFamily: display,
          transform: `scale(${0.88 + 0.12 * s})`,
          opacity: s,
        }}
      >
        {chunk.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.08;
          return (
            <span
              key={i}
              style={{
                fontSize: 92,
                lineHeight: 1.1,
                color: active ? C.gold : C.ink,
                textShadow: outline,
                textTransform: "uppercase",
                transform: active ? "translateY(-4px)" : undefined,
              }}
            >
              {w.text.replace(/[,.]$/, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};
