import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

type Props = {
  duration: number;
  fadeIn?: number;
  fadeOut?: number;
  children: React.ReactNode;
};

/** يضيف ظهوراً واختفاءً ناعمين للمشهد (الإطار هنا محلي داخل Sequence) */
export const Fade: React.FC<Props> = ({
  duration,
  fadeIn = 20,
  fadeOut = 20,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
