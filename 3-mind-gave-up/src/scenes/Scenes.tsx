import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, prog, wordFrame } from "../anim";
import { Figure, mix, POSES } from "../components/Figure";
import {
  BatteryIcon,
  CheckMark,
  DumbbellIcon,
  JunkIcon,
  MindIcon,
  MoonIcon,
  ShoeIcon,
  StairsIcon,
  Strike,
  XMark,
} from "../components/Icons";
import { Sfx, Stage, Title } from "../components/Layout";
import { body, C, display } from "../theme";

type SP = { duration: number };

const useF = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps };
};

const fadeIn = (frame: number, at: number, len = 8) => interpolate(frame, [at, at + len], [0, 1], clamp);

const Big: React.FC<{ top: number; size: number; color?: string; s?: number; children: React.ReactNode; spacing?: number }> = ({
  top,
  size,
  color = C.ink,
  s = 1,
  children,
  spacing = 1,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      width: "100%",
      textAlign: "center",
      fontFamily: display,
      fontSize: size,
      lineHeight: 1,
      color,
      letterSpacing: spacing,
      textTransform: "uppercase",
      opacity: Math.min(1, s * 1.5),
      transform: `scale(${0.7 + 0.3 * s})`,
      textShadow: "0 8px 30px rgba(0,0,0,0.7)",
    }}
  >
    {children}
  </div>
);

/** Panah horizontal (SVG) */
const Arrow: React.FC<{ x1: number; x2: number; y: number; p: number; color?: string }> = ({ x1, x2, y, p, color = C.gold }) => {
  const xe = x1 + (x2 - x1) * p;
  const d = Math.sign(x2 - x1);
  return (
    <g opacity={Math.min(1, p * 3)}>
      <line x1={x1} y1={y} x2={xe} y2={y} stroke={color} strokeWidth={14} strokeLinecap="round" strokeDasharray="4 26" />
      <path d={`M${xe} ${y - 30} L${xe + 40 * d} ${y} L${xe} ${y + 30} Z`} fill={color} />
    </g>
  );
};

/** Baris ikon + label besar + sub-label */
const Row: React.FC<{ top: number; at: number; icon: React.ReactNode; label: string; sub: string; done?: number; bad?: boolean }> = ({ top, at, icon, label, sub, done, bad }) => {
  const { frame, fps } = useF();
  const s = pop(frame, at - 8, fps, 13);
  const lit = done !== undefined && done > 0.5;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        width: 940,
        height: 250,
        display: "flex",
        alignItems: "center",
        gap: 40,
        padding: "0 40px",
        borderRadius: 30,
        background: lit ? "rgba(232,176,75,0.12)" : "rgba(43,43,49,0.75)",
        border: `4px solid ${lit ? C.gold : bad ? "rgba(216,64,46,0.6)" : C.steel}`,
        opacity: Math.min(1, s * 1.4),
        transform: `translateX(${(1 - s) * 140}px)`,
      }}
    >
      <div style={{ width: 180, display: "flex", justifyContent: "center" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: display, fontSize: 84, lineHeight: 1, color: C.ink, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 34, letterSpacing: 4, whiteSpace: "nowrap", color: C.dim, marginTop: 8 }}>{sub}</div>
      </div>
      {done !== undefined && <CheckMark size={110} p={done} />}
      <Sfx at={at - 8} name={done !== undefined ? "check" : "impact"} volume={0.35} />
    </div>
  );
};

/* ---------- 1. HOOK: look at yourself ---------- */
export const HookScene: React.FC<SP> = () => {
  const { frame } = useF();
  const tired = wordFrame("hook", "tired", 25);
  const sleep = wordFrame("hook", "sleep", 65);
  const breath = wordFrame("hook", "breath", 100);
  const level = interpolate(frame, [tired, tired + 40], [0.9, 0.08], clamp);
  return (
    <>
      <Title lines={[{ text: "Look at" }, { text: "yourself.", color: C.gold }]} size={124} at={0} />
      <Row top={520} at={tired} icon={<BatteryIcon size={180} level={level} />} label="Tired" sub="ALL THE TIME" bad />
      <Row top={810} at={sleep} icon={<MoonIcon size={170} />} label="No sleep" sub="EVERY NIGHT" bad />
      <Row top={1100} at={breath} icon={<StairsIcon size={180} t={frame} />} label="No breath" sub="ON THE STAIRS" bad />
    </>
  );
};

/* ---------- 2. MIND: your mind gave up first ---------- */
export const MindScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const not = wordFrame("mind", "not", 40);
  const mind = wordFrame("mind", "mind", 60);
  const gave = wordFrame("mind", "gave", 70);
  const followed = wordFrame("mind", "followed", 120);
  const orders = wordFrame("mind", "orders", 135);
  const swap = fadeIn(frame, not - 4, 6);
  const dead = prog(frame, gave, gave + 12);
  const sag = prog(frame, followed - 4, followed + 16);
  return (
    <>
      <div style={{ opacity: 1 - swap }}>
        <Title lines={[{ text: "Your body" }, { text: "failing you?", color: C.dim }]} size={118} />
      </div>
      <div style={{ opacity: swap }}>
        <Title lines={[{ text: "It's not" }, { text: "your body.", color: C.gold }]} size={118} at={not - 4} />
      </div>
      <div style={{ position: "absolute", top: 560, left: 70, opacity: fadeIn(frame, mind - 10) }}>
        <div style={{ filter: `grayscale(${dead})` }}>
          <MindIcon size={380} on={1 - dead} />
        </div>
        <div style={{ textAlign: "center", fontFamily: display, fontSize: 96, color: C.red, opacity: dead, transform: `rotate(-6deg) scale(${0.6 + 0.4 * dead})` }}>GAVE UP</div>
      </div>
      <Stage>
        <Arrow x1={470} x2={640} y={760} p={prog(frame, gave + 6, followed)} color={C.red} />
        <line x1={560} y1={1330} x2={1040} y2={1330} stroke={C.steel} strokeWidth={6} />
        <Figure pose={mix(POSES.stand, POSES.slump, sag)} x={800} ground={1328} scale={1.15} />
      </Stage>
      <div style={{ position: "absolute", top: 1355, left: 560, width: 480, textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 38, letterSpacing: 5, color: C.dim, opacity: fadeIn(frame, orders - 6) }}>
        FOLLOWED ORDERS
      </div>
      <Sfx at={gave} name="impact" volume={0.45} />
    </>
  );
};

/* ---------- 3. GOOD: it works the other way ---------- */
export const GoodScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const other = wordFrame("good", "other", 40);
  const move = wordFrame("good", "move", 80);
  const follow = wordFrame("good", "follow", 130);
  const up = prog(frame, move - 4, move + 22);
  const on = prog(frame, follow - 4, follow + 10);
  return (
    <>
      <Title lines={[{ text: "Good news.", color: C.gold }]} size={150} at={0} />
      <div style={{ position: "absolute", top: 440, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 48, letterSpacing: 8, color: C.ink, opacity: fadeIn(frame, other - 6) }}>
        IT WORKS BOTH WAYS
      </div>
      <Stage>
        <line x1={40} y1={1330} x2={520} y2={1330} stroke={up > 0.8 ? C.gold : C.steel} strokeWidth={6} />
        <Figure
          pose={up < 0.5 ? mix(POSES.slump, POSES.kneel, up * 2) : mix(POSES.kneel, POSES.stand, (up - 0.5) * 2)}
          x={260}
          ground={1328}
          scale={1.15}
          color={up > 0.8 ? C.gold : C.bone}
          back={up > 0.8 ? C.goldDark : C.boneDark}
        />
        <Arrow x1={420} x2={600} y={900} p={prog(frame, move + 10, follow)} />
      </Stage>
      <div style={{ position: "absolute", top: 640, left: 620 }}>
        <MindIcon size={400} on={on} />
        <div style={{ textAlign: "center", fontFamily: display, fontSize: 90, color: C.gold, opacity: on }}>FOLLOWS</div>
      </div>
      <Sfx at={move} name="rise" volume={0.35} />
      <Sfx at={follow} name="check" volume={0.45} />
    </>
  );
};

/* ---------- 4. NO GYM ---------- */
export const NoGymScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const gym = wordFrame("nogym", "gym", 25);
  const program = wordFrame("nogym", "program", 75);
  const rows = [
    { at: gym - 12, x: gym + 2, label: ["A gym", "MEMBERSHIP"], icon: <DumbbellIcon size={260} /> },
    { at: program - 20, x: program + 2, label: ["The perfect", "PROGRAM"], icon: null },
  ];
  return (
    <>
      <Title lines={[{ text: "You don't" }, { text: "need...", color: C.dim }]} size={124} at={0} />
      {rows.map((r, i) => {
        const s = pop(frame, r.at, fps, 13);
        const xp = prog(frame, r.x, r.x + 12);
        return (
          <div key={i} style={{ position: "absolute", top: 530 + i * 420, left: 70, width: 940, height: 380, borderRadius: 34, background: "rgba(43,43,49,0.75)", display: "flex", alignItems: "center", gap: 40, padding: "0 50px", opacity: Math.min(1, s * 1.5) * (1 - xp * 0.35), transform: `scale(${0.85 + 0.15 * s})` }}>
            <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i === 0 ? (
                r.icon
              ) : (
                <svg width={260} height={260} viewBox="0 0 200 200">
                  <rect x={36} y={20} width={128} height={164} rx={12} fill={C.bone} />
                  <rect x={70} y={10} width={60} height={24} rx={8} fill={C.boneDark} />
                  {[0, 1, 2, 3].map((k) => (
                    <g key={k}>
                      <rect x={54} y={56 + k * 30} width={16} height={16} rx={3} fill={C.gold} />
                      <rect x={80} y={60 + k * 30} width={66} height={8} rx={4} fill={C.ash} />
                    </g>
                  ))}
                </svg>
              )}
              <div style={{ position: "absolute", top: 20, left: 20 }}>
                <XMark size={240} p={xp} />
              </div>
            </div>
            <div style={{ fontFamily: display, fontSize: 104, lineHeight: 1.05, color: C.ink, textTransform: "uppercase" }}>
              {r.label[0]}
              <div style={{ fontFamily: body, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: C.dim }}>{r.label[1]}</div>
            </div>
            <Sfx at={r.x} name="impact" volume={0.4} />
          </div>
        );
      })}
    </>
  );
};

/* ---------- 5. PUSH-UP: ten? three. tomorrow four ---------- */
export const PushupScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const floor = wordFrame("pushup", "floor", 15);
  const ten = wordFrame("pushup", "ten", 50);
  const cant = wordFrame("pushup", "can", 80);
  const three = wordFrame("pushup", "three", 110);
  const four = wordFrame("pushup", "four", 150);
  const down = prog(frame, floor - 6, floor + 10);
  const bob = frame > floor + 10 ? (1 - Math.cos((frame - floor - 10) / 7)) / 2 : 0;
  const pose = mix(mix(POSES.stand, POSES.pushup, down), POSES.pushdown, bob * down);
  const strike = prog(frame, cant, cant + 10);
  const swap4 = fadeIn(frame, four - 20, 6);
  return (
    <>
      <Title lines={[{ text: "Floor." }, { text: "Right now.", color: C.gold }]} size={124} at={0} />
      <div style={{ position: "absolute", top: 520, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 60 }}>
        <div style={{ position: "relative", fontFamily: display, fontSize: 300, lineHeight: 1, color: C.ink, opacity: fadeIn(frame, ten - 4) * (1 - strike * 0.6) }}>
          10
          <Strike w={300} p={strike} />
        </div>
        <div style={{ fontFamily: display, fontSize: 380, lineHeight: 1, color: C.gold, opacity: (1 - swap4 * 0.5), transform: `scale(${pop(frame, three, fps, 9)})` }}>3</div>
      </div>
      <div style={{ position: "absolute", top: 930, width: "100%", textAlign: "center", fontFamily: display, fontSize: 110, color: C.gold, opacity: swap4, transform: `scale(${0.8 + 0.2 * pop(frame, four - 20, fps)})` }}>
        TOMORROW: 4
      </div>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.steel} strokeWidth={6} />
        <Figure pose={pose} x={560} ground={1328} scale={1.15} color={frame > three ? C.gold : C.bone} back={frame > three ? C.goldDark : C.boneDark} />
      </Stage>
      <Sfx at={cant} name="whoosh" volume={0.3} />
      <Sfx at={three} name="impact" volume={0.5} />
      <Sfx at={four - 20} name="check" volume={0.4} />
    </>
  );
};

/* ---------- 6. HABITS: walk, sleep, cut junk ---------- */
export const HabitsScene: React.FC<SP> = () => {
  const { frame } = useF();
  const walk = wordFrame("habits", "walk", 5);
  const sleep = wordFrame("habits", "sleep", 60);
  const cut = wordFrame("habits", "cut", 120);
  const numb = wordFrame("habits", "numb", 150);
  return (
    <>
      <Title lines={[{ text: "Every day.", color: C.gold }]} size={150} at={0} />
      <Row top={500} at={walk + 8} icon={<ShoeIcon size={170} />} label="Walk 20 min" sub="EVERY SINGLE DAY" done={prog(frame, walk + 20, walk + 30)} />
      <Row top={790} at={sleep + 8} icon={<MoonIcon size={160} />} label="Same bedtime" sub="EVERY NIGHT" done={prog(frame, sleep + 20, sleep + 30)} />
      <Row
        top={1080}
        at={cut + 8}
        icon={
          <div style={{ position: "relative" }}>
            <JunkIcon size={170} />
            <div style={{ position: "absolute", top: 0, left: 0 }}>
              <XMark size={170} p={prog(frame, numb, numb + 10)} />
            </div>
          </div>
        }
        label="Cut the junk"
        sub="KEEPS YOU NUMB"
        done={prog(frame, numb + 4, numb + 14)}
      />
    </>
  );
};

/* ---------- 7. STRENGTH: comes back faster ---------- */
export const StrengthScene: React.FC<SP> = ({ duration }) => {
  const { frame, fps } = useF();
  const chips = [
    { w: "rep", f: 70, label: "Rep" },
    { w: "walk", f: 85, label: "Walk" },
    { w: "early", f: 100, label: "Early night" },
  ].map((c) => ({ ...c, at: wordFrame("strength", c.w, c.f) }));
  const finished = wordFrame("strength", "finished", 140);
  const fill = interpolate(frame, [0, duration - 10], [0.08, 1], { ...clamp });
  const fist = prog(frame, finished - 4, finished + 10);
  return (
    <>
      <Title lines={[{ text: "It comes back" }, { text: "faster.", color: C.gold }]} size={118} at={0} />
      <div style={{ position: "absolute", top: 500, left: 90, width: 900 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: display, fontSize: 64, color: C.ink }}>
          <span>STRENGTH</span>
          <span style={{ color: C.gold }}>{Math.round(fill * 100)}%</span>
        </div>
        <div style={{ marginTop: 12, height: 64, borderRadius: 32, background: C.steel, overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.goldDark}, ${C.gold})` }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 690, width: "100%", display: "flex", justifyContent: "center", gap: 24 }}>
        {chips.map((c) => {
          const s = pop(frame, c.at - 4, fps, 12);
          return (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 999, border: `4px solid ${C.gold}`, background: "rgba(232,176,75,0.12)", transform: `scale(${s})` }}>
              <CheckMark size={56} p={Math.min(1, s)} />
              <span style={{ fontFamily: display, fontSize: 56, color: C.ink, textTransform: "uppercase" }}>{c.label}</span>
              <Sfx at={c.at - 4} name="check" volume={0.35} />
            </div>
          );
        })}
      </div>
      <Big top={830} size={120} color={C.gold} s={pop(frame, finished - 4, fps)}>
        Not finished.
      </Big>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.gold} strokeWidth={6} opacity={0.7} />
        <Figure pose={mix(POSES.stand, POSES.fist, fist)} x={540} ground={1328} scale={0.66} color={C.gold} back={C.goldDark} glow={fist > 0.5 ? "rgba(240,138,60,0.6)" : undefined} />
      </Stage>
      <Sfx at={finished} name="impact" volume={0.5} />
    </>
  );
};

/* ---------- 8. OUTRO: strong body, strong mind. start today ---------- */
export const OutroScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const mind = wordFrame("outro", "mind", 40);
  const never = wordFrame("outro", "never", 70);
  const start = wordFrame("outro", "start", 110);
  const go = fadeIn(frame, start - 4, 6);
  return (
    <>
      <Title lines={[{ text: "Strong body." }, { text: "Strong mind.", color: C.gold }]} size={118} at={0} />
      <Stage>
        <line x1={40} y1={1000} x2={500} y2={1000} stroke={C.gold} strokeWidth={6} opacity={0.7} />
        <Figure pose={POSES.fist} x={260} ground={998} scale={0.95} color={C.gold} back={C.goldDark} glow="rgba(240,138,60,0.6)" />
        <Arrow x1={440} x2={590} y={760} p={prog(frame, 10, mind)} />
      </Stage>
      <div style={{ position: "absolute", top: 540, left: 620 }}>
        <MindIcon size={380} on={prog(frame, mind - 4, mind + 10)} />
      </div>
      <div style={{ opacity: 1 - go }}>
        <Big top={1080} size={120} color={C.ink} s={pop(frame, never - 4, fps)}>
          Never stays down.
        </Big>
      </div>
      <div style={{ opacity: go }}>
        <Big top={1060} size={190} color={C.gold} s={pop(frame, start - 4, fps, 10)} spacing={4}>
          Start today.
        </Big>
      </div>
      <Sfx at={start - 28} name="rise" volume={0.45} />
      <Sfx at={start} name="impact" volume={0.7} />
    </>
  );
};
