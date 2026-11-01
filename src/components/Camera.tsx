import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

type Props = {
  dur: number; // مدة الحركة بالإطارات
  from?: number; // إطار البداية (محلي داخل المشهد)
  zoom?: [number, number]; // التقريب من → إلى
  pan?: [number, number]; // إزاحة كلية بالبكسل من البداية إلى النهاية
  origin?: string; // نقطة التقريب
  children: React.ReactNode;
};

/** حركة كاميرا بطيئة (تقريب + إزاحة) فوق محتوى المشهد */
export const Camera: React.FC<Props> = ({
  dur,
  from = 0,
  zoom = [1, 1.06],
  pan = [0, 0],
  origin = "50% 50%",
  children,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const s = zoom[0] + (zoom[1] - zoom[0]) * t;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${pan[0] * t}px, ${pan[1] * t}px) scale(${s})`,
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
