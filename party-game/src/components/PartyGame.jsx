import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { useSound } from "./SoundProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PartyGame = ({ onStart, players, setPlayers, isDark }) => {
  const { playSound } = useSound();
  const [newPlayer, setNewPlayer] = useState({ name: "", gender: "" });

  const textColor = isDark ? "text-violet-200" : "text-gray-700";
  const bgCard = isDark ? "bg-white/5" : "bg-white/50";
  const borderColor = isDark ? "border-violet-500/20" : "border-violet-300/30";
  const inputBg = isDark ? "bg-white/10" : "bg-white/70";
  const placeholderColor = isDark
    ? "placeholder:text-violet-200/50"
    : "placeholder:text-gray-400";

  const addPlayer = (e) => {
    e.preventDefault();

    if (!newPlayer.name || !newPlayer.gender) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    setPlayers((prev) => [...prev, { ...newPlayer, id: Date.now() }]);
    setNewPlayer({ name: "", gender: "" });
    playSound("addPlayer");
    toast.success("Jogador adicionado!");
  };

  const removePlayer = (id) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
    toast.info("Jogador removido");
  };

  const handleStart = () => {
    if (players.length < 2) {
      toast.error("Você precisa de pelo menos 2 jogadores!");
      return;
    }

    const maleCount = players.filter((p) => p.gender === "male").length;
    const femaleCount = players.filter((p) => p.gender === "female").length;

    if (maleCount === 0 || femaleCount === 0) {
      toast.error("Você precisa de pelo menos um jogador de cada gênero!");
      return;
    }

    playSound("startParty");
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-6"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className={`text-4xl font-bold ${textColor}`}>🎉 Party Game</h1>
        <p className={isDark ? "text-violet-200/80" : "text-gray-600"}>
          Adicione jogadores para começar a diversão!
        </p>
      </motion.div>

      <Card className={`${bgCard} border ${borderColor} backdrop-blur-sm`}>
        <div className="p-6 space-y-4">
          <div className={`flex items-center gap-2 ${textColor}`}>
            <UserPlus className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Novo Jogador</h2>
          </div>

          <form onSubmit={addPlayer} className="space-y-4">
            <Input
              type="text"
              placeholder="Nome do jogador"
              value={newPlayer.name}
              onChange={(e) =>
                setNewPlayer({ ...newPlayer, name: e.target.value })
              }
              className={`${inputBg} border-violet-500/30 text-inherit ${placeholderColor}`}
            />

            <Select
              value={newPlayer.gender}
              onValueChange={(value) =>
                setNewPlayer({ ...newPlayer, gender: value })
              }
            >
              <SelectTrigger
                className={`${inputBg} border-violet-500/30 ${textColor}`}
              >
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent
                className={
                  isDark
                    ? "bg-violet-950 border-violet-500/30"
                    : "bg-white border-violet-300/30"
                }
              >
                <SelectItem value="male" className={textColor}>
                  Masculino
                </SelectItem>
                <SelectItem value="female" className={textColor}>
                  Feminino
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className={`w-full ${
                isDark
                  ? "bg-violet-500 hover:bg-violet-600"
                  : "bg-violet-400 hover:bg-violet-500"
              } text-white shadow-lg shadow-violet-500/25`}
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Jogador
            </Button>
          </form>
        </div>
      </Card>

      {players.length > 0 && (
        <Card
          className={`${bgCard} border ${borderColor} backdrop-blur-sm overflow-hidden`}
        >
          <div className="p-6 space-y-4">
            <div className={`flex items-center gap-2 ${textColor}`}>
              <Users className="w-5 h-5" />
              <h2 className="text-xl font-semibold">
                Jogadores ({players.length})
              </h2>
            </div>

            <div className="space-y-2">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex items-center justify-between ${
                    isDark ? "bg-violet-500/20" : "bg-violet-100/50"
                  } p-4 rounded-lg border ${borderColor}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {player.gender === "male" ? "👨" : "👩"}
                    </span>
                    <span className={textColor}>{player.name}</span>
                  </div>

                  <button
                    onClick={() => removePlayer(player.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-violet-500/30 transition-colors"
                  >
                    ❌
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {players.length >= 2 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-4"
        >
          <Button
            onClick={handleStart}
            className="w-full bg-emerald-500 hover:bg-emerald-600 h-14 text-lg font-medium shadow-lg shadow-emerald-500/25 text-white"
          >
            <Play className="w-6 h-6 mr-2" /> Começar o Jogo!
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PartyGame;
