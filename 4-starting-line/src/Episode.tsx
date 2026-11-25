import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./anim";
import { Captions } from "./components/Captions";
import { Background, SceneWrapper, Sfx, TopBadge } from "./components/Layout";
import { assetsReady, PartId, timings } from "./data/timing";
import { AttackScene, HideScene, HookScene, MinusScene, NumberScene, OutroScene, PaperScene } from "./scenes/Scenes";
import { display } from "./theme";

const SCENES: Record<string, React.FC<{ duration: number }>> = {
  hook: HookScene,
  hide: HideScene,
  paper: PaperScene,
  attack: AttackScene,
  number: NumberScene,
  minus: MinusScene,
  outro: OutroScene,
};

const MUSIC_VOL = 0.3;
const MUSIC_DUCKED = 0.13;

export const Episode: React.FC<{ part: PartId }> = ({ part }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timing = timings[part];
  const leadFrames = Math.round(timing.lead * fps);
  const realize = timing.scenes.find((s) => s.id === "minus");
  const dawn = realize ? interpolate(frame, [realize.startFrame, durationInFrames - 20], [0, 0.85], clamp) : 0;

  const speech = (f: number) => {
    let a = 0;
    for (const s of timing.scenes) {
      const st = s.startFrame + timing.lead * fps;
      const en = st + s.voDuration * fps;
      a = Math.max(a, interpolate(f, [st - 8, st, en, en + 12], [0, 1, 1, 0], clamp));
    }
    return a;
  };

  return (
    <AbsoluteFill style={{ fontFamily: display }}>
      <Background dawn={dawn} />
      {timing.scenes.map((s, i) => {
        const Scene = SCENES[s.id];
        return (
          <Sequence key={s.id} name={s.id} from={s.startFrame} durationInFrames={s.durationInFrames}>
            <SceneWrapper duration={s.durationInFrames}>{Scene ? <Scene duration={s.durationInFrames} /> : null}</SceneWrapper>
            <Captions scene={s} lead={timing.lead} />
            {timing.generated && (
              <Sequence from={leadFrames} layout="none" name={`vo-${s.id}`}>
                <Audio src={staticFile(s.audio)} />
              </Sequence>
            )}
            {i > 0 && <Sfx at={0} name="whoosh" volume={0.22} />}
          </Sequence>
        );
      })}
      <TopBadge label="COMEBACK STRONGER" />
      {assetsReady && (
        <Audio
          src={staticFile("audio/backsound.wav")}
          volume={(f: number) =>
            interpolate(f, [0, 15, durationInFrames - 40, durationInFrames - 1], [0, 1, 1, 0], clamp) *
            (MUSIC_VOL - (MUSIC_VOL - MUSIC_DUCKED) * speech(f))
          }
        />
      )}
    </AbsoluteFill>
  );
};
