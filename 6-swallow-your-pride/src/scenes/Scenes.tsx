import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, prog, wordFrame } from "../anim";
import { Figure, mix, POSES, runPose } from "../components/Figure";
import { BubbleIcon, CarIcon, CoffeeIcon, CrownIcon, HandsIcon, MindIcon, Strike, TagIcon, WrenchIcon } from "../components/Icons";
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

const Card: React.FC<{ top: number; left: number; w: number; h: number; s: number; children: React.ReactNode; border?: string; dim?: number }> = ({ top, left, w, h, s, children, border = C.steel, dim = 0 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      width: w,
      height: h,
      borderRadius: 30,
      background: "rgba(43,43,49,0.8)",
      border: `4px solid ${border}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      opacity: Math.min(1, s * 1.5) * (1 - dim * 0.5),
      transform: `scale(${0.85 + 0.15 * s})`,
    }}
  >
    {children}
  </div>
);

const label: React.CSSProperties = { fontFamily: display, fontSize: 70, color: C.ink, textTransform: "uppercase", textAlign: "center", lineHeight: 1 };

/* ---------- 1. BOSS: you used to be the boss ---------- */
export const BossScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const office = wordFrame("boss", "office", 40);
  const car = wordFrame("boss", "car", 60);
  const sir = wordFrame("boss", "sir", 95);
  return (
    <>
      <Title lines={[{ text: "You were" }, { text: "the boss.", color: C.gold }]} size={124} at={0} />
      <Card top={500} left={80} w={440} h={240} s={pop(frame, office - 6, fps)}>
        <svg width={140} height={120} viewBox="0 0 140 120">
          <rect x={10} y={10} width={120} height={100} rx={6} fill="none" stroke={C.bone} strokeWidth={8} />
          <line x1={70} y1={10} x2={70} y2={110} stroke={C.bone} strokeWidth={6} />
          <line x1={10} y1={60} x2={130} y2={60} stroke={C.bone} strokeWidth={6} />
          <rect x={20} y={70} width={14} height={34} fill={C.gold} />
          <rect x={40} y={50} width={14} height={54} fill={C.gold} opacity={0.7} />
          <rect x={90} y={30} width={14} height={74} fill={C.gold} opacity={0.8} />
        </svg>
        <div style={label}>Nice office</div>
      </Card>
      <Card top={500} left={560} w={440} h={240} s={pop(frame, car - 6, fps)}>
        <CarIcon size={130} color={C.gold} />
        <div style={label}>Nice car</div>
      </Card>
      {[0, 1].map((k) => {
        const s = pop(frame, sir - 6 + k * 6, fps, 12);
        return (
          <div key={k} style={{ position: "absolute", top: 790 + k * 20, left: k ? 640 : 110, padding: "14px 34px", borderRadius: 30, background: C.ink, fontFamily: display, fontSize: 64, color: C.bg, transform: `scale(${s}) rotate(${k ? 5 : -5}deg)` }}>
            YES, SIR.
          </div>
        );
      })}
      <Stage>
        <Figure pose={{ ...POSES.stand, armF: [30, 40] }} x={540} ground={1328} scale={1.0} color={C.bone} />
        <rect x={240} y={1150} width={600} height={180} rx={12} fill="#4A3A28" />
        <rect x={240} y={1150} width={600} height={24} rx={8} fill="#6B5236" />
        <rect x={420} y={1100} width={240} height={56} rx={8} fill={C.gold} />
        <text x={540} y={1142} textAnchor="middle" fontFamily={display} fontSize={40} fill={C.bg}>
          THE BOSS
        </text>
      </Stage>
      <Sfx at={sir - 6} name="check" volume={0.3} />
    </>
  );
};

/* ---------- 2. NOW: that's beneath me ---------- */
export const NowScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const coffee = wordFrame("now", "coffee", 40);
  const fixing = wordFrame("now", "fixing", 75);
  const pride = wordFrame("now", "pride", 115);
  const beneath = wordFrame("now", "beneath", 140);
  const dim = prog(frame, beneath, beneath + 10);
  return (
    <>
      <Title lines={[{ text: "And now?" }]} size={150} at={0} />
      <Card top={500} left={80} w={440} h={400} s={pop(frame, coffee - 6, fps)} dim={dim}>
        <CoffeeIcon size={210} />
        <div style={label}>Sell coffee</div>
      </Card>
      <Card top={500} left={560} w={440} h={400} s={pop(frame, fixing - 6, fps)} dim={dim}>
        <WrenchIcon size={210} />
        <div style={label}>Fix things</div>
      </Card>
      <div style={{ position: "absolute", top: 950, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: fadeIn(frame, pride - 6) }}>
        <CrownIcon size={200} />
        <div style={{ position: "relative", padding: "20px 36px", borderRadius: 30, background: C.red, fontFamily: display, fontSize: 76, lineHeight: 1, color: C.ink, transform: `scale(${pop(frame, beneath - 4, fps)})` }}>
          THAT'S
          <br />
          BENEATH ME.
        </div>
      </div>
      <div style={{ position: "absolute", top: 1180, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: C.dim, opacity: fadeIn(frame, pride - 6) }}>
        SAYS YOUR PRIDE
      </div>
      <Sfx at={beneath} name="impact" volume={0.35} />
    </>
  );
};

/* ---------- 3. PRIDE: most expensive thing ---------- */
export const PrideScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const pride = wordFrame("pride", "pride", 30);
  const expensive = wordFrame("pride", "expensive", 60);
  const broke = wordFrame("pride", "broke", 90);
  const swing = Math.sin(frame / 10) * 6;
  return (
    <>
      <Title lines={[{ text: "Pride is" }, { text: "expensive.", color: C.red }]} size={124} at={pride - 6} />
      <div style={{ position: "absolute", top: 500, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${pop(frame, pride - 6, fps)})` }}>
        <CrownIcon size={320} />
      </div>
      <Stage>
        <line x1={640} y1={720} x2={700} y2={830} stroke={C.bone} strokeWidth={5} opacity={fadeIn(frame, expensive - 6)} />
      </Stage>
      <div style={{ position: "absolute", top: 820, left: 470, width: 520, transformOrigin: "top center", transform: `rotate(${swing}deg) scale(${pop(frame, expensive - 6, fps)})` }}>
        <div style={{ position: "relative", height: 260, borderRadius: "20px 60px 60px 20px", background: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ position: "absolute", left: 30, top: 110, width: 36, height: 36, borderRadius: 18, background: C.bg }} />
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: C.ash }}>PRICE</div>
          <div style={{ fontFamily: display, fontSize: 96, color: C.red }}>EVERYTHING</div>
        </div>
      </div>
      <Big top={1170} size={84} color={C.dim} s={pop(frame, broke - 4, fps)}>
        A broke man can't afford it
      </Big>
      <Sfx at={expensive} name="impact" volume={0.4} />
    </>
  );
};

/* ---------- 4. SMALL: every empire started small ---------- */
export const SmallScene: React.FC<SP> = ({ duration }) => {
  const { frame, fps } = useF();
  const empire = wordFrame("small", "empire", 10);
  const comeback = wordFrame("small", "comeback", 70);
  const grow = interpolate(frame, [empire + 20, duration - 20], [0, 1], clamp);
  const towers = [
    { x: 120, w: 130, h: 420, d: 0.35 },
    { x: 270, w: 150, h: 620, d: 0.2 },
    { x: 440, w: 200, h: 760, d: 0 },
    { x: 660, w: 150, h: 560, d: 0.25 },
    { x: 830, w: 130, h: 380, d: 0.45 },
  ];
  return (
    <>
      <Title lines={[{ text: "Every empire" }, { text: "started small.", color: C.gold }]} size={112} at={0} />
      <div style={{ position: "absolute", top: 500, width: "100%", textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: C.dim, opacity: fadeIn(frame, comeback) }}>
        WITH WORK NOBODY RESPECTED
      </div>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.gold} strokeWidth={6} opacity={0.7} />
        {/* satu kotak kecil -> kota */}
        <rect x={510} y={1270} width={60} height={60} fill={C.gold} opacity={1 - grow} transform={`scale(${pop(frame, empire - 4, fps)})`} style={{ transformOrigin: "540px 1330px" }} />
        {towers.map((t, i) => {
          const g = interpolate(grow, [t.d, Math.min(1, t.d + 0.55)], [0, 1], clamp);
          const h = t.h * g;
          return (
            <g key={i}>
              <rect x={t.x} y={1330 - h} width={t.w} height={h} fill={i === 2 ? C.gold : C.goldDark} opacity={0.35 + 0.65 * g} />
              {Array.from({ length: Math.floor(h / 70) }).map((_, r) => (
                <rect key={r} x={t.x + 20} y={1330 - h + 24 + r * 70} width={t.w - 40} height={24} fill={C.bg} opacity={0.35} />
              ))}
            </g>
          );
        })}
      </Stage>
      <Sfx at={empire} name="check" volume={0.3} />
      <Sfx at={empire + 20} name="rise" volume={0.25} />
    </>
  );
};

/* ---------- 5. USE: start with what you have ---------- */
export const UseScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const rows = [
    { w: "know", f: 20, icon: <MindIcon size={150} on={1} />, t: "Use what you know" },
    { w: "sell", f: 45, icon: <TagIcon size={140} color={C.gold} />, t: "Sell what you can" },
    { w: "hands", f: 85, icon: <HandsIcon size={150} />, t: "What's in your hands" },
  ].map((r) => ({ ...r, at: wordFrame("use", r.w, r.f) }));
  const years = wordFrame("use", "years", 130);
  const st = prog(frame, years + 4, years + 14);
  return (
    <>
      <Title lines={[{ text: "Start with" }, { text: "what you have.", color: C.gold }]} size={112} at={0} />
      {rows.map((r, i) => {
        const s = pop(frame, r.at - 8, fps, 13);
        return (
          <div key={i} style={{ position: "absolute", top: 500 + i * 250, left: 70, width: 940, height: 220, borderRadius: 30, background: "rgba(43,43,49,0.8)", border: `4px solid ${C.gold}`, display: "flex", alignItems: "center", gap: 36, padding: "0 40px", opacity: Math.min(1, s * 1.4), transform: `translateX(${(1 - s) * 140}px)` }}>
            {r.icon}
            <div style={{ fontFamily: display, fontSize: 80, color: C.ink, textTransform: "uppercase", whiteSpace: "nowrap" }}>{r.t}</div>
            <Sfx at={r.at - 8} name="check" volume={0.3} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1270, width: "100%", display: "flex", justifyContent: "center", opacity: fadeIn(frame, years - 6) * (1 - st * 0.4) }}>
        <div style={{ position: "relative", fontFamily: display, fontSize: 80, color: C.dim }}>
          NOT 5 YEARS AGO
          <Strike w={560} p={st} />
        </div>
      </div>
    </>
  );
};

/* ---------- 6. TALK: let them ---------- */
export const TalkScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const yes = wordFrame("talk", "yes", 25);
  const away = wordFrame("talk", "away", 60);
  const probably = wordFrame("talk", "probably", 75);
  const letW = wordFrame("talk", "let", 100);
  const turn = frame > away;
  const walk = fadeIn(frame, 6, 10);
  return (
    <>
      <Swap a={<Title lines={[{ text: "People" }, { text: "will talk.", color: C.dim }]} size={124} at={0} />} b={<Title lines={[{ text: "Let them.", color: C.gold }]} size={160} at={letW - 4} />} t={fadeIn(frame, letW - 4, 6)} />
      <div style={{ position: "absolute", top: 520, width: "100%", display: "flex", justifyContent: "center", gap: 30 }}>
        {[
          { t: "Yes.", at: yes },
          { t: "Probably.", at: probably },
        ].map((c) => (
          <div key={c.t} style={{ fontFamily: display, fontSize: 84, color: C.red, textTransform: "uppercase", border: `5px solid ${C.red}`, borderRadius: 22, padding: "4px 30px", transform: `scale(${pop(frame, c.at - 4, fps)})` }}>
            {c.t}
          </div>
        ))}
      </div>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.steel} strokeWidth={6} />
        {[140, 270, 400].map((x, i) => (
          <Figure key={i} pose={i === 1 ? { ...POSES.stand, armF: [40, 60] } : POSES.stand} x={x} ground={1328} scale={0.62} color={C.ash} back={C.steel} flip={turn} opacity={0.85} />
        ))}
        <Figure pose={mix(POSES.stand, runPose(frame / 5), walk * 0.5)} x={800} ground={1328} scale={0.95} color={frame > letW ? C.gold : C.bone} back={frame > letW ? C.goldDark : C.boneDark} glow={frame > letW ? "rgba(232,176,75,0.5)" : undefined} />
      </Stage>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", top: 760 + k * 40, left: 60 + k * 230, opacity: fadeIn(frame, 4 + k * 8) * (turn ? 0.4 : 1) }}>
          <BubbleIcon size={180} color={C.ash} t={frame + k * 10} />
        </div>
      ))}
      <Sfx at={away} name="whoosh" volume={0.3} />
      <Sfx at={letW} name="check" volume={0.4} />
    </>
  );
};

/* ---------- 7. PAYING: you are ---------- */
export const PayingScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const paying = wordFrame("paying", "paying", 15);
  const building = wordFrame("paying", "building", 50);
  const youAre = wordFrame("paying", "you", 90, 2); // "your", "your", lalu "You"
  const lines = [
    { t: "Paying your debts", at: paying },
    { t: "Building your future", at: building },
  ];
  return (
    <>
      <Title lines={[{ text: "They're not..." }]} size={130} at={0} />
      {lines.map((l, i) => {
        const s = pop(frame, l.at - 4, fps);
        const st = prog(frame, l.at + 14, l.at + 24);
        return (
          <div key={l.t} style={{ position: "absolute", top: 500 + i * 150, width: "100%", display: "flex", justifyContent: "center", opacity: Math.min(1, s * 1.5) * (1 - st * 0.4) }}>
            <div style={{ position: "relative", fontFamily: display, fontSize: 96, color: C.ink, textTransform: "uppercase" }}>
              {l.t}
              <Strike w={l.t.length * 37} p={st} />
            </div>
          </div>
        );
      })}
      <Big top={830} size={170} color={C.gold} s={pop(frame, youAre - 4, fps, 10)} spacing={3}>
        You are.
      </Big>
      <Stage>
        <line x1={300} y1={1330} x2={780} y2={1330} stroke={C.gold} strokeWidth={6} opacity={0.7} />
        <Figure pose={mix(POSES.stand, POSES.fist, prog(frame, youAre, youAre + 12))} x={540} ground={1328} scale={0.62} color={C.gold} back={C.goldDark} glow="rgba(232,176,75,0.5)" opacity={fadeIn(frame, youAre - 4)} />
      </Stage>
      <Sfx at={youAre} name="check" volume={0.4} />
    </>
  );
};

/* ---------- 8. OUTRO: small money is still money ---------- */
export const OutroScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const five = wordFrame("outro", "five", 40);
  const zero = wordFrame("outro", "zero", 70);
  const swallow = wordFrame("outro", "swallow", 130);
  const back = wordFrame("outro", "back", 175);
  const coins = Math.floor(interpolate(frame, [10, swallow], [1, 9], clamp));
  const total = [5, 12, 20, 35, 50, 80, 120, 180, 250][Math.max(0, coins - 1)];
  return (
    <>
      <Title lines={[{ text: "Small money" }, { text: "is still money.", color: C.gold }]} size={112} at={0} />
      <Stage>
        {Array.from({ length: coins }).map((_, i) => (
          <g key={i} transform={`translate(${200 - (i % 2) * 6} ${880 - i * 34})`}>
            <ellipse cx={100} cy={30} rx={110} ry={34} fill={C.goldDark} />
            <ellipse cx={100} cy={16} rx={110} ry={34} fill={C.gold} />
          </g>
        ))}
      </Stage>
      <div style={{ position: "absolute", top: 560, left: 520, width: 480, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 170, lineHeight: 1, color: C.gold }}>${total}</div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: C.dim }}>AND COUNTING</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 30, fontFamily: display, fontSize: 70, color: C.ash, opacity: fadeIn(frame, zero - 4) }}>
          $0 WAITING
          <Strike w={320} p={prog(frame, zero + 10, zero + 20)} />
        </div>
      </div>
      <Big top={1010} size={96} color={C.ink} s={pop(frame, swallow - 4, fps)}>
        Swallow your pride.
      </Big>
      <Big top={1130} size={120} color={C.gold} s={pop(frame, back - 20, fps, 16)}>
        Get your life back.
      </Big>
      <Sfx at={five} name="check" volume={0.3} />
      <Sfx at={back} name="check" volume={0.25} />
    </>
  );
};
