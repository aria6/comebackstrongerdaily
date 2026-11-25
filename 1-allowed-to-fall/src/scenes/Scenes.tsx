import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, prog, wordFrame } from "../anim";
import { chain, Figure, mix, POSES, Pose } from "../components/Figure";
import {
  BedIcon,
  CheckMark,
  Clock,
  DoorSunIcon,
  GlassIcon,
  HeartIcon,
  MoneyIcon,
  RepeatIcon,
  SelfIcon,
  SparkIcon,
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
const fadeOut = (frame: number, at: number, len = 8) => interpolate(frame, [at, at + len], [1, 0], clamp);

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

/* ---------- 1. HOOK: you lost the money / woman / yourself ---------- */
const LossRow: React.FC<{ top: number; at: number; Icon: React.FC<{ hit: number }>; label: string }> = ({ top, at, Icon, label }) => {
  const { frame, fps } = useF();
  const s = pop(frame, at, fps, 13);
  const hit = prog(frame, at + 10, at + 20);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 90,
        width: 900,
        height: 250,
        display: "flex",
        alignItems: "center",
        gap: 50,
        opacity: Math.min(1, s * 1.5) * (1 - hit * 0.35),
        transform: `translateX(${(1 - s) * -120}px)`,
      }}
    >
      <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", filter: `grayscale(${hit})` }}>
        <Icon hit={hit} />
      </div>
      <div style={{ position: "relative", fontFamily: display, fontSize: 112, color: C.ink, textTransform: "uppercase" }}>
        {label}
        <Strike w={label.length * 58} p={hit} />
      </div>
      <Sfx at={at + 10} name="impact" volume={0.45} />
    </div>
  );
};

export const HookScene: React.FC<SP> = () => {
  const money = wordFrame("hook", "money", 20) - 6;
  const woman = wordFrame("hook", "woman", 60) - 6;
  const man = wordFrame("hook", "man", 100) - 6;
  return (
    <>
      <Title lines={[{ text: "You lost", color: C.gold }]} size={150} at={0} />
      <LossRow top={500} at={money} label="The money" Icon={() => <MoneyIcon size={210} />} />
      <LossRow top={800} at={woman} label="The woman" Icon={({ hit }) => <HeartIcon size={200} split={hit} />} />
      <LossRow top={1100} at={man} label="Yourself" Icon={() => <SelfIcon size={200} />} />
    </>
  );
};

/* ---------- 2. FALL: wake up every day ---------- */
export const FallScene: React.FC<SP> = ({ duration }) => {
  const { frame } = useF();
  const apart = wordFrame("fall", "apart", 110);
  const day = Math.floor(interpolate(frame, [0, duration], [1, 214], clamp));
  const breath = Math.sin(frame / 14) * 2;
  const crack = prog(frame, apart, apart + 12);
  return (
    <>
      <Title lines={[{ text: "Every." }, { text: "Single. Day.", color: C.gold }]} size={130} />
      <div style={{ position: "absolute", top: 560, left: 600, opacity: fadeIn(frame, 6) }}>
        <Clock size={330} t={frame * 0.45} />
        <div style={{ marginTop: 30, width: 330, textAlign: "center", fontFamily: display, fontSize: 92, color: C.ink }}>
          DAY <span style={{ color: C.red }}>{day}</span>
        </div>
      </div>
      <Stage>
        <line x1={60} y1={1330} x2={1020} y2={1330} stroke={C.steel} strokeWidth={6} />
        {/* jendela malam */}
        <g opacity={fadeIn(frame, 0, 12)}>
          <rect x={110} y={560} width={300} height={360} rx={10} fill="#0E1420" stroke={C.steel} strokeWidth={12} />
          <line x1={260} y1={560} x2={260} y2={920} stroke={C.steel} strokeWidth={10} />
          <line x1={110} y1={740} x2={410} y2={740} stroke={C.steel} strokeWidth={10} />
          <circle cx={340} cy={630} r={30} fill={C.bone} opacity={0.6} />
          {Array.from({ length: 14 }).map((_, i) => {
            const y = 570 + ((frame * 9 + i * 53) % 340);
            const x = 125 + ((i * 47) % 270);
            return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 24} stroke="#5A6A86" strokeWidth={3} />;
          })}
        </g>
        <g transform={`translate(0 ${breath})`}>
          <Figure pose={POSES.slump} x={300} ground={1328} scale={1.05} />
        </g>
        {/* retakan merah di lantai saat "fell apart" */}
        <path
          d="M560 1330 L620 1300 L660 1345 L720 1310 L770 1350 L840 1305 L900 1340 L980 1318"
          fill="none"
          stroke={C.red}
          strokeWidth={8}
          strokeLinejoin="round"
          strokeDasharray={520}
          strokeDashoffset={520 * (1 - crack)}
        />
      </Stage>
      <Sfx at={4} name="tick" volume={0.35} />
      <Sfx at={apart} name="impact" volume={0.4} />
    </>
  );
};

/* ---------- 3. LISTEN: falling is not the end ---------- */
export const ListenScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const falling = wordFrame("listen", "falling", 40);
  const staying = wordFrame("listen", "staying", 90);
  const is2 = wordFrame("listen", "is", 110, 1);
  const shake = frame >= is2 && frame < is2 + 8 ? Math.sin(frame * 3) * 10 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
      <Big top={260} size={190} color={C.gold} s={pop(frame, 0, fps, 12)} spacing={6}>
        Listen.
      </Big>
      <Big top={560} size={180} s={pop(frame, falling, fps)}>
        Falling
      </Big>
      <Big top={760} size={96} color={C.dim} s={pop(frame, falling + 8, fps)}>
        is not the end.
      </Big>
      <Big top={920} size={180} color={C.red} s={pop(frame, staying, fps)}>
        Staying down
      </Big>
      <Big top={1110} size={260} color={C.ink} s={pop(frame, is2, fps, 9)}>
        is.
      </Big>
      <Sfx at={0} name="impact" volume={0.35} />
      <Sfx at={staying} name="whoosh" volume={0.3} />
      <Sfx at={is2} name="impact" volume={0.6} />
    </div>
  );
};

/* ---------- 4. OTHERS: everybody falls, some get up ---------- */
export const OthersScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const knocked = wordFrame("others", "knocked", 30);
  const diff = wordFrame("others", "difference", 90);
  const disappear = wordFrame("others", "disappear", 160);
  const got = wordFrame("others", "got", 220);
  const xs = [200, 540, 880];
  const risers = [0, 2];
  const swap = fadeIn(frame, got - 4, 6);
  return (
    <>
      <div style={{ opacity: 1 - swap }}>
        <Title lines={[{ text: "Everybody" }, { text: "falls.", color: C.red }]} size={130} />
      </div>
      <div style={{ opacity: swap }}>
        <Title lines={[{ text: "Some" }, { text: "get up.", color: C.gold }]} size={130} at={got - 4} />
      </div>
      <div style={{ position: "absolute", top: 620, width: "100%", display: "flex", justifyContent: "center", gap: 40 }}>
        {[
          { label: "Come back", color: C.gold, at: diff + 10 },
          { label: "Disappear", color: C.ash, at: disappear },
        ].map((p) => {
          const s = pop(frame, p.at, fps);
          return (
            <div
              key={p.label}
              style={{
                fontFamily: display,
                fontSize: 78,
                color: p.color,
                border: `5px solid ${p.color}`,
                borderRadius: 24,
                padding: "10px 36px",
                textTransform: "uppercase",
                opacity: 0.22 + 0.78 * Math.min(1, s),
                transform: `scale(${0.9 + 0.1 * s})`,
              }}
            >
              {p.label}
            </div>
          );
        })}
      </div>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.steel} strokeWidth={6} />
        {xs.map((x, i) => {
          const fall = prog(frame, knocked + i * 5, knocked + i * 5 + 14);
          const rise = risers.indexOf(i) >= 0 ? prog(frame, got, got + 26) : 0;
          const fade = risers.indexOf(i) >= 0 ? 0 : prog(frame, disappear, disappear + 20);
          const pose: Pose = rise > 0 ? chain([[0, POSES.lying], [0.35, POSES.pushup], [0.65, POSES.kneel], [1, POSES.stand]], rise) : chain([[0, POSES.stand], [0.5, POSES.fallen], [1, POSES.lying]], fall);
          const gold = rise > 0.6;
          return (
            <Figure
              key={i}
              pose={pose}
              x={x}
              ground={1328 + fade * 40}
              scale={0.86}
              color={gold ? C.gold : C.bone}
              back={gold ? C.goldDark : C.boneDark}
              opacity={1 - fade * 0.85}
              glow={gold ? "rgba(232,176,75,0.6)" : undefined}
            />
          );
        })}
      </Stage>
      <Sfx at={knocked} name="impact" volume={0.4} />
      <Sfx at={got - 10} name="rise" volume={0.45} />
    </>
  );
};

/* ---------- 5. STEP: not a plan, not motivation, one step ---------- */
export const StepScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const plan = wordFrame("step", "plan", 15);
  const motiv = wordFrame("step", "motivation", 40);
  const just = wordFrame("step", "just", 70);
  const step = wordFrame("step", "step", 95);
  const swap = fadeIn(frame, just - 2, 6);
  const climb = prog(frame, step - 6, step + 14);
  const glow = prog(frame, step, step + 10);
  const stepPose: Pose = { ...POSES.stand, torso: 6, legF: [62, -66], armF: [-20, 10], armB: [18, 6] };
  return (
    <>
      <div style={{ opacity: 1 - swap }}>
        <Title lines={[{ text: "Not with..." }]} size={140} />
      </div>
      <div style={{ opacity: swap }}>
        <Title lines={[{ text: "One small" }, { text: "step.", color: C.gold }]} size={130} at={just} />
      </div>
      <div style={{ position: "absolute", top: 500, width: "100%", display: "flex", justifyContent: "center", gap: 40, opacity: 1 - swap * 0.75 }}>
        {[
          { label: "A plan", at: plan },
          { label: "Motivation", at: motiv },
        ].map((c) => {
          const s = pop(frame, c.at - 6, fps);
          const x = prog(frame, c.at + 4, c.at + 14);
          return (
            <div key={c.label} style={{ position: "relative", width: 440, height: 220, transform: `scale(${s})` }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 28,
                  background: C.steel,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: display,
                  fontSize: 82,
                  color: C.ink,
                  textTransform: "uppercase",
                }}
              >
                {c.label}
              </div>
              <div style={{ position: "absolute", top: 10, left: 120 }}>
                <XMark size={200} p={x} />
              </div>
              <Sfx at={c.at + 4} name="impact" volume={0.3} />
            </div>
          );
        })}
      </div>
      <Stage>
        {[0, 1, 2, 3].map((i) => {
          const x = 380 + i * 160;
          const y = 1330 - (i + 1) * 90;
          const lit = i === 0 ? glow : 0;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={1040 - x}
              height={1330 - y}
              fill={lit > 0 ? C.gold : C.steel}
              opacity={i === 0 ? 0.35 + 0.65 * Math.max(lit, 0.45) : 0.55 - i * 0.08}
              style={lit > 0 ? { filter: `drop-shadow(0 0 ${30 * lit}px ${C.gold})` } : undefined}
            />
          );
        })}
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.steel} strokeWidth={6} />
        <Figure pose={mix(POSES.stand, stepPose, climb)} x={250 + climb * 40} ground={1328} scale={1.0} color={glow > 0.5 ? C.gold : C.bone} back={glow > 0.5 ? C.goldDark : C.boneDark} />
      </Stage>
      <Sfx at={step} name="check" volume={0.5} />
    </>
  );
};

/* ---------- 6. ACTIONS: checklist ---------- */
export const ActionsScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const rows = [
    { Icon: BedIcon, label: "Make your bed", w: "bed", f: 20 },
    { Icon: GlassIcon, label: "Drink water", w: "water", f: 45 },
    { Icon: DoorSunIcon, label: "Go outside", w: "outside", f: 70 },
    { Icon: SparkIcon, label: "One hard thing", w: "thing", f: 110 },
    { Icon: RepeatIcon, label: "Again tomorrow", w: "tomorrow", f: 170 },
  ].map((r) => ({ ...r, at: wordFrame("actions", r.w, r.f) }));
  return (
    <>
      <Title lines={[{ text: "Today.", color: C.gold }]} size={150} />
      <div style={{ position: "absolute", top: 480, left: 70, width: 940, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, i) => {
          const s = pop(frame, r.at - 10, fps, 13);
          const c = prog(frame, r.at, r.at + 10);
          return (
            <div
              key={i}
              style={{
                height: 156,
                display: "flex",
                alignItems: "center",
                gap: 30,
                padding: "0 30px",
                borderRadius: 26,
                background: c > 0.5 ? "rgba(232,176,75,0.12)" : "rgba(43,43,49,0.75)",
                border: `3px solid ${c > 0.5 ? C.gold : C.steel}`,
                opacity: Math.min(1, s * 1.4),
                transform: `translateX(${(1 - s) * 140}px)`,
              }}
            >
              <r.Icon size={116} />
              <div style={{ flex: 1, fontFamily: display, fontSize: 76, color: C.ink, textTransform: "uppercase" }}>{r.label}</div>
              <CheckMark size={96} p={c} />
              <Sfx at={r.at} name="check" volume={0.4} />
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- 7. LOSING: you vs you ---------- */
export const LosingScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const win = wordFrame("losing", "win", 15);
  const stop = wordFrame("losing", "stop", 90);
  const strike = prog(frame, win + 18, win + 30);
  const swap = fadeIn(frame, stop - 2, 6);
  const beat = prog(frame, stop + 4, stop + 24);
  const vs = pop(frame, 8, fps, 9);
  return (
    <>
      <Title lines={[{ text: "Your only" }, { text: "opponent.", color: C.gold }]} size={124} />
      <Stage>
        <line x1={80} y1={1060} x2={1000} y2={1060} stroke={C.steel} strokeWidth={6} />
        <Figure pose={mix(POSES.stand, POSES.fist, beat)} x={290} ground={1058} scale={0.95} color={C.gold} back={C.goldDark} glow={beat > 0.3 ? "rgba(232,176,75,0.55)" : undefined} />
        <Figure pose={mix(POSES.stand, POSES.slump, beat)} x={790} ground={1058} scale={0.95} color={C.ash} back={C.steel} flip opacity={1 - beat * 0.5} />
      </Stage>
      <div style={{ position: "absolute", top: 760, width: "100%", textAlign: "center", fontFamily: display, fontSize: 110, color: C.red, transform: `scale(${vs})` }}>VS</div>
      <div style={{ position: "absolute", top: 1100, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - swap }}>
        <div style={{ position: "relative", fontFamily: display, fontSize: 104, color: C.ink, textTransform: "uppercase", opacity: fadeIn(frame, win - 4) }}>
          Win it all back
          <Strike w={720} p={strike} />
        </div>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 52, letterSpacing: 6, color: C.dim, opacity: fadeIn(frame, win + 20) }}>NOT THIS WEEK</div>
      </div>
      <div style={{ position: "absolute", top: 1110, width: "100%", textAlign: "center", fontFamily: display, fontSize: 112, lineHeight: 1.05, color: C.gold, textTransform: "uppercase", opacity: swap, transform: `scale(${0.8 + 0.2 * pop(frame, stop, fps)})` }}>
        Stop losing
        <br />
        to yourself
      </div>
      <Sfx at={win + 18} name="whoosh" volume={0.3} />
      <Sfx at={stop} name="impact" volume={0.5} />
    </>
  );
};

/* ---------- 8. OUTRO: get up ---------- */
export const OutroScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const pushing = wordFrame("outro", "pushing", 70);
  const so = wordFrame("outro", "so", 100);
  const get = wordFrame("outro", "get", 120);
  const up = wordFrame("outro", "up", 130);
  const t = interpolate(frame, [pushing - 10, pushing + 10, so, get, up + 4], [0, 0.3, 0.55, 0.8, 1], clamp);
  const pose = chain(
    [
      [0, POSES.lying],
      [0.3, POSES.pushup],
      [0.55, POSES.kneel],
      [0.8, POSES.stand],
      [1, POSES.fist],
    ],
    t,
  );
  const risen = t > 0.75;
  const big = pop(frame, get, fps, 10);
  return (
    <>
      <div style={{ opacity: fadeOut(frame, get - 6, 6) }}>
        <Title lines={[{ text: "The ground is" }, { text: "not your home.", color: C.gold }]} size={112} />
      </div>
      <div style={{ opacity: Math.min(1, big * 1.5) }}>
        <Big top={300} size={290} color={C.gold} s={big} spacing={4}>
          Get up.
        </Big>
      </div>
      <Stage>
        <line x1={0} y1={1330} x2={1080} y2={1330} stroke={risen ? C.gold : C.steel} strokeWidth={8} opacity={0.8} />
        <Figure
          pose={pose}
          x={520}
          ground={1328}
          scale={1.3}
          color={risen ? C.gold : C.bone}
          back={risen ? C.goldDark : C.boneDark}
          glow={risen ? "rgba(240,138,60,0.7)" : undefined}
        />
      </Stage>
      <Sfx at={get - 30} name="rise" volume={0.5} />
      <Sfx at={get} name="impact" volume={0.7} />
    </>
  );
};
