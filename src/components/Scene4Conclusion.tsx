import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, TITLES } from "../constants";
import { ChapterTitle } from "./ChapterTitle";
import { Camera } from "./Camera";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// إطارات محلية: المشهد كله 540 إطاراً (1:07 – 1:25)
const T = TITLES.end; // 1:07 – 1:11 عنوان الفصل
const QUESTION = T + 5; // يظهر السؤال بعد العنوان
const CHIPS = 150; // ~1:12 تفصيل البر والبحر
const RESULT = 195; // 1:13.5 "ما بين أسبوعين إلى ثلاثة أسابيع"
const REFS = 390; // 1:20 "حقيقة تاريخية... سيرة ابن هشام"

export const Scene4Conclusion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = spring({ frame: frame - QUESTION, fps, config: { damping: 12 } });
  const chips = spring({ frame: frame - CHIPS, fps, config: { damping: 15 } });
  const result = spring({ frame: frame - RESULT, fps, config: { damping: 10, mass: 1.2 } });
  const refs = interpolate(frame, [REFS, REFS + 30], [0, 1], clamp);

  return (
    <AbsoluteFill>
    <Camera dur={540} zoom={[1, 1.04]}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${COLORS.deepBlue}, ${COLORS.midnight} 75%)`,
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
      }}
    >
      <div style={{ fontSize: 52, color: COLORS.muted, opacity: title, transform: `translateY(${(1 - title) * 30}px)` }}>
        إذن، كم استغرقت الرحلة؟
      </div>

      {/* تفصيل الرحلة */}
      <div style={{ display: "flex", gap: 40, opacity: chips, transform: `scale(${0.9 + 0.1 * chips})` }}>
        {[
          { t: "البر", v: "٣ – ٤ أيام" },
          { t: "البحر", v: "١٠ – ١٢ يوماً" },
        ].map((c) => (
          <div
            key={c.t}
            style={{
              padding: "18px 44px",
              borderRadius: 24,
              border: `2px solid ${COLORS.gold}55`,
              background: "rgba(255,255,255,0.05)",
              fontSize: 38,
              textAlign: "center",
            }}
          >
            <div style={{ color: COLORS.muted, fontSize: 28 }}>{c.t}</div>
            {c.v}
          </div>
        ))}
      </div>

      {/* النتيجة النهائية */}
      <div
        style={{
          fontSize: 130,
          fontWeight: 900,
          color: COLORS.gold,
          opacity: result,
          transform: `scale(${0.6 + 0.4 * result})`,
          textShadow: `0 0 60px ${COLORS.gold}55`,
        }}
      >
        أسبوعان إلى ٣ أسابيع
      </div>

      {/* حقيقة تاريخية + المراجع */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: refs,
          textAlign: "center",
          borderTop: "1px solid #ffffff22",
          paddingTop: 20,
          width: 1200,
        }}
      >
        <div style={{ fontSize: 34, color: COLORS.text, marginBottom: 10 }}>حقيقة تاريخية وثّقتها كتب السيرة العريقة</div>
        <div style={{ fontSize: 30, color: COLORS.muted }}>
          المصادر: سيرة ابن هشام &nbsp;•&nbsp; الطبقات الكبرى لابن سعد
        </div>
      </div>

    </AbsoluteFill>
    </Camera>

      <ChapterTitle number="الفصل الرابع" title="الخلاصة والمصادر" dur={T} />
    </AbsoluteFill>
  );
};
