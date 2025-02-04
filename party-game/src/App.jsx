import React, { useState } from "react";
import { Toaster } from "sonner";
import { SoundProvider } from "./components/SoundProvider";
import PartyGame from "./components/PartyGame";
import ChallengeScreen from "./components/ChallengeScreen";
import PenaltiesTracker from "./components/PenaltiesTracker";
import GameSettings from "./components/GameSettings";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [penalties, setPenalties] = useState({});
  const [settings, setSettings] = useState({
    isMuted: false,
    volume: 70,
    isDark: true,
    challengeInterval: 30,
  });

  const handlePenaltyAdd = (playerId) => {
    setPenalties((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
  };

  const handleSettingsChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SoundProvider>
      <div className={`min-h-screen ${settings.isDark ? "dark" : ""}`}>
        <Toaster position="top-center" />

        <GameSettings
          {...settings}
          onMuteToggle={() =>
            handleSettingsChange("isMuted", !settings.isMuted)
          }
          onVolumeChange={(value) => handleSettingsChange("volume", value)}
          onThemeToggle={() => handleSettingsChange("isDark", !settings.isDark)}
          onIntervalChange={(value) =>
            handleSettingsChange("challengeInterval", value)
          }
        />

        {!gameStarted ? (
          <PartyGame
            onStart={() => setGameStarted(true)}
            players={players}
            setPlayers={setPlayers}
          />
        ) : (
          <>
            <ChallengeScreen
              players={players}
              onEndGame={() => setGameStarted(false)}
              challengeInterval={settings.challengeInterval}
            />
            <PenaltiesTracker
              players={players}
              penalties={penalties}
              onPenaltyAdd={handlePenaltyAdd}
            />
          </>
        )}
      </div>
    </SoundProvider>
  );
};

export default App;
