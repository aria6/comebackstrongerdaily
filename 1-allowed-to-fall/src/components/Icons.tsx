import React from "react";
import { C } from "../theme";

/** Semua ikon digambar SVG (viewBox 200x200), tanpa karakter teks/emoji. */
const Box: React.FC<{ size: number; children: React.ReactNode }> = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: "block", overflow: "visible" }}>
    {children}
  </svg>
);

type I = { size?: number; color?: string };

export const MoneyIcon: React.FC<I> = ({ size = 160, color = C.gold }) => (
  <Box size={size}>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${18 + i * 8} ${112 - i * 34})`}>
        <rect width={150} height={70} rx={10} fill={i === 2 ? color : C.goldDark} stroke={C.bg} strokeWidth={5} />
        <circle cx={75} cy={35} r={18} fill="none" stroke={C.bg} strokeWidth={6} />
        <rect x={14} y={12} width={14} height={46} rx={4} fill={C.bg} opacity={0.35} />
        <rect x={122} y={12} width={14} height={46} rx={4} fill={C.bg} opacity={0.35} />
      </g>
    ))}
  </Box>
);

export const HeartIcon: React.FC<I & { split?: number }> = ({ size = 160, color = C.red, split = 0 }) => {
  const half = (side: 1 | -1) => (
    <g transform={`translate(${side * split * 16} ${split * 10}) rotate(${side * split * 10} 100 170)`}>
      <path
        d={
          side === -1
            ? "M100 170 C40 130 10 95 20 60 C30 25 80 20 100 55 L88 85 L108 105 L92 130 Z"
            : "M100 170 C160 130 190 95 180 60 C170 25 120 20 100 55 L88 85 L108 105 L92 130 Z"
        }
        fill={color}
      />
    </g>
  );
  return (
    <Box size={size}>
      {half(-1)}
      {half(1)}
    </Box>
  );
};

export const SelfIcon: React.FC<I> = ({ size = 160, color = C.bone }) => (
  <Box size={size}>
    <circle cx={100} cy={70} r={40} fill={color} />
    <path d="M30 190 C30 130 60 118 100 118 C140 118 170 130 170 190 Z" fill={color} />
  </Box>
);

export const BedIcon: React.FC<I> = ({ size = 130, color = C.bone }) => (
  <Box size={size}>
    <rect x={20} y={60} width={16} height={110} rx={6} fill={color} />
    <rect x={164} y={100} width={16} height={70} rx={6} fill={color} />
    <rect x={30} y={110} width={145} height={36} rx={8} fill={color} />
    <rect x={44} y={86} width={46} height={26} rx={10} fill={C.gold} />
    <rect x={92} y={96} width={80} height={16} rx={6} fill={C.boneDark} />
  </Box>
);

export const GlassIcon: React.FC<I> = ({ size = 130, color = C.bone }) => (
  <Box size={size}>
    <path d="M50 30 L150 30 L136 180 L64 180 Z" fill="none" stroke={color} strokeWidth={12} strokeLinejoin="round" />
    <path d="M58 90 L142 90 L135 172 L65 172 Z" fill="#5FA8D3" />
    <path d="M100 52 C112 68 116 76 116 84 A16 16 0 0 1 84 84 C84 76 88 68 100 52 Z" fill="#5FA8D3" />
  </Box>
);

export const DoorSunIcon: React.FC<I> = ({ size = 130, color = C.bone }) => (
  <Box size={size}>
    <circle cx={140} cy={60} r={26} fill={C.dawn} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <line key={i} x1={140 + Math.cos(a) * 36} y1={60 + Math.sin(a) * 36} x2={140 + Math.cos(a) * 50} y2={60 + Math.sin(a) * 50} stroke={C.dawn} strokeWidth={8} strokeLinecap="round" />
      );
    })}
    <rect x={30} y={60} width={80} height={125} rx={6} fill="none" stroke={color} strokeWidth={12} />
    <path d="M42 72 L90 82 L90 185 L42 175 Z" fill={color} />
    <circle cx={80} cy={130} r={6} fill={C.bg} />
  </Box>
);

export const SparkIcon: React.FC<I> = ({ size = 130, color = C.gold }) => (
  <Box size={size}>
    <path d="M100 10 L120 80 L190 100 L120 120 L100 190 L80 120 L10 100 L80 80 Z" fill={color} />
  </Box>
);

export const RepeatIcon: React.FC<I> = ({ size = 130, color = C.gold }) => (
  <Box size={size}>
    <path d="M40 100 A60 60 0 0 1 150 66" fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" />
    <path d="M160 100 A60 60 0 0 1 50 134" fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" />
    <path d="M128 40 L166 62 L136 92 Z" fill={color} />
    <path d="M72 160 L34 138 L64 108 Z" fill={color} />
  </Box>
);

export const CheckMark: React.FC<{ size?: number; color?: string; p?: number }> = ({ size = 90, color = C.gold, p = 1 }) => (
  <Box size={size}>
    <circle cx={100} cy={100} r={92} fill={color} opacity={Math.min(1, p * 2)} />
    <path d="M55 102 L88 135 L150 68" fill="none" stroke={C.bg} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={160} strokeDashoffset={160 * (1 - p)} />
  </Box>
);

export const Clock: React.FC<{ size?: number; t: number }> = ({ size = 220, t }) => (
  <Box size={size}>
    <circle cx={100} cy={100} r={88} fill={C.bg2} stroke={C.bone} strokeWidth={10} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={100 + Math.cos(a) * 66} y1={100 + Math.sin(a) * 66} x2={100 + Math.cos(a) * 78} y2={100 + Math.sin(a) * 78} stroke={C.dim} strokeWidth={i % 3 === 0 ? 8 : 4} strokeLinecap="round" />;
    })}
    <line x1={100} y1={100} x2={100 + Math.sin(t / 12) * 42} y2={100 - Math.cos(t / 12) * 42} stroke={C.bone} strokeWidth={10} strokeLinecap="round" />
    <line x1={100} y1={100} x2={100 + Math.sin(t) * 62} y2={100 - Math.cos(t) * 62} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
    <circle cx={100} cy={100} r={9} fill={C.gold} />
  </Box>
);

/** Garis coret merah yang tergambar dari kiri ke kanan */
export const Strike: React.FC<{ w: number; p: number; color?: string; tilt?: number }> = ({ w, p, color = C.red, tilt = -4 }) => (
  <svg width={w} height={60} style={{ position: "absolute", left: 0, top: "50%", marginTop: -30, overflow: "visible", transform: `rotate(${tilt}deg)` }}>
    <line x1={0} y1={30} x2={w * p} y2={30} stroke={color} strokeWidth={14} strokeLinecap="round" />
  </svg>
);

/** Tanda silang besar (SVG) */
export const XMark: React.FC<{ size?: number; p: number; color?: string }> = ({ size = 200, p, color = C.red }) => (
  <Box size={size}>
    <line x1={30} y1={30} x2={30 + 140 * Math.min(1, p * 2)} y2={30 + 140 * Math.min(1, p * 2)} stroke={color} strokeWidth={22} strokeLinecap="round" />
    {p > 0.5 && <line x1={170} y1={30} x2={170 - 140 * (p - 0.5) * 2} y2={30 + 140 * (p - 0.5) * 2} stroke={color} strokeWidth={22} strokeLinecap="round" />}
  </Box>
);
