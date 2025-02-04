import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { useSound } from "./SoundProvider";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const challenges = [
  "{} choose a player to cup your ass for the next 5 rounds.",
  "{} write down something you'll do tomorrow and hide it. Let the other players guess. {} starts, the first to get it right can give out 2 penalties.",
  "Who likes foreplay more, {} or {}? They can give out 2 penalties.",
  // ... mais desafios do seu arquivo
];

const PartyGame = ({ onStart, players, setPlayers }) => {
  const { playSound } = useSound();
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    gender: "",
  });

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

  const removePlayer = (id) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
    toast.info("Jogador removido");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto space-y-6 p-4"
    >
      <div className="text-center">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold mb-2 text-pink-400"
        >
          🎉 Party Game
        </motion.h1>
        <p className="text-white/80">
          Adicione jogadores para começar a diversão!
        </p>
      </div>

      <Card className="bg-purple-900/30 border-none shadow-xl backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Novo Jogador</h2>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPlayer} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nome do jogador"
                value={newPlayer.name}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, name: e.target.value })
                }
                className="bg-white/20 border-white/30 placeholder:text-white/50"
              />
            </div>

            <Select
              value={newPlayer.gender}
              onValueChange={(value) =>
                setNewPlayer({ ...newPlayer, gender: value })
              }
            >
              <SelectTrigger className="bg-white/20 border-white/30">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Jogador
            </Button>
          </form>
        </CardContent>
      </Card>

      {players.length > 0 && (
        <Card className="bg-purple-900/30 border-0 border-transparent shadow-xl backdrop-blur-sm">
          <CardHeader className="">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Jogadores ({players.length})
              </h2>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center justify-between bg-pink-600/30 p-3 rounded-lg hover:bg-purple-700/40 transition-colors border border-pink-500/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {player.gender === "male" ? "👨" : "👩"}
                    </span>
                    <span className="text-purple-100 font-medium">
                      {player.name}
                    </span>
                  </div>

                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-2 hover:bg-pink-500/20 rounded-full transition-colors text-pink-400 hover:text-pink-300"
                  >
                    ❌
                  </button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {players.length >= 2 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            onClick={handleStart}
            className="w-full bg-emerald-500 hover:bg-emerald-600 h-14 text-lg"
          >
            <Play className="w-6 h-6 mr-2" /> Começar o Jogo!
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PartyGame;
