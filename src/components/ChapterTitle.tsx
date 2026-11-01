import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

type Props = {
  number: string; // مثال: "الفصل الأول"
  title: string; // مثال: "المقدمة والسؤال"
  dur: number; // مدة البطاقة الكبيرة بالإطارات
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * بطاقة عنوان الفصل: تظهر كبيرة في بداية المشهد (مع نطق العنوان)،
 * ثم تتلاشى ويبقى وسم صغير أعلى الشاشة طوال المشهد.
 */
export const ChapterTitle: React.FC<Props> = ({ number, title, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16 } });
  const overlay = interpolate(frame, [dur - 20, dur], [1, 0], clamp);
  const tag = interpolate(frame, [dur - 5, dur + 15], [0, 1], clamp);
  const lineW = interpolate(frame, [8, 40], [0, 360], clamp);

  return (
    <>
      {frame < dur && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 45%, ${COLORS.deepBlue}, ${COLORS.midnight} 75%)`,
            opacity: overlay,
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 46,
              color: COLORS.gold,
              opacity: enter,
              transform: `translateY(${(1 - enter) * 24}px)`,
              letterSpacing: 2,
            }}
          >
            {number}
          </div>
          <div style={{ height: 3, width: lineW, background: COLORS.gold, borderRadius: 2 }} />
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: COLORS.text,
              opacity: enter,
              transform: `scale(${0.9 + 0.1 * enter})`,
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      )}

      {/* وسم الفصل الصغير بعد اختفاء البطاقة */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 60,
          fontSize: 26,
          color: COLORS.muted,
          opacity: tag * 0.9,
          padding: "8px 22px",
          borderRadius: 20,
          border: `1px solid ${COLORS.gold}44`,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {number} · {title}
      </div>
    </>
  );
};
