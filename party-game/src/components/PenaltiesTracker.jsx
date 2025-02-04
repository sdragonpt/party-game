import React from "react";
import { motion } from "framer-motion";
import { Beer } from "lucide-react";
import { Card } from "@/components/ui/card";

const PenaltiesTracker = ({ players, penalties, onPenaltyAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-4"
    >
      <div className="max-w-md mx-auto">
        <h3 className="text-lg mb-3">Penalties</h3>
        <div className="grid grid-cols-2 gap-2">
          {players.map((player) => (
            <Card
              key={player.id}
              className="bg-white/10 border-none p-3 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{player.name}</div>
                <div className="text-sm opacity-75">
                  {penalties[player.id] || 0} drinks
                </div>
              </div>
              <button
                onClick={() => onPenaltyAdd(player.id)}
                className="p-2 rounded-full bg-purple-500/50 hover:bg-purple-500"
              >
                <Beer size={16} />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PenaltiesTracker;
