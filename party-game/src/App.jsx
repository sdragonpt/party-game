import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { SoundProvider } from "./components/SoundProvider";
import PartyGame from "./components/PartyGame";
import ChallengeScreen from "./components/ChallengeScreen";
import PenaltiesTracker from "./components/PenaltiesTracker";
import GameSettings from "./components/GameSettings";
import { translations } from "./lib/translations";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [penalties, setPenalties] = useState({});
  const [settings, setSettings] = useState({
    isMuted: false,
    volume: 70,
    isDark: false, // Light mode por default
    challengeInterval: 30,
    language: "en",
  });

  const handlePenaltyAdd = (playerId) => {
    setPenalties((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
  };

  const handleSettingsChange = (key, value) => {
    console.log("Setting changed:", key, value); // Debug
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.isDark);
  }, [settings.isDark]);

  const baseColors = settings.isDark
    ? "from-violet-950 via-fuchsia-900 to-purple-950"
    : "from-violet-100 via-fuchsia-100 to-purple-100";

  const textColor = settings.isDark ? "text-white" : "text-gray-900";
  const borderColor = settings.isDark
    ? "border-violet-500/20"
    : "border-violet-300/30";
  const bgOverlay = settings.isDark ? "bg-black/5" : "bg-white/50";

  return (
    <SoundProvider>
      <div
        className={`min-h-screen bg-gradient-to-b ${baseColors} ${textColor}`}
      >
        <div
          className={`fixed inset-0 bg-[url('/patterns/topography.svg')] opacity-5 pointer-events-none`}
        />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: settings.isDark
                ? "rgba(139, 92, 246, 0.9)"
                : "rgba(139, 92, 246, 0.2)",
              color: settings.isDark ? "#fff" : "#1a1a1a",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            },
          }}
        />

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
          onLanguageChange={(value) => handleSettingsChange("language", value)} // Adicione esta linha
        />

        <div className="max-w-md mx-auto min-h-screen relative">
          <div
            className={`absolute inset-0 ${bgOverlay} pointer-events-none`}
          />

          <div className="relative">
            {!gameStarted ? (
              <PartyGame
                onStart={() => setGameStarted(true)}
                players={players}
                setPlayers={setPlayers}
                isDark={settings.isDark}
                language={settings.language}
              />
            ) : (
              <>
                <ChallengeScreen
                  players={players}
                  onEndGame={() => setGameStarted(false)}
                  challengeInterval={settings.challengeInterval}
                  isDark={settings.isDark}
                  language={settings.language}
                />
                <PenaltiesTracker
                  players={players}
                  penalties={penalties}
                  onPenaltyAdd={handlePenaltyAdd}
                  isDark={settings.isDark}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </SoundProvider>
  );
};

export default App;
