import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

type Props = {
  duration: number;
  fadeIn?: number;
  fadeOut?: number;
  children: React.ReactNode;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * ظهور واختفاء ناعمان للمشهد. القيمة 0 تعني بلا تدرّج.
 * المشهد الداخل يظهر فوق الخارج (Cross-dissolve) لأن Sequence التالي يُرسم أعلى.
 */
export const Fade: React.FC<Props> = ({ duration, fadeIn = 20, fadeOut = 0, children }) => {
  const frame = useCurrentFrame();
  const a = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], clamp) : 1;
  const b = fadeOut > 0 ? interpolate(frame, [duration - fadeOut, duration], [1, 0], clamp) : 1;
  return <AbsoluteFill style={{ opacity: a * b }}>{children}</AbsoluteFill>;
};
