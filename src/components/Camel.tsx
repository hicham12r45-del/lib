import React from "react";
import { Figure } from "./Figure";

type Props = {
  x: number; // موضع منتصف الجسم
  y: number; // خط الأرض
  frame: number;
  scale?: number;
  phase?: number;
  color?: string;
  rider?: boolean;
};

/** جمل بشكل ظلّي (Silhouette) يتجه إلى اليسار، مع راكب بلا ملامح اختيارياً */
export const Camel: React.FC<Props> = ({ x, y, frame, scale = 1, phase = 0, color = "#8f8266", rider = true }) => {
  const t = frame * 0.2 + phase;
  const bob = Math.sin(t * 2) * 2;
  const legs = [
    { x: -58, ph: 0 },
    { x: -34, ph: Math.PI },
    { x: 44, ph: Math.PI },
    { x: 68, ph: 0 },
  ];

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* الأرجل الخلفية أغمق قليلاً لإحساس العمق */}
      {legs.map((l, i) => (
        <g key={i} transform={`translate(${l.x} -88) rotate(${Math.sin(t + l.ph) * 16})`}>
          <path d="M-7 0 L7 0 L5 50 L9 86 L-1 88 L-4 52 Z" fill={color} opacity={i % 2 ? 0.75 : 1} />
        </g>
      ))}
      <g transform={`translate(0 ${bob})`}>
        <ellipse cx={0} cy={-125} rx={88} ry={40} fill={color} />
        <path d="M-12 -150 Q12 -218 42 -150 Z" fill={color} />
        <path d="M-62 -135 C-95 -150 -108 -190 -122 -214 L-108 -226 C-92 -205 -80 -170 -40 -150 Z" fill={color} />
        <ellipse cx={-138} cy={-222} rx={30} ry={14} fill={color} transform="rotate(-18 -138 -222)" />
        <path d="M82 -130 Q100 -110 94 -85" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" />
        {rider && <Figure x={10} y={-258} frame={frame} scale={0.9} phase={phase} color="#d8d0bb" />}
      </g>
    </g>
  );
};
