import React from "react";
import { motion } from "framer-motion";
import { Beer } from "lucide-react";

const PenaltiesTracker = ({ players, penalties, onPenaltyAdd, isDark }) => {
  const bgColor = isDark
    ? "from-violet-950 to-violet-950/80"
    : "from-white/80 to-white/90";
  const textColor = isDark ? "text-violet-200" : "text-gray-700";
  const bgCard = isDark ? "bg-white/5" : "bg-white/50";
  const borderColor = isDark ? "border-violet-500/20" : "border-violet-300/30";
  const subTextColor = isDark ? "text-violet-300/75" : "text-gray-500";
  const buttonBg = isDark
    ? "bg-violet-500/50 hover:bg-violet-500"
    : "bg-violet-400/50 hover:bg-violet-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t ${bgColor} backdrop-blur-md border-t ${borderColor} p-4`}
    >
      <div className="max-w-md mx-auto">
        <h3 className={`text-lg font-medium ${textColor} mb-3`}>
          Penalties Tracker
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {players.map((player) => (
            <motion.div
              key={player.id}
              className={`${bgCard} border ${borderColor} rounded-lg p-3 flex justify-between items-center`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <div className={`font-medium ${textColor}`}>{player.name}</div>
                <div className={`text-sm ${subTextColor}`}>
                  {penalties[player.id] || 0} drinks
                </div>
              </div>

              <button
                onClick={() => onPenaltyAdd(player.id)}
                className={`p-2 rounded-full ${buttonBg} transition-colors duration-300`}
              >
                <Beer size={16} className="text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PenaltiesTracker;
