import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, TITLES } from "../constants";
import { DayCounter } from "./DayCounter";
import { ChapterTitle } from "./ChapterTitle";
import { Caption } from "./Caption";

/** مسار موجة يتحرك مع الإطار */
const wavePath = (frame: number, amp: number, len: number, speed: number, y: number) => {
  let d = `M0 ${y}`;
  for (let x = 0; x <= 1920; x += 40) {
    d += ` L${x} ${y + Math.sin(x / len + frame * speed) * amp}`;
  }
  return d + " L1920 1080 L0 1080 Z";
};

/** سفينة تجارية مبسّطة */
const Ship: React.FC<{ x: number; y: number; frame: number; scale: number; phase: number }> = ({
  x,
  y,
  frame,
  scale,
  phase,
}) => {
  const bob = Math.sin(frame * 0.05 + phase) * 8;
  const tilt = Math.sin(frame * 0.05 + phase + 1) * 2.5;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${tilt}) scale(${scale})`}>
      <line x1={0} y1={-190} x2={0} y2={0} stroke="#8b6b45" strokeWidth={6} />
      <path d="M6 -185 Q110 -110 6 -30 Z" fill="#efe7d2" />
      <path d="M-6 -150 Q-70 -100 -6 -40 Z" fill="#d8ceb3" />
      <path d="M-130 0 L130 0 Q110 55 70 60 L-70 60 Q-110 55 -130 0 Z" fill="#5a3e24" />
      <rect x={-130} y={-6} width={260} height={10} fill="#7a5632" />
    </g>
  );
};

// إطارات محلية: المشهد كله 690 إطاراً (0:44 – 1:07)
const T = TITLES.sea; // 0:44 – 0:47 عنوان الفصل
const COUNTER_START = 420; // ~0:58 عند ذكر "عشرة إلى اثني عشر يوماً"
const COUNTER_END = 640;

export const Scene3SeaCrossing: React.FC = () => {
  const frame = useCurrentFrame();

  // انتقال بصري: كشف دائري يتوسّع من أسفل الشاشة نحو البحر مع اختفاء بطاقة العنوان
  const reveal = interpolate(frame, [T - 20, T + 35], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // السفن تتحرك من اليمين (الشعيبة) إلى اليسار (الحبشة)
  const travel = interpolate(frame, [T, 660], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const ship1X = 1500 - travel * 900;
  const ship2X = 1750 - travel * 900;
  const coastIn = interpolate(travel, [0.65, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.midnight }}>
      <AbsoluteFill style={{ clipPath: `circle(${reveal}% at 50% 100%)` }}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#0a1a3a 0%,#123a6b 55%,#1b4f8a 100%)" }} />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 430,
            background: "radial-gradient(ellipse at 50% 100%, #ffffff18, transparent 70%)",
          }}
        />

        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <g opacity={coastIn}>
            <path d="M0 640 Q120 560 260 620 Q330 650 380 700 L380 1080 L0 1080 Z" fill="#2a3b2a" />
            <text x={170} y={600} fontSize={34} fill={COLORS.text} textAnchor="middle" fontWeight={700}>
              أرض الحبشة
            </text>
          </g>

          <path d={wavePath(frame, 10, 90, 0.05, 640)} fill="#1a4a82" opacity={0.7} />
          <Ship x={ship2X} y={650} frame={frame} scale={0.9} phase={2} />
          <path d={wavePath(frame, 14, 70, 0.07, 690)} fill="#1b4f8a" opacity={0.9} />
          <Ship x={ship1X} y={730} frame={frame} scale={1.2} phase={0} />
          <path d={wavePath(frame, 18, 110, 0.09, 770)} fill="#173f70" />
        </svg>

        <div style={{ position: "absolute", right: 110, top: 110, width: 600 }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.gold, marginBottom: 12 }}>العبور البحري</div>
          <div style={{ position: "relative", height: 100, marginBottom: 30 }}>
            <Caption from={T + 10} to={COUNTER_START + 12} style={{ fontSize: 32, color: "#c4d2ea", lineHeight: 1.7 }}>
              يسّر الله لهم سفينتين تجاريتين تشقّان البحر الأحمر
            </Caption>
            <Caption from={COUNTER_START} to={99999} style={{ fontSize: 32, color: "#c4d2ea", lineHeight: 1.7 }}>
              رحلة بحرية بحسب حركة الرياح
            </Caption>
          </div>
          <DayCounter from={10} to={12} startFrame={COUNTER_START} endFrame={COUNTER_END} label="الرحلة البحرية" />
        </div>
      </AbsoluteFill>

      <ChapterTitle number="الفصل الثالث" title="العبور البحري" dur={T} />
    </AbsoluteFill>
  );
};
