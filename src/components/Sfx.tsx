import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { SFX_GAIN } from "../constants";

type Props = {
  src: string; // اسم الملف داخل public/assets/audio/sfx
  from: number; // إطار البداية في الفيديو الكامل
  dur: number; // المدة بالإطارات
  level: number; // مستوى الصوت (0–1) قبل SFX_GAIN
  fadeIn?: number;
  fadeOut?: number;
  shape?: (f: number) => number; // تعديل إضافي للمستوى بحسب الإطار المحلي
};

/** مؤثر صوتي يبدأ عند إطار محدد مع تدرّج دخول وخروج */
export const Sfx: React.FC<Props> = ({ src, from, dur, level, fadeIn = 10, fadeOut = 20, shape }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <Audio
      src={staticFile(`assets/audio/sfx/${src}`)}
      volume={(f) => {
        const a = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
        const b = fadeOut > 0 ? interpolate(f, [dur - fadeOut, dur], [1, 0], { extrapolateLeft: "clamp" }) : 1;
        return Math.max(0, level * SFX_GAIN * a * b * (shape ? shape(f) : 1));
      }}
    />
  </Sequence>
);
