import React from "react";

type Props = {
  x: number;
  y: number;
  frame: number;
  scale?: number;
  color?: string;
  phase?: number;
};

/**
 * شخصية Minimalist Vector بدون أي ملامح وجه:
 * رأس دائري ملفوف بالعمامة + ثوب طويل + عصا، مع حركة مشي خفيفة.
 */
export const Figure: React.FC<Props> = ({
  x,
  y,
  frame,
  scale = 1,
  color = "#d9d2c0",
  phase = 0,
}) => {
  const t = frame * 0.25 + phase;
  const bob = Math.abs(Math.sin(t)) * -4; // اهتزاز الخطوة
  const sway = Math.sin(t) * 3; // ميلان الثوب

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform={`translate(0 ${bob})`}>
        <line x1={20} y1={-10} x2={24 + sway} y2={78} stroke={color} strokeWidth={3} opacity={0.7} />
        <g transform={`rotate(${sway} 0 70)`}>
          <path d="M-14 0 Q-19 40 -24 76 L24 76 Q19 40 14 0 Z" fill={color} />
          <circle cx={0} cy={-14} r={13} fill={color} />
          <path d="M-14 -16 Q0 -32 14 -16 Q0 -22 -14 -16 Z" fill="#00000033" />
        </g>
      </g>
    </g>
  );
};
