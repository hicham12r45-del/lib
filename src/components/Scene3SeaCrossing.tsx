import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { COLORS, TITLES } from "../constants";
import { DayCounter } from "./DayCounter";
import { ChapterTitle } from "./ChapterTitle";
import { Caption } from "./Caption";
import { Camera } from "./Camera";
import { RedSeaMap } from "./RedSeaMap";
import { ADULIS, ROUTE_SEA, SHUAIBA, View, makeProject, smoothPath } from "../geo";

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

/** طائر بحري: جناحان يرفرفان */
const Bird: React.FC<{ x: number; y: number; frame: number; phase: number; s?: number }> = ({ x, y, frame, phase, s = 1 }) => {
  const w = Math.sin(frame * 0.28 + phase);
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d={`M-16 ${-6 * w} Q-8 ${-12 * w - 2} 0 0 Q8 ${-12 * w - 2} 16 ${-6 * w}`}
      fill="none"
      stroke="#cfd8ea"
      strokeWidth={3}
      strokeLinecap="round"
      opacity={0.75}
    />
  );
};

// ===== خريطة مصغّرة للمسار البحري =====
const IN_W = 340;
const IN_H = 474;
const IN_VIEW: View = { lon0: 36.2, lon1: 44.0, lat0: 12.0, lat1: 22.4 };
const { project: inProject } = makeProject(IN_VIEW, IN_W, IN_H);
const SEA_ROUTE = smoothPath(ROUTE_SEA.map(inProject));
const SEA_LEN = getLength(SEA_ROUTE);

// إطارات محلية: المشهد كله 690 إطاراً (0:44 – 1:07)
const T = TITLES.sea; // 0:44 – 0:47 عنوان الفصل
const COUNTER_START = 420; // ~0:58 عند ذكر "عشرة إلى اثني عشر يوماً"
const COUNTER_END = 640;
const SCENE_DUR = 690;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene3SeaCrossing: React.FC = () => {
  const frame = useCurrentFrame();

  // انتقال بصري: كشف دائري يتوسّع من أسفل الشاشة نحو البحر مع اختفاء بطاقة العنوان
  const reveal = interpolate(frame, [T - 20, T + 35], [0, 150], { ...clamp, easing: Easing.out(Easing.cubic) });

  // السفن تتحرك من اليمين (الشعيبة) إلى اليسار (الحبشة)
  const travel = interpolate(frame, [T, 660], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ship1X = 1500 - travel * 900;
  const ship2X = 1750 - travel * 900;
  const coastIn = interpolate(travel, [0.65, 1], [0, 1], clamp);
  const insetIn = interpolate(frame, [T + 25, T + 55], [0, 1], clamp);

  const dot = getPointAtLength(SEA_ROUTE, travel * SEA_LEN) ?? { x: 0, y: 0 };
  const s0 = inProject(SHUAIBA);
  const s1 = inProject(ADULIS);

  return (
    <AbsoluteFill style={{ background: COLORS.midnight }}>
      <AbsoluteFill style={{ clipPath: `circle(${reveal}% at 50% 100%)` }}>
        <Camera dur={SCENE_DUR} zoom={[1, 1.08]} pan={[-25, -8]} origin="65% 75%">
          <AbsoluteFill style={{ background: "linear-gradient(180deg,#0a1a3a 0%,#123a6b 55%,#1b4f8a 100%)" }} />

          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {/* نجوم وقمر وسحب (طبقة بعيدة بطيئة) */}
            {Array.from({ length: 60 }).map((_, i) => (
              <circle
                key={i}
                cx={random(`ssx-${i}`) * 1920}
                cy={random(`ssy-${i}`) * 420}
                r={0.8 + random(`ssr-${i}`) * 1.8}
                fill="#fff"
                opacity={0.3 + 0.4 * Math.sin(frame * 0.06 + i * 1.3)}
              />
            ))}
            <circle cx={960} cy={170} r={150} fill="#f4ecd0" opacity={0.05} />
            <circle cx={960} cy={170} r={95} fill="#f4ecd0" opacity={0.09} />
            <circle cx={960} cy={170} r={55} fill="#f6eed4" opacity={0.95} />
            {[0, 1, 2].map((i) => {
              const x = ((random(`cl-${i}`) * 2400 + frame * (0.25 + i * 0.12)) % 2400) - 240;
              return (
                <ellipse key={i} cx={x} cy={120 + i * 95} rx={230 - i * 30} ry={26} fill="#ffffff" opacity={0.07} />
              );
            })}
            {/* طيور */}
            {[0, 1, 2].map((i) => {
              const x = ((random(`bd-${i}`) * 2000 + frame * (1.4 + i * 0.4)) % 2200) - 150;
              return <Bird key={i} x={x} y={260 + i * 38 + Math.sin(frame * 0.03 + i) * 10} frame={frame} phase={i * 1.7} s={1 - i * 0.15} />;
            })}

            {/* ساحل الحبشة يظهر عند الاقتراب */}
            <g opacity={coastIn}>
              <path d="M0 640 Q120 560 260 620 Q330 650 380 700 L380 1080 L0 1080 Z" fill="#2a3b2a" />
              <text x={170} y={600} fontSize={34} fill={COLORS.text} textAnchor="middle" fontWeight={700}>
                سواحل الحبشة
              </text>
            </g>

            {/* انعكاس القمر على الماء */}
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse
                key={i}
                cx={960 + Math.sin(frame * 0.05 + i) * 10}
                cy={668 + i * 22}
                rx={72 - i * 3.5}
                ry={3}
                fill="#f4ecd0"
                opacity={0.32 - i * 0.02}
              />
            ))}

            <path d={wavePath(frame, 10, 90, 0.05, 640)} fill="#1a4a82" opacity={0.7} />
            <Ship x={ship2X} y={650} frame={frame} scale={0.9} phase={2} />
            <path d={wavePath(frame, 14, 70, 0.07, 690)} fill="#1b4f8a" opacity={0.9} />
            <Ship x={ship1X} y={730} frame={frame} scale={1.2} phase={0} />
            <path d={wavePath(frame, 18, 110, 0.09, 770)} fill="#173f70" />
          </svg>
        </Camera>

        {/* خريطة مصغّرة للمسار (ثابتة، خارج حركة الكاميرا) */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 90,
            width: IN_W,
            height: IN_H,
            opacity: insetIn,
            borderRadius: 24,
            overflow: "hidden",
            border: `2px solid ${COLORS.gold}55`,
            boxShadow: "0 12px 50px #00000077",
          }}
        >
          <RedSeaMap w={IN_W} h={IN_H} view={IN_VIEW} seaLabel={[38.9, 17.9]} labelSize={20}>
            {() => (
              <g>
                <path d={SEA_ROUTE} fill="none" stroke="#ffffff40" strokeWidth={3} strokeDasharray="6 7" />
                <circle cx={s0[0]} cy={s0[1]} r={7} fill={COLORS.gold} />
                <text x={s0[0] + 2} y={s0[1] - 14} fontSize={20} fill={COLORS.text} textAnchor="middle" fontWeight={700}>
                  الشعيبة
                </text>
                <circle cx={s1[0]} cy={s1[1]} r={7} fill={COLORS.gold} />
                <text x={s1[0] - 10} y={s1[1] + 32} fontSize={20} fill={COLORS.text} textAnchor="middle" fontWeight={700}>
                  سواحل الحبشة
                </text>
                <circle cx={dot.x} cy={dot.y} r={16} fill={COLORS.gold} opacity={0.25} />
                <circle cx={dot.x} cy={dot.y} r={7} fill="#fff" />
              </g>
            )}
          </RedSeaMap>
        </div>

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
