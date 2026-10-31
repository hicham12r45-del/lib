import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";

/** يُظهر النص كلمة بكلمة بحركة Typography */
const WordReveal: React.FC<{
  text: string;
  start: number;
  perWord?: number;
  size: number;
  color?: string;
  dimAfter?: number;
}> = ({ text, start, perWord = 7, size, color = COLORS.text, dimAfter }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const dim =
    dimAfter !== undefined
      ? interpolate(frame, [dimAfter, dimAfter + 25], [1, 0.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

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
        const o = interpolate(frame, [s, s + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(frame, [s, s + 14], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span key={i} style={{ opacity: o, transform: `translateY(${y}px)`, display: "inline-block" }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${COLORS.deepBlue}, ${COLORS.midnight} 70%)`,
      }}
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

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: "0 220px", gap: 50 }}
      >
        <WordReveal
          text="حين طرحت على زملائي في الفصل سؤالاً تحدّيتهم فيه، عجز الجميع عن إجابته..."
          start={20}
          size={54}
          dimAfter={215}
        />
        <WordReveal
          text="فكم يا تُرى استغرقت حقاً رحلة الهجرة الأولى إلى أرض الحبشة؟"
          start={220}
          size={68}
          color={COLORS.gold}
          dimAfter={395}
        />
        <WordReveal
          text="سؤالٌ دفع أستاذ التربية الإسلامية لتكليفي بالبحث عن الحقيقة!"
          start={400}
          size={54}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
