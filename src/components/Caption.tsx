import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  from: number; // إطار الظهور (محلي داخل المشهد)
  to: number; // إطار الاختفاء
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** سطر نصي يظهر ويختفي بين إطارين، لتبديل الشرح مع التعليق الصوتي */
export const Caption: React.FC<Props> = ({ from, to, style, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from, from + 12, to - 12, to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [from, from + 12], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};
