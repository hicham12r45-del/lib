import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { COLORS } from "../constants";
import { DayCounter } from "./DayCounter";
import { Figure } from "./Figure";

// مسار مبسّط من مكة إلى ميناء الشعيبة (مخطط تقريبي وليس دقيقاً جغرافياً)
const ROUTE = "M340 530 C 330 560, 290 540, 280 510 S 260 495, 245 490";
const MECCA = { x: 340, y: 530 };
const SHUAIBA = { x: 245, y: 490 };
const WALK_START = 120;
const WALK_END = 900;

export const Scene2LandJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const walk = interpolate(frame, [WALK_START, WALK_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(walk, ROUTE);
  const length = getLength(ROUTE);
  const mapIn = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #050b1f, ${COLORS.deepBlue})` }}>
      {/* سماء الليل: نجوم وقمر */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 70 }).map((_, i) => (
          <circle
            key={i}
            cx={random(`sx-${i}`) * 1920}
            cy={random(`sy-${i}`) * 500}
            r={1 + random(`sr-${i}`) * 2}
            fill="#fff"
            opacity={0.4 + 0.4 * Math.sin(frame * 0.08 + i)}
          />
        ))}
        <circle cx={1650} cy={140} r={60} fill="#f4ecd0" opacity={0.9} />
        <circle cx={1675} cy={125} r={55} fill="#050b1f" />
      </svg>

      {/* الخريطة */}
      <div style={{ position: "absolute", left: 60, top: 140, opacity: mapIn, transform: `scale(${0.9 + 0.1 * mapIn})` }}>
        <svg width={1100} height={800} viewBox="120 380 300 220">
          {/* شبه الجزيرة العربية (مبسّطة) */}
          <path
            d="M300 40 L420 60 L520 140 L600 260 L720 340 L780 440 L700 520 L560 580 L440 700 L360 760 L300 640 L260 520 L200 400 L140 300 L200 200 Z"
            fill="#1e2a44"
            stroke="#3a4b73"
            strokeWidth={1.5}
          />
          {/* ساحل أفريقيا */}
          <path d="M0 0 L128 0 L118 200 L150 330 L128 480 L170 620 L100 800 L0 800 Z" fill="#17203a" />
          <text x={175} y={430} fontSize={9} fill={COLORS.muted} textAnchor="middle">
            البحر الأحمر
          </text>

          {/* المسار */}
          <path d={ROUTE} fill="none" stroke="#ffffff22" strokeWidth={2} strokeDasharray="4 4" />
          <path
            d={ROUTE}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={2.5}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />

          {/* المدن */}
          {[
            { p: MECCA, name: "مكة المكرمة" },
            { p: SHUAIBA, name: "ميناء الشعيبة" },
          ].map(({ p, name }) => (
            <g key={name}>
              <circle cx={p.x} cy={p.y} r={5} fill={COLORS.gold} />
              <circle cx={p.x} cy={p.y} r={5 + (frame % 60) / 6} fill="none" stroke={COLORS.gold} opacity={1 - (frame % 60) / 60} />
              <text x={p.x} y={p.y + 17} fontSize={9} fill={COLORS.text} textAnchor="middle" fontWeight={700}>
                {name}
              </text>
            </g>
          ))}

          {/* القافلة: 5 شخصيات بلا ملامح */}
          {[0, 1, 2, 3, 4].map((i) => {
            const progress = Math.max(0, Math.min(1, walk - i * 0.035));
            const pt = getPointAtLength(ROUTE, progress * length);
            return (
              <Figure
                key={i}
                x={pt.x - 4}
                y={pt.y - 9}
                frame={frame}
                scale={0.1}
                phase={i * 1.3}
                color={i % 2 ? "#cfc7b0" : "#e3dcc8"}
              />
            );
          })}
        </svg>
      </div>

      {/* العنوان + العداد */}
      <div style={{ position: "absolute", right: 110, top: 150, width: 600 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.gold, marginBottom: 12 }}>الانطلاقة سراً</div>
        <div style={{ fontSize: 32, color: COLORS.muted, lineHeight: 1.7, marginBottom: 40 }}>
          من مكة إلى ميناء الشعيبة، مسيرٌ في ظلمة الليل
        </div>
        <DayCounter from={1} to={4} startFrame={WALK_START} endFrame={WALK_END} label="المسار البري" />
      </div>
    </AbsoluteFill>
  );
};
