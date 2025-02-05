import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, SkipForward, ArrowLeft } from "lucide-react";
import { useSound } from "./SoundProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import _ from "lodash";
import { translations } from "../lib/translations";

const ChallengeScreen = ({ players, onEndGame, isDark, language }) => {
  const { playSound } = useSound();
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showTimer, setShowTimer] = useState(false);

  const textColor = isDark ? "text-violet-200" : "text-gray-700";
  const bgCard = isDark ? "bg-white/5" : "bg-white/50";
  const borderColor = isDark ? "border-violet-500/20" : "border-violet-300/30";
  const buttonHoverBg = isDark
    ? "hover:bg-violet-500/20"
    : "hover:bg-violet-100";

  const getRandomPlayers = () => {
    const males = players.filter((p) => p.gender === "male");
    const females = players.filter((p) => p.gender === "female");

    // Get unique random players
    const getUniqueRandomPlayers = (count) => {
      const selectedPlayers = [];
      const tempPlayers = [...players];

      for (let i = 0; i < count; i++) {
        if (tempPlayers.length === 0) break;
        const randomIndex = Math.floor(Math.random() * tempPlayers.length);
        selectedPlayers.push(tempPlayers.splice(randomIndex, 1)[0].name);
      }

      return selectedPlayers;
    };

    return {
      randomMale: _.sample(males)?.name || "",
      randomFemale: _.sample(females)?.name || "",
      randomPlayers: getUniqueRandomPlayers(3), // Get up to 3 unique random players
      males,
      females,
    };
  };

  const generateChallenge = () => {
    const { randomMale, randomFemale, randomPlayers, males, females } =
      getRandomPlayers();
    let challenge = _.sample(translations[language].challenges);

    // Count how many of each type of placeholder we need
    const boyCount = (challenge.match(/{boy}/g) || []).length;
    const girlCount = (challenge.match(/{girl}/g) || []).length;
    const randomCount = (challenge.match(/\{\}/g) || []).length;

    // Verify we have enough players of each gender
    if (boyCount > males.length || girlCount > females.length) {
      generateChallenge(); // Try another challenge if we don't have enough players
      return;
    }

    // Replace boy placeholders
    for (let i = 0; i < boyCount; i++) {
      const randomBoy =
        _.sample(males.filter((m) => !challenge.includes(m.name)))?.name || "";
      challenge = challenge.replace(/{boy}/, randomBoy);
    }

    // Replace girl placeholders
    for (let i = 0; i < girlCount; i++) {
      const randomGirl =
        _.sample(females.filter((f) => !challenge.includes(f.name)))?.name ||
        "";
      challenge = challenge.replace(/{girl}/, randomGirl);
    }

    // Replace random player placeholders
    let playerIndex = 0;
    while (challenge.includes("{}") && playerIndex < randomPlayers.length) {
      challenge = challenge.replace(/\{\}/, randomPlayers[playerIndex]);
      playerIndex++;
    }

    setCurrentChallenge(challenge);
    playSound("newChallenge");
  };

  const startTimer = () => {
    setShowTimer(true);
    setTimer(30);
    playSound("timerTick");
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0 && showTimer) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            playSound("timerEnd");
            setShowTimer(false);
            return null;
          } else if (prev <= 5) {
            playSound("timerTick");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, showTimer]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-6 mt-16">
        <Button
          variant="ghost"
          onClick={onEndGame}
          className={`${textColor} ${buttonHoverBg}`}
        >
          <ArrowLeft className="mr-2" /> End Game
        </Button>

        <Button
          variant="outline"
          onClick={startTimer}
          disabled={showTimer}
          className={`${textColor} border-violet-500/30 ${buttonHoverBg}`}
        >
          <Timer className="mr-2" /> Start Timer
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showTimer && (
          <motion.div
            key="timer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <div className={`text-6xl font-bold ${textColor}`}>{timer}s</div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card
        className={`${bgCard} border ${borderColor} backdrop-blur-sm overflow-hidden`}
      >
        <motion.div
          key={currentChallenge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <p className={`text-xl text-center ${textColor}`}>
            {currentChallenge}
          </p>
        </motion.div>
      </Card>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateChallenge}
        className={`w-full ${
          isDark
            ? "bg-violet-500 hover:bg-violet-600"
            : "bg-violet-400 hover:bg-violet-500"
        } p-4 rounded-lg flex items-center justify-center gap-2 text-white font-medium shadow-lg shadow-violet-500/25`}
      >
        <SkipForward /> Próximo Desafio
      </motion.button>
    </div>
  );
};

export default ChallengeScreen;
