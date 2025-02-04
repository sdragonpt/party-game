import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, SkipForward, ArrowLeft } from "lucide-react";
import { useSound } from "./SoundProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import _ from "lodash";

const challenges = [
  // Aqui vão todos os desafios do arquivo
  "{} choose a player to cup your ass for the next 5 rounds.",
  "{} write down something you'll do tomorrow and hide it. Let the other players guess. {} starts, the first to get it right can give out 2 penalties.",
  // ... mais desafios
];

const ChallengeScreen = ({ players, onEndGame }) => {
  const { playSound } = useSound();
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showTimer, setShowTimer] = useState(false);

  const getRandomPlayers = () => {
    const males = players.filter((p) => p.gender === "male");
    const females = players.filter((p) => p.gender === "female");

    return {
      randomMale: _.sample(males)?.name || "",
      randomFemale: _.sample(females)?.name || "",
      randomPlayer: _.sample(players)?.name || "",
    };
  };

  const generateChallenge = () => {
    const { randomMale, randomFemale, randomPlayer } = getRandomPlayers();
    let challenge = _.sample(challenges);

    // Replace placeholders with player names
    challenge = challenge
      .replace(/{boy}/g, randomMale)
      .replace(/{girl}/g, randomFemale)
      .replace(/\{\}/g, randomPlayer);

    setCurrentChallenge(challenge);
    playSound("newChallenge");
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const startTimer = () => {
    setShowTimer(true);
    setTimer(30); // 30 segundos por padrão
    playSound("timerTick");
  };

  useEffect(() => {
    let interval;
    if (timer > 0 && showTimer) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            playSound("timerEnd");
            setShowTimer(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onEndGame} className="text-white">
          <ArrowLeft className="mr-2" /> End Game
        </Button>
        <Button
          variant="outline"
          onClick={startTimer}
          disabled={showTimer}
          className="text-white border-white/20"
        >
          <Timer className="mr-2" /> Start Timer
        </Button>
      </div>

      {showTimer && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-4xl font-bold mb-4">{timer}s</div>
        </motion.div>
      )}

      <Card className="bg-white/10 border-none p-6">
        <motion.p
          key={currentChallenge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-center mb-4"
        >
          {currentChallenge}
        </motion.p>
      </Card>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateChallenge}
        className="w-full bg-purple-500 hover:bg-purple-600 p-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
      >
        <SkipForward /> Next Challenge
      </motion.button>
    </motion.div>
  );
};

export default ChallengeScreen;
