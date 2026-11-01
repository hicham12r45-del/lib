import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { COLORS, TITLES } from "../constants";
import { DayCounter } from "./DayCounter";
import { Figure } from "./Figure";
import { ChapterTitle } from "./ChapterTitle";
import { Caption } from "./Caption";
import { Camera } from "./Camera";
import { RedSeaMap } from "./RedSeaMap";
import { CaravanCloseUp } from "./CaravanCloseUp";
import { JEDDAH, MECCA, ROUTE_LAND, SHUAIBA, View, makeProject, smoothPath } from "../geo";

// ===== الخريطة: منطقة مكة ← الشعيبة (إحداثيات تقريبية) =====
const MAP_W = 1100;
const MAP_H = 800;
const VIEW: View = { lon0: 38.5, lon1: 41.1, lat0: 20.15, lat1: 21.92 };
const { project } = makeProject(VIEW, MAP_W, MAP_H);
const ROUTE = smoothPath(ROUTE_LAND.map(project));
const ROUTE_LEN = getLength(ROUTE);

// ===== التوقيت (إطارات محلية: المشهد 660 إطاراً = 0:22 – 0:44) =====
const T = TITLES.land; // 0:22 – 0:26 عنوان الفصل
const PHASE2 = 510; // 0:39 "مسافة قطعتها القافلة..."
const WALK_START = 130;
const WALK_END = 630;
const CLOSE_START = 200; // لقطة القافلة القريبة "ليلاً وبسرية تامة"
const CLOSE_END = 460;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene2LandJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const walk = interpolate(frame, [WALK_START, WALK_END], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(walk, ROUTE);
  const mapIn = spring({ frame: frame - (T - 20), fps, config: { damping: 18 } });
  const closeOp = interpolate(frame, [CLOSE_START, CLOSE_START + 25, CLOSE_END - 25, CLOSE_END], [0, 1, 1, 0], clamp);

  const mecca = project(MECCA);
  const shuaiba = project(SHUAIBA);
  const jeddah = project(JEDDAH);

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

      {/* الخريطة مع حركة كاميرا بطيئة */}
      <Camera dur={SCENES_LAND_DUR} zoom={[1, 1.1]} pan={[-20, -10]} origin="32% 50%">
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 140,
            width: MAP_W,
            height: MAP_H,
            opacity: mapIn,
            transform: `scale(${0.92 + 0.08 * mapIn})`,
            borderRadius: 28,
            overflow: "hidden",
            border: `2px solid ${COLORS.gold}33`,
            boxShadow: "0 20px 80px #00000066",
          }}
        >
          <RedSeaMap w={MAP_W} h={MAP_H} view={VIEW} seaLabel={[38.88, 21.1]} labelSize={30}>
            {() => (
              <g>
                {/* المسار */}
                <path d={ROUTE} fill="none" stroke="#ffffff30" strokeWidth={3} strokeDasharray="6 8" />
                <path
                  d={ROUTE}
                  fill="none"
                  stroke={COLORS.gold}
                  strokeWidth={5}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />

                {/* جدة (مرجع) */}
                <circle cx={jeddah[0]} cy={jeddah[1]} r={5} fill="#9aa6c0" />
                <text x={jeddah[0] - 8} y={jeddah[1] - 14} fontSize={22} fill="#9aa6c0" textAnchor="middle">
                  جدة
                </text>

                {/* المدن */}
                {[
                  { p: mecca, name: "مكة المكرمة" },
                  { p: shuaiba, name: "ميناء الشعيبة" },
                ].map(({ p, name }) => (
                  <g key={name}>
                    <circle cx={p[0]} cy={p[1]} r={9} fill={COLORS.gold} />
                    <circle
                      cx={p[0]}
                      cy={p[1]}
                      r={9 + (frame % 60) / 2.5}
                      fill="none"
                      stroke={COLORS.gold}
                      opacity={1 - (frame % 60) / 60}
                      strokeWidth={2}
                    />
                    <text x={p[0]} y={p[1] + 38} fontSize={30} fill={COLORS.text} textAnchor="middle" fontWeight={700}>
                      {name}
                    </text>
                  </g>
                ))}

                {/* القافلة: 5 شخصيات بلا ملامح */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const progress = Math.max(0, Math.min(1, walk - i * 0.03));
                  const pt = getPointAtLength(ROUTE, progress * ROUTE_LEN) ?? { x: mecca[0], y: mecca[1] };
                  return (
                    <Figure
                      key={i}
                      x={pt.x}
                      y={pt.y - 38}
                      frame={frame}
                      scale={0.38}
                      phase={i * 1.3}
                      color={i % 2 ? "#cfc7b0" : "#e3dcc8"}
                    />
                  );
                })}
              </g>
            )}
          </RedSeaMap>
        </div>
      </Camera>

      {/* لقطة القافلة القريبة (تتداخل فوق الخريطة) */}
      {closeOp > 0 && (
        <AbsoluteFill style={{ opacity: closeOp }}>
          <CaravanCloseUp start={CLOSE_START} dur={CLOSE_END - CLOSE_START} />
        </AbsoluteFill>
      )}

      {/* العنوان + الشرح + العداد */}
      <div style={{ position: "absolute", right: 110, top: 150, width: 600 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.gold, marginBottom: 12 }}>الانطلاقة سراً</div>
        <div style={{ position: "relative", height: 120, marginBottom: 30 }}>
          <Caption from={T} to={PHASE2 + 12} style={{ fontSize: 32, color: COLORS.muted, lineHeight: 1.7 }}>
            في رجب من السنة الخامسة للبعثة، من مكة المكرمة نحو ميناء الشعيبة، مسيرٌ ليلاً
          </Caption>
          <Caption from={PHASE2} to={99999} style={{ fontSize: 32, color: COLORS.muted, lineHeight: 1.7 }}>
            قطعتها القافلة مشياً وركوباً في نحو ثلاثة إلى أربعة أيام
          </Caption>
        </div>
        <DayCounter from={1} to={4} startFrame={WALK_START} endFrame={WALK_END} label="المسار البري" />
      </div>

      <ChapterTitle number="الفصل الثاني" title="الانطلاقة والمسار البري" dur={T} />
    </AbsoluteFill>
  );
};

// مدة المشهد الكلية (لحركة الكاميرا)
const SCENES_LAND_DUR = 660;
