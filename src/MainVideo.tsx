import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SCENES, COLORS } from "./constants";
import { fontFamily } from "./fonts";
import { Fade } from "./components/Fade";
import { Scene1Intro } from "./components/Scene1Intro";
import { Scene2LandJourney } from "./components/Scene2LandJourney";
import { Scene3SeaCrossing } from "./components/Scene3SeaCrossing";
import { Scene4Conclusion } from "./components/Scene4Conclusion";

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

    <Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.dur}>
      <Fade duration={SCENES.intro.dur}>
        <Scene1Intro />
      </Fade>
    </Sequence>

    <Sequence from={SCENES.land.from} durationInFrames={SCENES.land.dur}>
      <Fade duration={SCENES.land.dur}>
        <Scene2LandJourney />
      </Fade>
    </Sequence>

    <Sequence from={SCENES.sea.from} durationInFrames={SCENES.sea.dur}>
      <Fade duration={SCENES.sea.dur}>
        <Scene3SeaCrossing />
      </Fade>
    </Sequence>

    <Sequence from={SCENES.end.from} durationInFrames={SCENES.end.dur}>
      <Fade duration={SCENES.end.dur} fadeOut={1}>
        <Scene4Conclusion />
      </Fade>
    </Sequence>
  </AbsoluteFill>
);
