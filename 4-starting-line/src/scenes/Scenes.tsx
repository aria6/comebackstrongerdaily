import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, prog, wordFrame } from "../anim";
import { Figure, mix, POSES } from "../components/Figure";
import { BillIcon, ChainIcon, PenIcon, PhoneIcon, Strike } from "../components/Icons";
import { Sfx, Stage, Title } from "../components/Layout";
import { body, C, display } from "../theme";

type SP = { duration: number };

const useF = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps };
};

const fadeIn = (frame: number, at: number, len = 8) => interpolate(frame, [at, at + len], [0, 1], clamp);
const money = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

/** Daftar utang contoh (total 47.320) */
const DEBTS = [
  { name: "Credit card", amt: 12400 },
  { name: "Bank loan", amt: 18000 },
  { name: "Car payment", amt: 9800 },
  { name: "Mike", amt: 1200 },
  { name: "Phone bill", amt: 420 },
  { name: "Mom", amt: 5500 },
];
const TOTAL = DEBTS.reduce((a, d) => a + d.amt, 0);
const SORTED = [...DEBTS].sort((a, b) => a.amt - b.amt);

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

/* ---------- 1. HOOK: in the red ---------- */
export const HookScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const red = wordFrame("hook", "red", 20);
  const debt = wordFrame("hook", "debt", 45);
  const own = wordFrame("hook", "own", 80);
  const phone = wordFrame("hook", "phone", 110);
  const bill = wordFrame("hook", "bill", 130);
  const bal = interpolate(frame, [red - 6, red + 30], [0, -TOTAL], clamp);
  const debtW = prog(frame, debt - 4, debt + 20);
  const ownW = prog(frame, own - 6, own + 12) * 0.2;
  const ring = frame > phone - 6 ? Math.sin(frame * 1.6) * 8 : 0;
  return (
    <>
      <Title lines={[{ text: "In the red.", color: C.red }]} size={150} at={0} />
      <div style={{ position: "absolute", top: 480, left: 110, width: 860, height: 230, borderRadius: 30, background: "rgba(43,43,49,0.85)", border: `4px solid ${C.red}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeIn(frame, red - 10) }}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: C.dim }}>ACCOUNT BALANCE</div>
        <div style={{ fontFamily: display, fontSize: 140, lineHeight: 1.05, color: C.red }}>{money(bal)}</div>
      </div>
      <div style={{ position: "absolute", top: 760, left: 110, width: 860, display: "flex", flexDirection: "column", gap: 22 }}>
        {[
          { label: "Debt", w: debtW, color: C.red, at: debt },
          { label: "What you own", w: ownW, color: C.ash, at: own },
        ].map((b) => (
          <div key={b.label} style={{ opacity: fadeIn(frame, b.at - 8) }}>
            <div style={{ fontFamily: display, fontSize: 52, color: C.ink, textTransform: "uppercase" }}>{b.label}</div>
            <div style={{ height: 56, borderRadius: 28, background: C.steel, overflow: "hidden" }}>
              <div style={{ width: `${b.w * 100}%`, height: "100%", background: b.color }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1060, left: 110, width: 860, height: 300, display: "flex", alignItems: "center", gap: 40, opacity: fadeIn(frame, phone - 8) }}>
        <div style={{ transform: `rotate(${ring}deg)` }}>
          <PhoneIcon size={290} rings={1} />
        </div>
        <div style={{ position: "relative", flex: 1, height: 300 }}>
          {[0, 1, 2, 3].map((k) => {
            const s = pop(frame, bill - 8 + k * 5, fps, 12);
            return (
              <div key={k} style={{ position: "absolute", left: 40 + k * 90, top: 60 - (k % 2) * 30, transform: `rotate(${-14 + k * 10}deg) scale(${s})` }}>
                <BillIcon size={170} />
              </div>
            );
          })}
        </div>
      </div>
      <Sfx at={red} name="impact" volume={0.4} />
      <Sfx at={phone - 6} name="tick" volume={0.35} />
      <Sfx at={bill - 8} name="whoosh" volume={0.3} />
    </>
  );
};

/* ---------- 2. HIDE: ignore the messages ---------- */
export const HideScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const ignore = wordFrame("hide", "ignore", 20);
  const pretend = wordFrame("hide", "pretend", 50);
  const wont = wordFrame("hide", "won", 85);
  const notes = ["Final notice", "Payment overdue", "Missed call (4)", "Late fee added"];
  const hit = prog(frame, wont, wont + 8);
  const shake = frame >= wont && frame < wont + 10 ? Math.sin(frame * 3) * 10 : 0;
  return (
    <>
      <Swap a={<Title lines={[{ text: "So you hide." }]} size={140} at={0} />} b={<Title lines={[{ text: "It won't.", color: C.red }]} size={160} at={wont - 4} />} t={fadeIn(frame, wont - 4, 6)} />
      <div style={{ position: "absolute", top: 480, left: 90, width: 900, display: "flex", flexDirection: "column", gap: 20, transform: `translateX(${shake}px)` }}>
        {notes.map((n, i) => {
          const s = pop(frame, ignore - 10 + i * 6, fps, 13);
          const ignored = prog(frame, pretend - 6 + i * 4, pretend + 6 + i * 4);
          return (
            <div
              key={n}
              style={{
                height: 112,
                borderRadius: 28,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 34px",
                background: hit > 0.5 ? "rgba(216,64,46,0.25)" : "rgba(43,43,49,0.9)",
                border: `3px solid ${hit > 0.5 ? C.red : C.steel}`,
                opacity: Math.min(1, s * 1.5) * (1 - ignored * 0.55 + hit * 0.55),
                transform: `translateY(${(1 - s) * -60}px)`,
              }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 11, background: C.red }} />
              <div style={{ fontFamily: display, fontSize: 58, color: C.ink, textTransform: "uppercase" }}>{n}</div>
            </div>
          );
        })}
      </div>
      <Stage>
        <line x1={40} y1={1330} x2={1040} y2={1330} stroke={C.steel} strokeWidth={6} />
        <Figure pose={POSES.slump} x={480} ground={1328} scale={0.85} />
      </Stage>
      <Sfx at={ignore - 10} name="tick" volume={0.3} />
      <Sfx at={wont} name="impact" volume={0.55} />
    </>
  );
};

/** Kertas daftar utang */
const Notepad: React.FC<{
  rows: { name: string; amt: number }[];
  shown: (i: number) => number;
  lit?: (i: number) => number;
  struck?: (i: number) => number;
  paid?: (i: number) => number;
  total?: number;
  pen?: { i: number; o: number };
}> = ({ rows, shown, lit, struck, paid, total = 0, pen }) => (
  <div style={{ position: "absolute", top: 490, left: 100, width: 880, height: 900, borderRadius: 20, background: "#EDE6D6", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", padding: "34px 50px" }}>
    <div style={{ fontFamily: display, fontSize: 70, color: C.bg, borderBottom: `5px solid ${C.red}`, paddingBottom: 8 }}>MY DEBTS</div>
    {rows.map((r, i) => {
      const s = shown(i);
      const l = lit ? lit(i) : 0;
      const st = struck ? struck(i) : 0;
      const pd = paid ? paid(i) : 0;
      return (
        <div key={r.name} style={{ position: "relative", height: 88, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", margin: "4px -18px 0", borderRadius: 14, background: l > 0 ? `rgba(232,176,75,${0.55 * l})` : "transparent", opacity: s, fontFamily: display, fontSize: 60, color: C.bg }}>
          <span style={{ opacity: 1 - st * 0.5 }}>{r.name.toUpperCase()}</span>
          <span style={{ color: st > 0.5 ? "#6B6B6B" : C.red, opacity: 1 - st * 0.5 }}>{money(-r.amt)}</span>
          {st > 0 && (
            <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 0 }}>
              <Strike w={730} p={st} tilt={-2} />
            </div>
          )}
          {pd > 0 && (
            <div style={{ position: "absolute", right: 260, top: 6, fontFamily: display, fontSize: 60, color: "#2E8B57", border: "6px solid #2E8B57", borderRadius: 12, padding: "0 16px", transform: `rotate(-10deg) scale(${0.5 + 0.5 * pd})`, opacity: pd }}>PAID</div>
          )}
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 34, display: "flex", justifyContent: "space-between", borderTop: `4px solid ${C.bg}`, paddingTop: 12, fontFamily: display, fontSize: 66, opacity: total }}>
      <span style={{ color: C.bg }}>TOTAL</span>
      <span style={{ color: C.red }}>{money(-TOTAL)}</span>
    </div>
    {pen && (
      <div style={{ position: "absolute", right: 40, top: 130 + pen.i * 92 - 40, opacity: pen.o }}>
        <PenIcon size={130} />
      </div>
    )}
  </div>
);

/* ---------- 3. PAPER: write down every debt ---------- */
export const PaperScene: React.FC<SP> = () => {
  const { frame } = useF();
  const paper = wordFrame("paper", "paper", 50);
  const writes = wordFrame("paper", "writes", 70);
  const number = wordFrame("paper", "number", 160);
  const step = (number - writes) / DEBTS.length;
  const cur = Math.min(DEBTS.length - 1, Math.max(0, Math.floor((frame - writes) / step)));
  return (
    <>
      <Title lines={[{ text: "Write it" }, { text: "all down.", color: C.gold }]} size={124} at={0} />
      <div style={{ opacity: fadeIn(frame, paper - 10, 10), transform: `translateY(${(1 - fadeIn(frame, paper - 10, 12)) * 80}px)` }}>
        <Notepad rows={DEBTS} shown={(i) => fadeIn(frame, writes + i * step, 6)} total={fadeIn(frame, number, 8)} pen={{ i: cur, o: frame > writes - 4 && frame < number + 6 ? 1 : 0 }} />
      </div>
      <Sfx at={paper - 10} name="whoosh" volume={0.3} />
      <Sfx at={number} name="impact" volume={0.45} />
    </>
  );
};

/* ---------- 4. ATTACK: smallest first ---------- */
export const AttackScene: React.FC<SP> = () => {
  const { frame } = useF();
  const smallest = wordFrame("attack", "smallest", 40);
  const pay = wordFrame("attack", "pay", 80);
  const cross = wordFrame("attack", "cross", 100);
  const next = wordFrame("attack", "next", 125);
  return (
    <>
      <Title lines={[{ text: "Smallest" }, { text: "first.", color: C.gold }]} size={124} at={0} />
      <Notepad
        rows={SORTED}
        shown={() => 1}
        lit={(i) => (i === 0 ? prog(frame, smallest - 4, smallest + 6) * (1 - prog(frame, cross, cross + 10)) : i === 1 ? prog(frame, next - 4, next + 6) : 0)}
        paid={(i) => (i === 0 ? prog(frame, pay, pay + 8) : 0)}
        struck={(i) => (i === 0 ? prog(frame, cross, cross + 10) : 0)}
        total={1}
      />
      <Sfx at={smallest} name="check" volume={0.4} />
      <Sfx at={pay} name="impact" volume={0.45} />
      <Sfx at={cross} name="whoosh" volume={0.35} />
      <Sfx at={next} name="check" volume={0.4} />
    </>
  );
};

/* ---------- 5. NUMBER: not who you are ---------- */
export const NumberScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const who = wordFrame("number", "who", 40);
  const name = wordFrame("number", "name", 75);
  const future = wordFrame("number", "future", 100);
  const dim = prog(frame, who - 4, who + 10);
  const chip = (label: string, at: number, left: number) => {
    const s = pop(frame, at - 4, fps, 12);
    return (
      <div style={{ position: "absolute", top: 1060, left, width: 300, textAlign: "center", fontFamily: display, fontSize: 52, lineHeight: 1.05, color: C.gold, border: `4px solid ${C.gold}`, borderRadius: 20, padding: "10px 0", background: "rgba(11,11,13,0.6)", transform: `scale(${s})` }}>
        {label}
      </div>
    );
  };
  return (
    <>
      <Title lines={[{ text: "Just a" }, { text: "number.", color: C.gold }]} size={124} at={0} />
      <div style={{ position: "absolute", top: 500, width: "100%", textAlign: "center", fontFamily: display, fontSize: 180, color: C.red, opacity: 1 - dim * 0.65, transform: `scale(${1 - dim * 0.25})` }}>{money(-TOTAL)}</div>
      <Big top={720} size={84} color={C.ink} s={pop(frame, who - 4, fps)}>
        Not who you are
      </Big>
      <Stage>
        <line x1={300} y1={1330} x2={780} y2={1330} stroke={C.gold} strokeWidth={6} opacity={0.7} />
        <Figure pose={POSES.stand} x={540} ground={1328} scale={0.95} color={dim > 0.5 ? C.gold : C.bone} back={dim > 0.5 ? C.goldDark : C.boneDark} glow={dim > 0.5 ? "rgba(232,176,75,0.5)" : undefined} />
      </Stage>
      {chip("NOT YOUR NAME", name, 50)}
      {chip("NOT YOUR FUTURE", future, 730)}
      <Sfx at={who} name="impact" volume={0.45} />
    </>
  );
};

/* ---------- 6. MINUS: still a start ---------- */
export const MinusScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const zero = wordFrame("minus", "zero", 20);
  const hard = wordFrame("minus", "hard", 35);
  const minus = wordFrame("minus", "minus", 70);
  const harder = wordFrame("minus", "harder", 85);
  const start = wordFrame("minus", "start", 120, 2); // "Starting", "Starting", lalu "start"
  const unit = 84;
  const pos = interpolate(frame, [minus - 4, minus + 16], [0, -4], clamp);
  const x = 540 + pos * unit;
  const go = prog(frame, start - 4, start + 10);
  return (
    <>
      <Swap
        a={<Title lines={[{ text: "Zero is hard." }]} size={124} at={zero - 4} />}
        b={<Title lines={[{ text: "Still a" }, { text: "start.", color: C.gold }]} size={124} at={start - 4} />}
        t={fadeIn(frame, start - 4, 6)}
      />
      <Big top={520} size={90} color={C.dim} s={pop(frame, hard - 4, fps)}>
        Hard
      </Big>
      <Big top={630} size={130} color={C.red} s={pop(frame, harder - 4, fps)}>
        Harder
      </Big>
      <Stage>
        <line x1={60} y1={1100} x2={1020} y2={1100} stroke={C.steel} strokeWidth={8} />
        {Array.from({ length: 11 }).map((_, k) => {
          const v = k - 5;
          const tx = 540 + v * unit;
          return <line key={k} x1={tx} y1={1080} x2={tx} y2={1120} stroke={v < 0 ? C.red : v > 0 ? C.gold : C.ink} strokeWidth={v === 0 ? 10 : 6} />;
        })}
        {/* tanda minus & plus digambar SVG */}
        <rect x={84} y={1150} width={40} height={12} rx={4} fill={C.red} />
        <rect x={956} y={1150} width={40} height={12} rx={4} fill={C.gold} />
        <rect x={970} y={1136} width={12} height={40} rx={4} fill={C.gold} />
        <line x1={x} y1={1100} x2={x + (1000 - x) * go} y2={1100} stroke={C.gold} strokeWidth={10} strokeDasharray="6 22" strokeLinecap="round" opacity={go} />
        <Figure pose={go > 0.5 ? mix(POSES.stand, POSES.walk, Math.min(1, (go - 0.5) * 2)) : POSES.stand} x={x} ground={1096} scale={0.62} color={go > 0.5 ? C.gold : C.bone} back={go > 0.5 ? C.goldDark : C.boneDark} glow={go > 0.5 ? "rgba(232,176,75,0.5)" : undefined} />
      </Stage>
      <div style={{ position: "absolute", top: 1140, width: "100%", textAlign: "center", fontFamily: display, fontSize: 56, color: C.ink, opacity: fadeIn(frame, zero) }}>0</div>
      <div style={{ position: "absolute", top: 1220, left: x - 150, width: 300, textAlign: "center", fontFamily: body, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: go > 0.5 ? C.gold : C.red, opacity: fadeIn(frame, minus + 10) }}>
        YOU ARE HERE
      </div>
      <Sfx at={minus} name="whoosh" volume={0.35} />
      <Sfx at={start - 20} name="rise" volume={0.4} />
      <Sfx at={start} name="impact" volume={0.5} />
    </>
  );
};

/* ---------- 7. OUTRO: freedom coming back, tonight ---------- */
export const OutroScene: React.FC<SP> = () => {
  const { frame, fps } = useF();
  const freedom = wordFrame("outro", "freedom", 60);
  const grab = wordFrame("outro", "grab", 110);
  const write = wordFrame("outro", "write", 135);
  const tonight = wordFrame("outro", "tonight", 160);
  const bal = interpolate(frame, [0, freedom + 10], [-TOTAL, -TOTAL * 0.62], clamp);
  const freed = prog(frame, freedom - 4, freedom + 14);
  return (
    <>
      <Title lines={[{ text: "Payment by" }, { text: "payment.", color: C.gold }]} size={118} at={0} />
      <div style={{ position: "absolute", top: 490, width: "100%", textAlign: "center", fontFamily: display, fontSize: 130, color: freed > 0.5 ? C.gold : C.red }}>{money(bal)}</div>
      <div style={{ position: "absolute", top: 640, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <ChainIcon size={300} p={freed} />
        <div style={{ fontFamily: display, fontSize: 96, color: C.gold, opacity: freed }}>FREEDOM</div>
      </div>
      <Big top={960} size={92} s={pop(frame, grab - 4, fps)}>
        Grab the paper.
      </Big>
      <Big top={1070} size={92} s={pop(frame, write - 4, fps)}>
        Write it down.
      </Big>
      <Big top={1190} size={190} color={C.gold} s={pop(frame, tonight - 2, fps, 10)} spacing={4}>
        Tonight.
      </Big>
      <Sfx at={freedom} name="check" volume={0.45} />
      <Sfx at={tonight - 28} name="rise" volume={0.45} />
      <Sfx at={tonight} name="impact" volume={0.7} />
    </>
  );
};
