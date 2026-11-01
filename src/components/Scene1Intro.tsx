import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COLORS, TITLES } from "../constants";
import { ChapterTitle } from "./ChapterTitle";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * يُظهر النص كلمة بكلمة. تتوزع الكلمات على ~70% من نافذة الجملة
 * (من start إلى end) لتنتهي قبل انتهاء نطقها بقليل.
 */
const WordReveal: React.FC<{
  text: string;
  start: number;
  end: number;
  size: number;
  color?: string;
  dimAfter?: number;
}> = ({ text, start, end, size, color = COLORS.text, dimAfter }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const perWord = (end - start) * 0.7 / words.length;
  const dim =
    dimAfter !== undefined ? interpolate(frame, [dimAfter, dimAfter + 25], [1, 0.4], clamp) : 1;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 18px",
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.6,
        color,
        opacity: dim,
      }}
    >
      {words.map((w, i) => {
        const s = start + i * perWord;
        const o = interpolate(frame, [s, s + 14], [0, 1], clamp);
        const y = interpolate(frame, [s, s + 14], [30, 0], clamp);
        return (
          <span key={i} style={{ opacity: o, transform: `translateY(${y}px)`, display: "inline-block" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// نوافذ الجمل (إطارات محلية): 0:03–0:10 ، 0:10–0:16 ، 0:16–0:22
const L1 = { start: 90, end: 300 };
const L2 = { start: 300, end: 480 };
const L3 = { start: 480, end: 660 };

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(circle at 50% 40%, ${COLORS.deepBlue}, ${COLORS.midnight} 70%)` }}
    >
      {/* جزيئات عائمة خفيفة في الخلفية */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const x = random(`px-${i}`) * 1920;
          const baseY = random(`py-${i}`) * 1080;
          const y = (baseY - frame * (0.2 + random(`ps-${i}`) * 0.4) + 1080) % 1080;
          return <circle key={i} cx={x} cy={y} r={1 + random(`pr-${i}`) * 2.5} fill={COLORS.gold} opacity={0.25} />;
        })}
      </svg>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 220px", gap: 50 }}>
        <WordReveal
          text="حين طرحت على زملائي في الفصل سؤالاً تحدّيتهم فيه، عجز الجميع عن إجابته..."
          start={L1.start}
          end={L1.end}
          size={54}
          dimAfter={L2.start}
        />
        <WordReveal
          text="فكم يا تُرى استغرقت حقاً رحلة الهجرة الأولى إلى أرض الحبشة؟"
          start={L2.start}
          end={L2.end}
          size={68}
          color={COLORS.gold}
          dimAfter={L3.start}
        />
        <WordReveal
          text="سؤالٌ دفع أستاذ التربية الإسلامية لتكليفي بالبحث عن الحقيقة!"
          start={L3.start}
          end={L3.end}
          size={54}
        />
      </AbsoluteFill>

      <ChapterTitle number="الفصل الأول" title="المقدمة والسؤال" dur={TITLES.intro} />
    </AbsoluteFill>
  );
};
