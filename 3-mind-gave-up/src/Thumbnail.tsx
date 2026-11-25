import React from "react";
import { AbsoluteFill } from "remotion";
import { Figure, POSES } from "./components/Figure";
import { MindIcon } from "./components/Icons";
import { body, C, display } from "./theme";

/**
 * Thumbnail 9:16 (1080x1920). Judul + gambar utama di area y 300–1600
 * supaya tetap utuh saat dipotong 4:5 di grid Instagram.
 */
const outline = "5px 5px 0 #000, -5px 5px 0 #000, 5px -5px 0 #000, -5px -5px 0 #000, 0 14px 40px rgba(0,0,0,0.8)";

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.bg2} 0%, ${C.bg} 75%)`, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 110% 45% at 50% 82%, ${C.dawn} 0%, rgba(232,176,75,0.3) 40%, rgba(11,11,13,0) 75%)` }} />
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = Math.PI + (i / 15) * Math.PI;
        return (
          <path
            key={i}
            d={`M540 1560 L${540 + 1500 * Math.cos(a - 0.04)} ${1560 + 1500 * Math.sin(a - 0.04)} L${540 + 1500 * Math.cos(a + 0.04)} ${1560 + 1500 * Math.sin(a + 0.04)} Z`}
            fill="rgba(240,138,60,0.07)"
          />
        );
      })}
      <line x1={0} y1={1560} x2={1080} y2={1560} stroke={C.gold} strokeWidth={8} />
      {/* push-up: tubuh bergerak, pikiran ikut */}
      <Figure pose={POSES.pushup} x={420} ground={1556} scale={1.15} color={C.gold} back={C.goldDark} glow="rgba(240,138,60,0.8)" />
    </svg>
    <div style={{ position: "absolute", top: 1100, left: 700 }}>
      <MindIcon size={300} on={1} />
    </div>
    <div style={{ position: "absolute", top: 300, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: body, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: C.gold, border: `3px solid ${C.gold}`, borderRadius: 999, padding: "8px 40px 12px", background: "rgba(0,0,0,0.5)" }}>
        COMEBACK STRONGER
      </div>
    </div>
    <div style={{ position: "absolute", top: 400, width: "100%", textAlign: "center", fontFamily: display, textTransform: "uppercase", lineHeight: 1.0 }}>
      <div style={{ fontSize: 150, color: C.ink, textShadow: outline }}>Your body</div>
      <div style={{ fontSize: 150, color: C.ink, textShadow: outline }}>isn't weak.</div>
      <div style={{ fontSize: 120, color: C.gold, textShadow: outline, marginTop: 10 }}>Your mind</div>
      <div style={{ fontSize: 180, color: C.gold, textShadow: outline }}>gave up.</div>
    </div>
  </AbsoluteFill>
);
