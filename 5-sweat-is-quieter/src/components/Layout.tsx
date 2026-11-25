import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop } from "../anim";
import { assetsReady } from "../data/timing";
import { body, C, display } from "../theme";

/** Background gelap sinematik: gradasi, debu melayang, grain, vignette */
export const Background: React.FC<{ dawn?: number }> = ({ dawn = 0 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dust = Array.from({ length: 34 }).map((_, i) => {
    const speed = 0.25 + (i % 6) * 0.12;
    const x = ((i * 211) % width) + Math.sin((frame + i * 37) / 70) * 30;
    const y = height + 40 - ((frame * speed + i * 97) % (height + 80));
    return { x, y, r: 1.5 + (i % 4), o: 0.12 + (i % 5) * 0.06 };
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)` }}>
      <AbsoluteFill
        style={{
          opacity: dawn,
          background: `radial-gradient(ellipse 120% 60% at 50% 100%, ${C.dawn} 0%, rgba(232,176,75,0.35) 35%, rgba(11,11,13,0) 75%)`,
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 8} />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0" />
          </filter>
        </defs>
        {dust.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={C.gold} opacity={d.o} />
        ))}
        <rect width={width} height={height} filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Fade + sedikit zoom tiap scene */
export const SceneWrapper: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, duration - 6, duration], [0, 1, 1, 0], clamp);
  const scale = interpolate(frame, [0, duration], [1.04, 1], clamp);
  return <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};

/** Judul besar di area atas (y 250–470) */
export const Title: React.FC<{ lines: { text: string; color?: string }[]; at?: number; size?: number; top?: number }> = ({
  lines,
  at = 2,
  size = 118,
  top = 250,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top, width: "100%", textAlign: "center", fontFamily: display }}>
      {lines.map((l, i) => {
        const s = pop(frame, at + i * 5, fps, 14);
        return (
          <div
            key={i}
            style={{
              fontSize: size,
              lineHeight: 1.0,
              color: l.color ?? C.ink,
              letterSpacing: 1,
              textTransform: "uppercase",
              opacity: Math.min(1, s * 1.4),
              transform: `translateY(${(1 - s) * 40}px)`,
              textShadow: "0 6px 30px rgba(0,0,0,0.6)",
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** Label pill + progress bar di atas (y 110–200) */
export const TopBadge: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 118, width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          border: `2px solid ${C.gold}`,
          borderRadius: 999,
          padding: "8px 34px 12px",
          fontFamily: body,
          fontWeight: 700,
          fontSize: 30,
          color: C.gold,
          letterSpacing: 6,
          background: "rgba(11,11,13,0.6)",
        }}
      >
        {label}
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 5, width: `${(frame / durationInFrames) * 100}%`, background: C.gold }} />
      </div>
    </div>
  );
};

export type SfxName = "whoosh" | "impact" | "tick" | "check" | "rise";

/** SFX — otomatis nonaktif kalau asset belum di-generate */
export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number }> = ({ at, name, volume = 0.5 }) => {
  if (!assetsReady) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none">
      <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};

/** Kanvas SVG penuh 1080x1920 untuk ilustrasi */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {children}
  </svg>
);
