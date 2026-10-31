import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

export const Scene4Conclusion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const chips = spring({ frame: frame - 45, fps, config: { damping: 15 } });
  const result = spring({ frame: frame - 80, fps, config: { damping: 10, mass: 1.2 } });
  const refs = interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
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
          { t: "البر", v: "١ – ٤ أيام" },
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

      {/* المراجع أسفل الشاشة */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          opacity: refs,
          fontSize: 30,
          color: COLORS.muted,
          textAlign: "center",
          borderTop: "1px solid #ffffff22",
          paddingTop: 20,
          width: 1200,
        }}
      >
        المصادر: سيرة ابن هشام &nbsp;•&nbsp; الطبقات الكبرى لابن سعد
      </div>
    </AbsoluteFill>
  );
};
