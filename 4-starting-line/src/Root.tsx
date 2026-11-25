import React from "react";
import { Composition } from "remotion";
import { timings } from "./data/timing";
import { Episode } from "./Episode";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Episode} defaultProps={{ part: "part1" as const }} durationInFrames={timings.part1.totalFrames} fps={timings.part1.fps} width={1080} height={1920} />
    <Composition id="Thumb" component={Thumbnail} durationInFrames={1} fps={30} width={1080} height={1920} />
  </>
);
