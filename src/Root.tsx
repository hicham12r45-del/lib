import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { FPS, TOTAL_FRAMES } from "./constants";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HabashaJourney"
    component={MainVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
