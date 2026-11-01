import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate } from "remotion";
import { SCENES, COLORS, TRANSITION } from "./constants";
import { fontFamily } from "./fonts";
import { Fade } from "./components/Fade";
import { Sfx } from "./components/Sfx";
import { Scene1Intro } from "./components/Scene1Intro";
import { Scene2LandJourney } from "./components/Scene2LandJourney";
import { Scene3SeaCrossing } from "./components/Scene3SeaCrossing";
import { Scene4Conclusion } from "./components/Scene4Conclusion";

const OV = TRANSITION;

export const MainVideo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: COLORS.midnight,
      fontFamily,
      direction: "rtl",
      color: COLORS.text,
    }}
  >
    {/* التعليق الصوتي يبدأ من الإطار 0 */}
    <Audio src={staticFile("assets/audio/voiceover.mp3")} />

    {/* ===== المشاهد: كل مشهد يمتد OV إطاراً فوق بداية التالي لعمل تداخل ناعم ===== */}
    <Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.dur + OV}>
      <Fade duration={SCENES.intro.dur + OV} fadeIn={15}>
        <Scene1Intro />
      </Fade>
    </Sequence>

    <Sequence from={SCENES.land.from} durationInFrames={SCENES.land.dur + OV}>
      <Fade duration={SCENES.land.dur + OV} fadeIn={OV}>
        <Scene2LandJourney />
      </Fade>
    </Sequence>

    <Sequence from={SCENES.sea.from} durationInFrames={SCENES.sea.dur + OV}>
      <Fade duration={SCENES.sea.dur + OV} fadeIn={OV}>
        <Scene3SeaCrossing />
      </Fade>
    </Sequence>

    <Sequence from={SCENES.end.from} durationInFrames={SCENES.end.dur}>
      <Fade duration={SCENES.end.dur} fadeIn={OV} fadeOut={25}>
        <Scene4Conclusion />
      </Fade>
    </Sequence>

    {/* ===== المؤثرات الصوتية (المستويات منخفضة تحت التعليق؛ SFX_GAIN في constants.ts) ===== */}
    {/* whoosh عند بداية كل فصل */}
    <Sfx src="whoosh.wav" from={SCENES.intro.from} dur={50} level={0.25} fadeIn={2} fadeOut={15} />
    <Sfx src="whoosh.wav" from={SCENES.land.from + 2} dur={50} level={0.3} fadeIn={2} fadeOut={15} />
    <Sfx src="whoosh.wav" from={SCENES.sea.from + 2} dur={50} level={0.3} fadeIn={2} fadeOut={15} />
    <Sfx src="whoosh.wav" from={SCENES.end.from + 2} dur={50} level={0.3} fadeIn={2} fadeOut={15} />

    {/* المسار البري: رياح الليل + صراصير + خطوات (أعلى في اللقطة القريبة) */}
    <Sfx src="wind.wav" from={SCENES.land.from} dur={SCENES.land.dur + OV} level={0.1} fadeIn={30} fadeOut={30} />
    <Sfx src="crickets.wav" from={SCENES.land.from + 20} dur={SCENES.land.dur - 20} level={0.05} fadeIn={40} fadeOut={40} />
    <Sfx
      src="footsteps.wav"
      from={SCENES.land.from + 130}
      dur={500}
      level={0.2}
      fadeIn={20}
      fadeOut={30}
      shape={(f) => interpolate(f, [50, 90, 310, 350], [0.3, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />

    {/* العبور البحري: أمواج + صرير خشب السفينة + رياح خفيفة */}
    <Sfx src="waves.wav" from={SCENES.sea.from + 60} dur={SCENES.sea.dur - 60 + OV} level={0.22} fadeIn={40} fadeOut={40} />
    <Sfx src="creak.wav" from={SCENES.sea.from + 120} dur={540} level={0.08} fadeIn={30} fadeOut={30} />
    <Sfx src="wind.wav" from={SCENES.sea.from + 60} dur={SCENES.sea.dur - 60} level={0.06} fadeIn={40} fadeOut={40} />

    {/* النتيجة النهائية */}
    <Sfx src="impact.wav" from={SCENES.end.from + 195} dur={75} level={0.3} fadeIn={1} fadeOut={20} />
  </AbsoluteFill>
);
