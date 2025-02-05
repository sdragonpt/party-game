import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Howl } from "howler";

// Create context outside of any component
const SoundContext = createContext(null);

// Sound creation helper
const createSound = (src, defaultVolume = 0.5) => {
  try {
    return new Howl({
      src: [src],
      volume: defaultVolume,
      preload: true,
      html5: true,
      onloaderror: (id, error) =>
        console.error(`Error loading sound: ${src}`, error),
      onplayerror: (id, error) =>
        console.error(`Error playing sound: ${src}`, error),
    });
  } catch (error) {
    console.error(`Error creating Howl instance for ${src}:`, error);
    return null;
  }
};

// Main Provider Component
const SoundProvider = React.memo(function SoundProviderComponent({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const soundsRef = useRef({});

  useEffect(() => {
    soundsRef.current = {
      buttonClick: createSound("/sounds/click.mp3", 0.5),
      newChallenge: createSound("/sounds/new-challenge.mp3", 0.7),
      startParty: createSound("/sounds/party-start.mp3", 0.8),
      timerTick: createSound("/sounds/timer-tick.mp3", 0.3),
      timerEnd: createSound("/sounds/timer-end.mp3", 0.6),
      addPlayer: createSound("/sounds/player-added.mp3", 0.4),
    };

    return () => {
      Object.values(soundsRef.current).forEach((sound) => {
        if (sound && sound.unload) {
          sound.unload();
        }
      });
    };
  }, []);

  useEffect(() => {
    Object.values(soundsRef.current).forEach((sound) => {
      if (sound) {
        sound.volume(isMuted ? 0 : volume);
      }
    });
  }, [volume, isMuted]);

  const playSound = React.useCallback(
    (soundName) => {
      if (!isMuted && soundsRef.current[soundName]) {
        try {
          soundsRef.current[soundName].play();
        } catch (error) {
          console.error(`Error playing sound ${soundName}:`, error);
        }
      }
    },
    [isMuted]
  );

  const stopSound = React.useCallback((soundName) => {
    if (soundsRef.current[soundName]) {
      try {
        soundsRef.current[soundName].stop();
      } catch (error) {
        console.error(`Error stopping sound ${soundName}:`, error);
      }
    }
  }, []);

  const stopAllSounds = React.useCallback(() => {
    Object.values(soundsRef.current).forEach((sound) => {
      if (sound && sound.stop) {
        try {
          sound.stop();
        } catch (error) {
          console.error("Error stopping sound:", error);
        }
      }
    });
  }, []);

  const value = React.useMemo(
    () => ({
      playSound,
      stopSound,
      stopAllSounds,
      isMuted,
      setIsMuted,
      volume,
      setVolume,
    }),
    [playSound, stopSound, stopAllSounds, isMuted, volume]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
});

// Custom hook as a separate named function
function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}

// Export everything separately
export { SoundProvider };
export { useSound };
