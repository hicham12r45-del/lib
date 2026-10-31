import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

type Props = {
  from: number;
  to: number;
  startFrame: number;
  endFrame: number;
  label: string;
};

/** عداد أيام يتصاعد مع شريط تقدّم */
export const DayCounter: React.FC<Props> = ({ from, to, startFrame, endFrame, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const raw = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const value = Math.round(raw);
  const progress = (raw - from) / (to - from);

  const enter = spring({ frame: frame - (startFrame - 20), fps, config: { damping: 14 } });

  return (
    <div
      style={{
        transform: `scale(${0.8 + 0.2 * enter})`,
        opacity: enter,
        textAlign: "center",
        padding: "40px 56px",
        borderRadius: 32,
        background: "rgba(255,255,255,0.06)",
        border: `2px solid ${COLORS.gold}55`,
        width: 460,
      }}
    >
      <div style={{ fontSize: 28, color: COLORS.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 180, fontWeight: 900, color: COLORS.gold, lineHeight: 1 }}>
        {value.toLocaleString("ar-EG")}
      </div>
      <div style={{ fontSize: 40, marginTop: 8 }}>يوم</div>
      <div style={{ height: 10, borderRadius: 5, background: "#ffffff22", marginTop: 28 }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
            borderRadius: 5,
            background: COLORS.gold,
          }}
        />
      </div>
    </div>
  );
};
