import React from "react";
import { motion } from "framer-motion";
import { Settings, Volume2, VolumeX, Sun, Moon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const GameSettings = ({
  isMuted,
  onMuteToggle,
  volume,
  onVolumeChange,
  isDark,
  onThemeToggle,
  challengeInterval,
  onIntervalChange,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="fixed top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20">
          <Settings size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-b from-purple-900/90 to-blue-900/90 backdrop-blur-lg border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Game Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sound Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isMuted ? <VolumeX /> : <Volume2 />}
              <span>Sound</span>
            </div>
            <Switch checked={!isMuted} onCheckedChange={() => onMuteToggle()} />
          </div>

          {/* Volume Slider */}
          <div className="space-y-2">
            <label className="text-sm">Volume</label>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={([value]) => onVolumeChange(value)}
              disabled={isMuted}
            />
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? <Moon /> : <Sun />}
              <span>Dark Mode</span>
            </div>
            <Switch checked={isDark} onCheckedChange={onThemeToggle} />
          </div>

          {/* Challenge Interval */}
          <div className="space-y-2">
            <label className="text-sm">Challenge Timer (seconds)</label>
            <Slider
              value={[challengeInterval]}
              min={15}
              max={60}
              step={5}
              className="w-full"
              onValueChange={([value]) => onIntervalChange(value)}
            />
            <div className="text-sm text-center">
              {challengeInterval} seconds
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettings;
