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

export const CarIcon: React.FC<I> = ({ size = 160, color = C.bone }) => (
  <Box size={size}>
    <path d="M20 130 L30 95 Q38 72 62 70 L138 70 Q160 72 170 95 L182 130 Z" fill={color} />
    <path d="M52 96 L62 80 L96 80 L96 96 Z M104 96 L104 80 L138 80 L150 96 Z" fill={C.bg} opacity={0.8} />
    <rect x={12} y={122} width={176} height={36} rx={14} fill={color} />
    <circle cx={55} cy={160} r={22} fill={C.bg} stroke={color} strokeWidth={8} />
    <circle cx={145} cy={160} r={22} fill={C.bg} stroke={color} strokeWidth={8} />
  </Box>
);

export const PhoneIcon: React.FC<I & { rings?: number }> = ({ size = 260, color = C.bone, rings = 1 }) => (
  <Box size={size}>
    <rect x={50} y={8} width={100} height={184} rx={18} fill={C.bg2} stroke={color} strokeWidth={8} />
    <rect x={88} y={18} width={24} height={6} rx={3} fill={color} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <circle cx={74 + i * 26} cy={52} r={11} fill="none" stroke={C.red} strokeWidth={4} opacity={rings} />
        <circle cx={74 + i * 26} cy={52} r={7} fill={color} />
      </g>
    ))}
    <rect x={62} y={76} width={76} height={92} rx={8} fill={C.steel} />
    <circle cx={100} cy={108} r={14} fill={C.ash} />
    <path d="M74 160 Q100 124 126 160 Z" fill={C.ash} />
  </Box>
);

export const BubbleIcon: React.FC<I & { t?: number }> = ({ size = 260, color = C.bone, t = 0 }) => (
  <Box size={size}>
    <path d="M20 40 Q20 18 42 18 L158 18 Q180 18 180 40 L180 120 Q180 142 158 142 L80 142 L46 176 L50 142 L42 142 Q20 142 20 120 Z" fill={C.bg2} stroke={color} strokeWidth={8} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={70 + i * 30} cy={80 - Math.max(0, Math.sin(t / 5 - i)) * 10} r={10} fill={color} />
    ))}
  </Box>
);

export const Hourglass: React.FC<{ size?: number; p: number }> = ({ size = 300, p }) => (
  <Box size={size}>
    <rect x={40} y={10} width={120} height={14} rx={6} fill={C.boneDark} />
    <rect x={40} y={176} width={120} height={14} rx={6} fill={C.boneDark} />
    <path d="M52 24 L148 24 Q148 70 104 100 Q148 130 148 176 L52 176 Q52 130 96 100 Q52 70 52 24 Z" fill="none" stroke={C.bone} strokeWidth={7} />
    {/* pasir atas berkurang, bawah bertambah */}
    <path d={`M${60 + p * 30} ${30 + p * 55} L${140 - p * 30} ${30 + p * 55} Q120 75 100 96 Q80 75 ${60 + p * 30} ${30 + p * 55} Z`} fill={C.gold} opacity={1 - p * 0.9} />
    <path d={`M58 172 L142 172 L${142 - 40 * (1 - p)} ${172 - 60 * p} L${58 + 40 * (1 - p)} ${172 - 60 * p} Z`} fill={C.gold} />
    <line x1={100} y1={100} x2={100} y2={170} stroke={C.gold} strokeWidth={3} opacity={p < 0.98 ? 1 : 0} />
  </Box>
);

export const DumbbellIcon: React.FC<I> = ({ size = 130, color = C.bone }) => (
  <Box size={size}>
    <rect x={56} y={92} width={88} height={16} rx={6} fill={color} />
    <rect x={30} y={56} width={26} height={88} rx={8} fill={color} />
    <rect x={10} y={72} width={20} height={56} rx={6} fill={C.boneDark} />
    <rect x={144} y={56} width={26} height={88} rx={8} fill={color} />
    <rect x={170} y={72} width={20} height={56} rx={6} fill={C.boneDark} />
  </Box>
);

export const BriefcaseIcon: React.FC<I> = ({ size = 130, color = C.bone }) => (
  <Box size={size}>
    <rect x={72} y={36} width={56} height={30} rx={8} fill="none" stroke={color} strokeWidth={10} />
    <rect x={20} y={62} width={160} height={112} rx={14} fill={color} />
    <rect x={20} y={104} width={160} height={10} fill={C.boneDark} />
    <rect x={88} y={98} width={24} height={22} rx={4} fill={C.gold} />
  </Box>
);

export const PeaceIcon: React.FC<I> = ({ size = 130, color = C.bone }) => (
  <Box size={size}>
    <circle cx={100} cy={92} r={30} fill={C.dawn} />
    <path d="M10 170 L70 90 L104 132 L134 100 L190 170 Z" fill={color} />
    <path d="M70 90 L84 108 L60 112 Z" fill={C.bg} opacity={0.3} />
    <rect x={10} y={168} width={180} height={10} rx={4} fill={C.boneDark} />
  </Box>
);
