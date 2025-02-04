// src/components/SoundProvider.jsx
import React, { createContext, useContext, useEffect } from "react";
import { Howl } from "howler";

const SoundContext = createContext();

export const sounds = {
  buttonClick: new Howl({
    src: ["/sounds/click.mp3"],
    volume: 0.5,
  }),
  newChallenge: new Howl({
    src: ["/sounds/new-challenge.mp3"],
    volume: 0.7,
  }),
  startParty: new Howl({
    src: ["/sounds/party-start.mp3"],
    volume: 0.8,
  }),
  timerTick: new Howl({
    src: ["/sounds/timer-tick.mp3"],
    volume: 0.3,
  }),
  timerEnd: new Howl({
    src: ["/sounds/timer-end.mp3"],
    volume: 0.6,
  }),
  addPlayer: new Howl({
    src: ["/sounds/player-added.mp3"],
    volume: 0.4,
  }),
};

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(0.7);

  useEffect(() => {
    // Atualiza o volume de todos os sons quando muda
    Object.values(sounds).forEach((sound) => {
      sound.volume(isMuted ? 0 : volume);
    });
  }, [volume, isMuted]);

  const playSound = (soundName) => {
    if (!isMuted && sounds[soundName]) {
      sounds[soundName].play();
    }
  };

  const stopSound = (soundName) => {
    if (sounds[soundName]) {
      sounds[soundName].stop();
    }
  };

  const stopAllSounds = () => {
    Object.values(sounds).forEach((sound) => sound.stop());
  };

  return (
    <SoundContext.Provider
      value={{
        playSound,
        stopSound,
        stopAllSounds,
        isMuted,
        setIsMuted,
        volume,
        setVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};

export default SoundProvider;
