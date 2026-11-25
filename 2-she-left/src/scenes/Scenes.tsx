import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, prog, wordFrame } from "../anim";
import { Figure, mix, POSES } from "../components/Figure";
import {
  BriefcaseIcon,
  BubbleIcon,
  CarIcon,
  CheckMark,
  DumbbellIcon,
  HeartIcon,
  Hourglass,
  MoneyIcon,
  PeaceIcon,
  PhoneIcon,
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

/** Teks dengan coretan merah */
const Struck: React.FC<{ top: number; size: number; s: number; strike: number; children: string; color?: string }> = ({ top, size, s, strike, children, color = C.ink }) => (
  <div style={{ position: "absolute", top, width: "100%", display: "flex", justifyContent: "center", opacity: Math.min(1, s * 1.5) * (1 - strike * 0.45), transform: `scale(${0.7 + 0.3 * s})` }}>
    <div style={{ position: "relative", fontFamily: display, fontSize: size, lineHeight: 1, color, textTransform: "uppercase" }}>
      {children}
      <Strike w={(children.replace(/ /g, "").length * 0.45 + (children.split(" ").length - 1) * 0.22) * size} p={strike} />
    </div>
  </div>
);

/* ---------- 1. HOOK: she left when ... ---------- */
export const HookScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const left = wordFrame("hook", "left", 8);
  const money = wordFrame("hook", "money", 30);
  const car = wordFrame("hook", "car", 70);
  const pictures = wordFrame("hook", "pictures", 140);
  const gone = prog(frame, left + 4, left + 22);
  const drain = prog(frame, money + 4, money + 30);
  const carGone = prog(frame, car + 10, car + 24);
  const crack = prog(frame, pictures, pictures + 12);
  const frameIn = pop(frame, 0, fps, 14);
  return (
    <>
      <Title lines={[{ text: "She left.", color: C.red }]} size={150} at={left - 4} />
      <Stage>
        <g opacity={Math.min(1, frameIn * 1.4)} transform={`translate(540 740) scale(${0.85 + 0.15 * frameIn}) translate(-540 -740)`} style={{ filter: `grayscale(${crack})` }}>
          <rect x={190} y={500} width={700} height={470} rx={10} fill="#E9DFC8" />
          <rect x={220} y={530} width={640} height={400} fill="#3B3226" />
          <circle cx={760} cy={600} r={40} fill={C.dawn} opacity={0.8} />
          <Figure pose={{ ...POSES.stand, armF: [40, 30] }} x={460} ground={930} scale={0.72} color={C.bone} back={C.boneDark} />
          <Figure pose={{ ...POSES.stand, armF: [-30, -20] }} x={640} ground={930} scale={0.66} flip hair color="#E7B7A6" back="#B9867A" opacity={1 - gone} />
          <path d="M220 640 L420 700 L380 760 L620 820 L560 880 L860 930" fill="none" stroke={C.red} strokeWidth={7} strokeDasharray={900} strokeDashoffset={900 * (1 - crack)} />
        </g>
      </Stage>
      <div style={{ position: "absolute", top: 1030, left: 70, width: 940, display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: fadeIn(frame, money - 6), filter: `grayscale(${drain})` }}>
          <MoneyIcon size={190} />
          <div style={{ width: 360, height: 34, borderRadius: 17, background: C.steel, overflow: "hidden" }}>
            <div style={{ width: `${100 * (1 - drain * 0.97)}%`, height: "100%", background: drain > 0.6 ? C.red : C.gold }} />
          </div>
        </div>
        <div style={{ width: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: fadeIn(frame, car - 6) * (1 - carGone * 0.6) }}>
          <CarIcon size={190} />
          <div style={{ fontFamily: display, fontSize: 64, color: C.red, opacity: carGone, transform: `rotate(-6deg) scale(${0.6 + 0.4 * carGone})`, border: `5px solid ${C.red}`, borderRadius: 14, padding: "0 22px" }}>
            GONE
          </div>
        </div>
      </div>
      <Sfx at={left + 4} name="whoosh" volume={0.35} />
      <Sfx at={car + 10} name="impact" volume={0.4} />
      <Sfx at={pictures} name="impact" volume={0.45} />
    </>
  );
};

/* ---------- 2. HURTS: loss -> lesson ---------- */
export const HurtsScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const know = wordFrame("hurts", "know", 25);
  const loss = wordFrame("hurts", "loss", 75);
  const lesson = wordFrame("hurts", "lesson", 110);
  const arrow = prog(frame, lesson - 6, lesson + 6);
  return (
    <>
      <Title lines={[{ text: "It hurts." }]} size={150} at={0} />
      <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 52, letterSpacing: 8, color: C.dim, opacity: fadeIn(frame, know) }}>I KNOW.</div>
      <Struck top={580} size={250} s={pop(frame, loss - 4, fps)} strike={prog(frame, lesson - 4, lesson + 8)}>
        Loss
      </Struck>
      <Stage>
        <g opacity={arrow}>
          <line x1={540} y1={880} x2={540} y2={880 + 110 * arrow} stroke={C.gold} strokeWidth={16} strokeLinecap="round" />
          <path d={`M500 ${960 + 30 * arrow} L540 ${1010 + 30 * arrow} L580 ${960 + 30 * arrow} Z`} fill={C.gold} />
        </g>
      </Stage>
      <Big top={1070} size={250} color={C.gold} s={pop(frame, lesson, fps, 10)} spacing={3}>
        Lesson
      </Big>
      <Sfx at={loss} name="impact" volume={0.35} />
      <Sfx at={lesson} name="impact" volume={0.55} />
    </>
  );
};

/* ---------- 3. LIFE: the life vs the man ---------- */
export const LifeScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const life = wordFrame("life", "life", 25);
  const man = wordFrame("life", "man", 70);
  const diff = wordFrame("life", "difference", 140);
  const sL = pop(frame, life - 6, fps);
  const sM = pop(frame, man - 6, fps);
  const notP = prog(frame, man + 4, man + 14);
  const swap = fadeIn(frame, diff - 6, 6);
  const card = (lit: boolean): React.CSSProperties => ({
    position: "relative",
    width: 450,
    height: 760,
    borderRadius: 32,
    background: "rgba(43,43,49,0.7)",
    border: `5px solid ${lit ? C.gold : C.steel}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 30,
  });
  const label: React.CSSProperties = { fontFamily: display, fontSize: 84, color: C.ink, textTransform: "uppercase" };
  return (
    <>
      <div style={{ opacity: 1 - swap }}>
        <Title lines={[{ text: "What they" }, { text: "really loved", color: C.gold }]} size={116} />
      </div>
      <div style={{ opacity: swap }}>
        <Title lines={[{ text: "Now you" }, { text: "know.", color: C.gold }]} size={124} at={diff - 6} />
      </div>
      <div style={{ position: "absolute", top: 540, left: 60, width: 960, display: "flex", justifyContent: "space-between" }}>
        <div style={{ ...card(sL > 0.5), transform: `scale(${0.9 + 0.1 * sL})`, opacity: 0.3 + 0.7 * Math.min(1, sL) }}>
          <div style={label}>The life</div>
          <div style={{ marginTop: 40 }}>
            <MoneyIcon size={220} />
          </div>
          <div style={{ marginTop: 40 }}>
            <CarIcon size={220} />
          </div>
          <div style={{ position: "absolute", top: -50, right: -30, transform: `scale(${sL}) rotate(12deg)` }}>
            <HeartIcon size={130} />
          </div>
        </div>
        <div style={{ ...card(false), transform: `scale(${0.9 + 0.1 * sM})`, opacity: (0.3 + 0.7 * Math.min(1, sM)) * (1 - notP * 0.35) }}>
          <div style={label}>The man</div>
          <svg width={450} height={600} style={{ position: "absolute", top: 140, left: 0 }}>
            <Figure pose={POSES.stand} x={225} ground={590} scale={1.05} />
          </svg>
          <div style={{ position: "absolute", top: 300, width: "100%", display: "flex", justifyContent: "center", opacity: notP, transform: `rotate(-10deg) scale(${0.6 + 0.4 * notP})` }}>
            <div style={{ fontFamily: display, fontSize: 110, color: C.red, border: `7px solid ${C.red}`, borderRadius: 18, padding: "0 30px", background: "rgba(11,11,13,0.75)" }}>NOT</div>
          </div>
        </div>
      </div>
      <Sfx at={life - 6} name="whoosh" volume={0.3} />
      <Sfx at={man + 4} name="impact" volume={0.45} />
    </>
  );
};

/* ---------- 4. STOP: checking stories / rehearsing ---------- */
export const StopScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const checking = wordFrame("stop", "checking", 10);
  const stories = wordFrame("stop", "stories", 30);
  const stop2 = wordFrame("stop", "stop", 55, 1);
  const back = wordFrame("stop", "back", 120);
  const rows = [
    { at: checking - 8, x: stories + 6, label: ["Checking", "her stories"], Icon: () => <PhoneIcon size={330} rings={0.5 + 0.5 * Math.sin(frame / 4)} /> },
    { at: stop2, x: back + 2, label: ["Rehearsing", "what to say"], Icon: () => <BubbleIcon size={330} t={frame} /> },
  ];
  return (
    <>
      <Title lines={[{ text: "Stop.", color: C.red }]} size={170} at={0} />
      {rows.map((r, i) => {
        const s = pop(frame, r.at, fps, 13);
        const xp = prog(frame, r.x, r.x + 12);
        return (
          <div key={i} style={{ position: "absolute", top: 500 + i * 430, left: 60, width: 960, height: 400, display: "flex", alignItems: "center", gap: 30, opacity: Math.min(1, s * 1.5) * (1 - xp * 0.3), transform: `translateX(${(1 - s) * (i ? 140 : -140)}px)` }}>
            <div style={{ position: "relative", width: 340, height: 340 }}>
              <r.Icon />
              <div style={{ position: "absolute", top: 40, left: 40 }}>
                <XMark size={260} p={xp} />
              </div>
            </div>
            <div style={{ fontFamily: display, fontSize: 96, lineHeight: 1.05, color: C.ink, textTransform: "uppercase" }}>
              {r.label[0]}
              <br />
              <span style={{ color: C.dim }}>{r.label[1]}</span>
            </div>
            <Sfx at={r.x} name="impact" volume={0.4} />
          </div>
        );
      })}
    </>
  );
};

/* ---------- 5. MINUTE: time stolen ---------- */
export const MinuteScene: React.FC<SP> = ({ duration }) => {
  const { frame } = useF();
  const walked = wordFrame("minute", "walked", 50);
  const stolen = wordFrame("minute", "stolen", 110);
  const become = wordFrame("minute", "become", 160);
  const sand = interpolate(frame, [0, duration - 10], [0, 1], clamp);
  const walk = prog(frame, walked - 6, walked + 50);
  const step = Math.sin(frame / 5);
  const flicker = frame > stolen && frame < stolen + 20 ? 0.3 + 0.2 * Math.sin(frame * 2) : 1;
  const future = fadeIn(frame, become - 4, 14);
  return (
    <>
      <Title lines={[{ text: "Every" }, { text: "minute.", color: C.gold }]} size={124} />
      <div style={{ position: "absolute", top: 500, width: "100%", display: "flex", justifyContent: "center" }}>
        <Hourglass size={360} p={sand} />
      </div>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.steel} strokeWidth={6} />
        <Figure
          pose={mix(POSES.stand, { ...POSES.walk, armB: [-26 * step, 12], armF: [26 * step, 14], legB: [-20 * step, 8], legF: [22 * step, -4] }, Math.min(1, walk * 4))}
          x={300 - walk * 220}
          ground={1328}
          scale={0.8}
          flip
          hair
          color={C.ash}
          back={C.steel}
          opacity={1 - walk * 0.7}
        />
        <Figure pose={POSES.stand} x={800} ground={1328} scale={0.95} color={C.gold} back={C.goldDark} opacity={(0.25 + 0.75 * future) * flicker} glow={future > 0.5 ? "rgba(232,176,75,0.5)" : undefined} />
      </Stage>
      <div style={{ position: "absolute", top: 1350, left: 0, width: 1080, display: "flex", justifyContent: "space-between", padding: "0 80px", fontFamily: body, fontWeight: 700, fontSize: 34, letterSpacing: 4 }}>
        <span style={{ color: C.ash, opacity: fadeIn(frame, walked) }}>WALKED AWAY</span>
        <span style={{ color: C.gold, opacity: future }}>WHO YOU'RE BECOMING</span>
      </div>
      <Sfx at={2} name="tick" volume={0.35} />
      <Sfx at={stolen} name="impact" volume={0.4} />
    </>
  );
};

/* ---------- 6. ENERGY: body, work, peace ---------- */
export const EnergyScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const rows = [
    { Icon: DumbbellIcon, label: "Your body", w: "body", f: 30 },
    { Icon: BriefcaseIcon, label: "Your work", w: "work", f: 70 },
    { Icon: PeaceIcon, label: "Your peace", w: "peace", f: 110 },
  ].map((r) => ({ ...r, at: wordFrame("energy", r.w, r.f) }));
  return (
    <>
      <Title lines={[{ text: "Redirect it.", color: C.gold }]} size={140} />
      <div style={{ position: "absolute", top: 500, left: 70, width: 940, display: "flex", flexDirection: "column", gap: 34 }}>
        {rows.map((r, i) => {
          const s = pop(frame, r.at - 10, fps, 13);
          const c = prog(frame, r.at, r.at + 10);
          return (
            <div
              key={i}
              style={{
                height: 250,
                display: "flex",
                alignItems: "center",
                gap: 40,
                padding: "0 40px",
                borderRadius: 30,
                background: c > 0.5 ? "rgba(232,176,75,0.12)" : "rgba(43,43,49,0.75)",
                border: `4px solid ${c > 0.5 ? C.gold : C.steel}`,
                opacity: Math.min(1, s * 1.4),
                transform: `translateX(${(1 - s) * 140}px)`,
              }}
            >
              <r.Icon size={170} />
              <div style={{ flex: 1, fontFamily: display, fontSize: 104, color: C.ink, textTransform: "uppercase" }}>{r.label}</div>
              <CheckMark size={110} p={c} />
              <Sfx at={r.at} name="check" volume={0.45} />
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- 7. REALIZE: lost everything -> got yourself back ---------- */
export const RealizeScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const lost = wordFrame("realize", "lost", 70);
  const got = wordFrame("realize", "got", 160);
  const back = wordFrame("realize", "back", 180);
  const rise = interpolate(frame, [got - 20, back + 6], [0, 1], clamp);
  const pose = rise < 0.5 ? mix(POSES.slump, POSES.kneel, rise * 2) : mix(POSES.kneel, POSES.stand, (rise - 0.5) * 2);
  const gold = rise > 0.8;
  return (
    <>
      <Title lines={[{ text: "One day" }, { text: "you'll realize", color: C.dim }]} size={110} />
      <Struck top={540} size={130} s={pop(frame, lost - 4, fps)} strike={prog(frame, got - 4, got + 10)}>
        Lost everything
      </Struck>
      <Big top={700} size={120} color={C.gold} s={pop(frame, got, fps)}>
        Got yourself back
      </Big>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={gold ? C.gold : C.steel} strokeWidth={6} />
        <Figure pose={pose} x={500} ground={1328} scale={0.95} color={gold ? C.gold : C.bone} back={gold ? C.goldDark : C.boneDark} glow={gold ? "rgba(240,138,60,0.6)" : undefined} />
      </Stage>
      <Sfx at={got - 24} name="rise" volume={0.4} />
      <Sfx at={got} name="impact" volume={0.5} />
    </>
  );
};

/* ---------- 8. REBUILD: body, bank, life ---------- */
export const RebuildScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const slabs = [
    { w: "body", f: 30, label: "Body", Icon: DumbbellIcon },
    { w: "bank", f: 60, label: "Bank account", Icon: () => <MoneyIcon size={130} /> },
    { w: "life", f: 100, label: "A life", Icon: PeaceIcon },
  ].map((s) => ({ ...s, at: wordFrame("rebuild", s.w, s.f) }));
  const you = wordFrame("rebuild", "you", 150, 2); // "your", "your", lalu "you"
  const her = wordFrame("rebuild", "her", 175);
  return (
    <>
      <Title lines={[{ text: "Don't beg.", color: C.red }]} size={150} at={0} />
      <Big top={450} size={130} color={C.gold} s={pop(frame, you - 4, fps)}>
        For you.
      </Big>
      <div style={{ position: "absolute", top: 600, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 52, letterSpacing: 8, color: C.dim, opacity: fadeIn(frame, her - 4) }}>
        NOT FOR HER
      </div>
      {slabs.map((s, i) => {
        const p = prog(frame, s.at - 8, s.at + 4);
        const top = 1130 - i * 215;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: top - (1 - p) * 500,
              left: 110 + i * 20,
              width: 860 - i * 40,
              height: 200,
              borderRadius: 18,
              background: `linear-gradient(180deg, ${C.gold}, ${C.goldDark})`,
              boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 40px",
              opacity: p,
            }}
          >
            <div style={{ width: 130, height: 130, borderRadius: 24, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <s.Icon size={110} />
            </div>
            <div style={{ fontFamily: display, fontSize: 96, color: C.bg, textTransform: "uppercase" }}>{s.label}</div>
            <Sfx at={s.at + 2} name="check" volume={0.25} />
          </div>
        );
      })}
      <Stage>
        <line x1={40} y1={1334} x2={1040} y2={1334} stroke={C.gold} strokeWidth={8} opacity={0.8} />
      </Stage>
      <Sfx at={you - 4} name="check" volume={0.4} />
    </>
  );
};

/* ---------- 9. OUTRO: don't beg. build. ---------- */
export const OutroScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const beg = wordFrame("outro", "beg", 10);
  const build = wordFrame("outro", "build", 30);
  const rows = 6;
  const cols = 5;
  const bw = 124;
  const bh = 62;
  return (
    <>
      <Big top={260} size={170} color={C.red} s={pop(frame, beg - 8, fps)}>
        Don't beg.
      </Big>
      <Big top={470} size={300} color={C.gold} s={pop(frame, build, fps, 10)} spacing={4}>
        Build.
      </Big>
      <Stage>
        <line x1={0} y1={1330} x2={1080} y2={1330} stroke={C.gold} strokeWidth={8} opacity={0.8} />
        {Array.from({ length: rows * cols }).map((_, k) => {
          const r = Math.floor(k / cols);
          const c = k % cols;
          const at = build - 4 + k * 2;
          const s = prog(frame, at, at + 6);
          const x = 390 + c * (bw + 6) + (r % 2 ? bw / 2 : 0);
          const y = 1330 - (r + 1) * (bh + 6);
          if (r % 2 && c === cols - 1) return null;
          return (
            <rect
              key={k}
              x={x}
              y={y - (1 - s) * 60}
              width={bw}
              height={bh}
              rx={6}
              fill={(r + c) % 3 === 0 ? C.goldDark : C.gold}
              opacity={s}
            />
          );
        })}
        <Figure pose={POSES.fist} x={210} ground={1328} scale={1.0} color={C.gold} back={C.goldDark} glow="rgba(240,138,60,0.7)" opacity={fadeIn(frame, build - 6)} />
        <Figure pose={POSES.slump} x={210} ground={1328} scale={1.0} opacity={1 - fadeIn(frame, build - 6)} />
      </Stage>
      <Sfx at={build} name="check" volume={0.25} />
    </>
  );
};
