import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, prog, wordFrame } from "../anim";
import { Figure, mix, POSES, runPose } from "../components/Figure";
import { BubbleIcon, CheckMark, DropIcon, GaugeIcon, MindIcon, MoonIcon, ShoeIcon, Strike } from "../components/Icons";
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

const Swap: React.FC<{ a: React.ReactNode; b: React.ReactNode; t: number }> = ({ a, b, t }) => (
  <>
    <div style={{ opacity: 1 - t }}>{a}</div>
    <div style={{ opacity: t }}>{b}</div>
  </>
);

/* ---------- 1. LOUD: the loudest place in the world ---------- */
export const LoudScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const loudest = wordFrame("loud", "loudest", 50);
  const regret = wordFrame("loud", "regret", 95);
  const shame = wordFrame("loud", "shame", 115);
  const whatifs = wordFrame("loud", "what", 135);
  const night = wordFrame("loud", "night", 165);
  const words = [
    { t: "Regret", at: regret, top: 500, left: 50, size: 110, color: C.red },
    { t: "Shame", at: shame, top: 620, left: 740, size: 110, color: C.red },
    { t: "What if?", at: whatifs, top: 960, left: 40, size: 90, color: C.ink },
    { t: "What if?", at: whatifs + 5, top: 1060, left: 720, size: 76, color: C.dim },
    { t: "What if?", at: whatifs + 10, top: 1160, left: 330, size: 64, color: C.ash },
  ];
  const noise = frame > loudest ? 1 : 0;
  return (
    <>
      <Title lines={[{ text: "The loudest" }, { text: "place.", color: C.red }]} size={118} at={0} />
      <Stage>
        {noise > 0 &&
          [0, 1, 2].map((k) => {
            const r = 230 + k * 50 + ((frame * 4) % 50);
            return <circle key={k} cx={540} cy={780} r={r} fill="none" stroke={C.red} strokeWidth={6} opacity={0.35 - k * 0.1} />;
          })}
      </Stage>
      <div style={{ position: "absolute", top: 570, left: 330, transform: `translate(${Math.sin(frame * 1.3) * (noise * 4)}px, 0)`, opacity: fadeIn(frame, 2) }}>
        <MindIcon size={420} on={0} />
      </div>
      {words.map((w, i) => {
        const s = pop(frame, w.at - 2, fps, 11);
        return (
          <div key={i} style={{ position: "absolute", top: w.top, left: w.left, fontFamily: display, fontSize: w.size, color: w.color, textTransform: "uppercase", transform: `scale(${s}) rotate(${(i % 2 ? 4 : -5) + Math.sin(frame / 3 + i) * 2}deg)`, opacity: Math.min(1, s * 1.5), textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>
            {w.t}
            <Sfx at={w.at - 2} name="impact" volume={0.25} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1290, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: fadeIn(frame, night - 6) }}>
        <MoonIcon size={90} />
        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: C.dim }}>ALL NIGHT LONG</span>
      </div>
    </>
  );
};

/* ---------- 2. QUIET: sweat is quieter ---------- */
export const QuietScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const loud = wordFrame("quiet", "loud", 50);
  const sweat = wordFrame("quiet", "sweat", 70);
  const quieter = wordFrame("quiet", "quieter", 85);
  const calm = prog(frame, quieter - 4, quieter + 20);
  const amp = (1 - calm) * 150 + 12;
  const pts = Array.from({ length: 60 }).map((_, i) => {
    const x = 40 + i * 17;
    const jag = Math.sin(i * 2.3 + frame * 0.9) * Math.cos(i * 0.7 + frame * 0.4);
    const smooth = Math.sin(i / 6 + frame / 10);
    return `${x},${1000 + (jag * (1 - calm) + smooth * calm) * amp}`;
  });
  return (
    <>
      <Swap a={<Title lines={[{ text: "Thoughts" }, { text: "are loud.", color: C.red }]} size={124} at={loud - 30} />} b={<Title lines={[{ text: "Sweat is" }, { text: "quieter.", color: C.gold }]} size={124} at={sweat - 4} />} t={fadeIn(frame, sweat - 4, 6)} />
      <div style={{ position: "absolute", top: 500, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${pop(frame, sweat - 4, fps)}) translateY(${Math.sin(frame / 8) * 8}px)` }}>
        <DropIcon size={280} />
      </div>
      <Stage>
        <polyline points={pts.join(" ")} fill="none" stroke={calm > 0.5 ? C.gold : C.red} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
      </Stage>
      <div style={{ position: "absolute", top: 1220, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 48, letterSpacing: 10, color: calm > 0.5 ? C.gold : C.dim }}>{calm > 0.5 ? "QUIET" : "NOISE"}</div>
      <Sfx at={quieter} name="check" volume={0.4} />
    </>
  );
};

/* ---------- 3. RUN: no room for overthinking ---------- */
export const RunScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const run = wordFrame("run", "run", 10);
  const burn = wordFrame("run", "burn", 50);
  const over = wordFrame("run", "overthinking", 90);
  const going = fadeIn(frame, run - 6, 10);
  const pose = mix(POSES.stand, runPose(frame / 3.2), going);
  const heat = prog(frame, burn - 4, burn + 14);
  return (
    <>
      <Title lines={[{ text: "Run." }, { text: "Till it burns.", color: C.dawn }]} size={124} at={0} />
      <Big top={560} size={84} color={C.dim} s={pop(frame, over - 30, fps)}>
        No room for
      </Big>
      <Big top={660} size={120} color={C.gold} s={pop(frame, over - 4, fps)}>
        Overthinking
      </Big>
      <Stage>
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 860 + (i * 47) % 440;
          const x = 1100 - ((frame * 26 + i * 173) % 1300);
          return <line key={i} x1={x} y1={y} x2={x + 140} y2={y} stroke={C.ash} strokeWidth={5} strokeLinecap="round" opacity={0.5 * going} />;
        })}
        <line x1={0} y1={1330} x2={1080} y2={1330} stroke={C.steel} strokeWidth={6} />
        <Figure pose={pose} x={640} ground={1328} scale={1.1} color={heat > 0.5 ? C.gold : C.bone} back={heat > 0.5 ? C.goldDark : C.boneDark} glow={heat > 0 ? `rgba(240,138,60,${0.7 * heat})` : undefined} />
      </Stage>
      {[0, 1, 2].map((k) => {
        const x = 300 - ((frame - run) * 6 + k * 160);
        return (
          <div key={k} style={{ position: "absolute", top: 860 + k * 70, left: x, opacity: Math.max(0, 0.8 - (frame - run) / 90) * going }}>
            <BubbleIcon size={150} color={C.ash} t={frame} />
          </div>
        );
      })}
      <Sfx at={run} name="whoosh" volume={0.35} />
      <Sfx at={over} name="impact" volume={0.4} />
    </>
  );
};

/* ---------- 4. REP: present, fighting ---------- */
export const RepScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const her = wordFrame("rep", "her", 45);
  const moneyW = wordFrame("rep", "money", 60);
  const people = wordFrame("rep", "people", 80);
  const present = wordFrame("rep", "present", 130);
  const fighting = wordFrame("rep", "fighting", 150);
  const press = (1 - Math.cos(frame / 9)) / 2;
  const gone = prog(frame, present - 10, present);
  const gold = frame > present;
  const thoughts = [
    { t: "Her", at: her },
    { t: "The money", at: moneyW },
    { t: "What people say", at: people },
  ];
  return (
    <>
      <Title lines={[{ text: "Last rep.", color: C.gold }]} size={150} at={0} />
      <div style={{ position: "absolute", top: 480, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: 1 - gone }}>
        {thoughts.map((th) => {
          const s = pop(frame, th.at - 4, fps, 12);
          const st = prog(frame, th.at + 6, th.at + 14);
          return (
            <div key={th.t} style={{ position: "relative", fontFamily: display, fontSize: 86, color: C.dim, textTransform: "uppercase", transform: `scale(${s})`, opacity: 1 - st * 0.5 }}>
              {th.t}
              <Strike w={th.t.length * 40} p={st} />
            </div>
          );
        })}
      </div>
      <Big top={500} size={150} color={C.gold} s={pop(frame, present - 4, fps)}>
        Present.
      </Big>
      <Big top={670} size={150} color={C.red} s={pop(frame, fighting - 4, fps)}>
        Fighting.
      </Big>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={gold ? C.gold : C.steel} strokeWidth={6} />
        <Figure pose={mix(POSES.holdLow, POSES.holdHigh, press)} x={500} ground={1328} scale={0.92} plate color={gold ? C.gold : C.bone} back={gold ? C.goldDark : C.boneDark} glow={gold ? "rgba(240,138,60,0.5)" : undefined} />
      </Stage>
      <Sfx at={present} name="impact" volume={0.45} />
      <Sfx at={fighting} name="impact" volume={0.5} />
    </>
  );
};

/* ---------- 5. CLARITY ---------- */
export const ClarityScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const fix = wordFrame("clarity", "fix", 20);
  const clarity = wordFrame("clarity", "clarity", 70);
  const moves = wordFrame("clarity", "moves", 140);
  const clear = prog(frame, clarity - 4, clarity + 16);
  const probs = ["The debt", "The breakup", "The next move"];
  return (
    <>
      <Swap a={<Title lines={[{ text: "It won't" }, { text: "fix it.", color: C.dim }]} size={124} at={fix - 10} />} b={<Title lines={[{ text: "Clarity.", color: C.gold }]} size={150} at={clarity - 4} />} t={fadeIn(frame, clarity - 4, 6)} />
      {probs.map((p, i) => {
        const s = pop(frame, 4 + i * 6, fps, 13);
        const ok = prog(frame, moves - 10 + i * 6, moves + i * 6);
        return (
          <div key={p} style={{ position: "absolute", top: 510 + i * 270, left: 90, width: 900, height: 230, borderRadius: 30, background: ok > 0.5 ? "rgba(232,176,75,0.12)" : "rgba(43,43,49,0.8)", border: `4px solid ${ok > 0.5 ? C.gold : C.steel}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px", transform: `scale(${0.9 + 0.1 * s})`, opacity: Math.min(1, s * 1.4) }}>
            <span style={{ fontFamily: display, fontSize: 104, color: C.ink, textTransform: "uppercase", filter: `blur(${(1 - clear) * 14}px)` }}>{p}</span>
            <CheckMark size={110} p={ok} />
          </div>
        );
      })}
      <Sfx at={clarity} name="whoosh" volume={0.35} />
      <Sfx at={moves} name="check" volume={0.4} />
    </>
  );
};

/* ---------- 6. WAIT: lace up anyway ---------- */
export const WaitScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const feel = wordFrame("wait", "feel", 30);
  const wont = wordFrame("wait", "won", 60);
  const lace = wordFrame("wait", "lace", 85);
  const needle = 0.12 + Math.sin(frame / 5) * 0.03 + prog(frame, feel - 4, feel + 10) * 0.12 - prog(frame, wont - 4, wont + 8) * 0.12;
  const s = pop(frame, lace - 4, fps);
  return (
    <>
      <Title lines={[{ text: "Don't wait." }]} size={150} at={0} />
      <div style={{ position: "absolute", top: 380, width: "100%", display: "flex", justifyContent: "center" }}>
        <GaugeIcon size={520} v={needle} />
      </div>
      <div style={{ position: "absolute", top: 830, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 44, letterSpacing: 10, color: C.dim, opacity: fadeIn(frame, feel - 6) }}>MOOD</div>
      <Big top={900} size={110} color={C.red} s={pop(frame, wont - 4, fps)}>
        You won't.
      </Big>
      <div style={{ position: "absolute", top: 1030, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: Math.min(1, s * 1.5), transform: `scale(${0.7 + 0.3 * s})` }}>
        <ShoeIcon size={240} />
        <div style={{ fontFamily: display, fontSize: 110, lineHeight: 1, color: C.gold, textTransform: "uppercase" }}>
          Lace up
          <br />
          anyway.
        </div>
      </div>
      <Sfx at={wont} name="impact" volume={0.4} />
      <Sfx at={lace} name="check" volume={0.45} />
    </>
  );
};

/* ---------- 7. DAILY: 30 minutes ---------- */
export const DailyScene: React.FC<SP> = ({ duration }) => {
  const { frame, fps } = useF();
  const every = wordFrame("daily", "every", 25);
  const excuses = wordFrame("daily", "excuses", 55);
  const chips = [
    { t: "Walk", at: wordFrame("daily", "walk", 75) },
    { t: "Run", at: wordFrame("daily", "run", 85) },
    { t: "Lift", at: wordFrame("daily", "lift", 95) },
  ];
  const whatever = wordFrame("daily", "whatever", 110);
  const left = Math.max(0, Math.round(interpolate(frame, [0, duration], [30 * 60, 0], clamp)));
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const mm = pad(Math.floor(left / 60));
  const ss = pad(left % 60);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <>
      <Title lines={[{ text: "Every" }, { text: "single day.", color: C.gold }]} size={124} at={every - 10} />
      <div style={{ position: "absolute", top: 530, width: "100%", textAlign: "center", fontFamily: display, fontSize: 190, lineHeight: 1, color: C.ink, letterSpacing: 6 }}>
        {mm}:{ss}
      </div>
      <div style={{ position: "absolute", top: 760, width: "100%", display: "flex", justifyContent: "center", gap: 16 }}>
        {days.map((d, i) => {
          const c = prog(frame, every + i * 4, every + i * 4 + 6);
          return (
            <div key={i} style={{ width: 112, height: 112, borderRadius: 56, border: `5px solid ${c > 0.5 ? C.gold : C.steel}`, background: c > 0.5 ? C.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 56, color: c > 0.5 ? C.bg : C.dim }}>
              {d}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 900, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 46, letterSpacing: 10, color: C.red, opacity: fadeIn(frame, excuses - 4) }}>NO EXCUSES</div>
      <div style={{ position: "absolute", top: 1000, width: "100%", display: "flex", justifyContent: "center", gap: 24 }}>
        {chips.map((c) => {
          const s = pop(frame, c.at - 4, fps, 12);
          return (
            <div key={c.t} style={{ width: 290, height: 150, borderRadius: 30, border: `5px solid ${C.gold}`, background: "rgba(232,176,75,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 92, color: C.ink, textTransform: "uppercase", transform: `scale(${s})` }}>
              {c.t}
              <Sfx at={c.at - 4} name="check" volume={0.35} />
            </div>
          );
        })}
      </div>
      <Big top={1200} size={84} color={C.gold} s={pop(frame, whatever - 4, fps)}>
        Whatever you've got
      </Big>
    </>
  );
};

/* ---------- 8. OUTRO: let your body carry the weight ---------- */
export const OutroScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const carry = wordFrame("outro", "carry", 50);
  const lighter = wordFrame("outro", "lighter", 110);
  const lift = prog(frame, carry - 4, carry + 24);
  const fly = prog(frame, lighter - 2, lighter + 30);
  const pose = fly > 0 ? mix(POSES.holdHigh, POSES.fist, Math.min(1, fly * 2)) : mix(POSES.holdLow, POSES.holdHigh, lift);
  const blockBottom = interpolate(lift, [0, 1], [920, 790]) - fly * 700;
  const gold = fly > 0.2;
  return (
    <>
      <Swap
        a={<Title lines={[{ text: "Your mind" }, { text: "is heavy.", color: C.dim }]} size={124} at={0} />}
        b={<Big top={260} size={220} color={C.gold} s={pop(frame, lighter - 2, fps, 10)} spacing={4}>Lighter.</Big>}
        t={fadeIn(frame, lighter - 4, 6)}
      />
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={gold ? C.gold : C.steel} strokeWidth={6} />
        <g opacity={1 - fly}>
          <rect x={330} y={blockBottom - 230} width={420} height={230} rx={22} fill={C.steel} stroke={C.ash} strokeWidth={8} />
          <text x={540} y={blockBottom - 90} textAnchor="middle" fontFamily={display} fontSize={96} fill={C.ink}>
            THE WEIGHT
          </text>
        </g>
        {fly > 0 &&
          Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            const r = fly * 420;
            return <circle key={i} cx={540 + Math.cos(a) * r} cy={blockBottom - 115 + Math.sin(a) * r * 0.6} r={10 * (1 - fly) + 3} fill={C.gold} opacity={1 - fly} />;
          })}
        <Figure pose={pose} x={540} ground={1328} scale={1.1} color={gold ? C.gold : C.bone} back={gold ? C.goldDark : C.boneDark} glow={gold ? "rgba(240,138,60,0.7)" : undefined} />
      </Stage>
      <Sfx at={lighter} name="check" volume={0.25} />
    </>
  );
};
