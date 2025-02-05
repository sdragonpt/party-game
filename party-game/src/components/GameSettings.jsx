import React from "react";
import { Settings, Volume2, VolumeX, Sun, Moon, Globe } from "lucide-react";
import { useSound } from "./SoundProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GameSettings = ({
  isMuted,
  onMuteToggle,
  volume,
  onVolumeChange,
  isDark,
  onThemeToggle,
  challengeInterval,
  onIntervalChange,
  language,
  onLanguageChange,
}) => {
  const { playSound } = useSound();

  const textColor = isDark ? "text-violet-200" : "text-gray-700";
  const bgColor = isDark ? "bg-violet-950/95" : "bg-white/95";
  const borderColor = isDark ? "border-violet-500/20" : "border-violet-300/30";
  const dividerColor = isDark ? "bg-violet-500/20" : "bg-violet-300/20";
  const sliderBgColor = isDark ? "bg-violet-900/50" : "bg-violet-200/50";
  const sliderActiveColor = isDark ? "bg-violet-500" : "bg-violet-400";
  const inputBg = isDark ? "bg-white/10" : "bg-white/70";

  const handleClick = (callback, ...args) => {
    playSound("buttonClick");
    callback(...args);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={() => playSound("buttonClick")}
          className={`fixed top-4 right-4 w-12 h-12 rounded-full hover:bg-white/20 backdrop-blur-sm border ${borderColor} transition-all duration-300 group flex items-center justify-center z-50 ${
            isDark ? "bg-white/10" : "bg-white/30"
          }`}
        >
          <Settings
            size={24}
            className={`${textColor} group-hover:rotate-45 transition-transform duration-300`}
          />
        </button>
      </DialogTrigger>

      <DialogContent
        className={`${bgColor} backdrop-blur-xl border ${borderColor} shadow-xl w-full max-w-sm mx-auto my-4 max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-md`}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className={`text-2xl font-bold ${textColor}`}>
            Game Settings
          </DialogTitle>
          <DialogDescription
            className={isDark ? "text-violet-300" : "text-gray-500"}
          >
            Configure suas preferências de jogo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sound Controls */}
          <div className="space-y-5">
            <div className="flex items-center justify-between h-14 px-2">
              <div className="flex items-center gap-3">
                {isMuted ? (
                  <VolumeX className={`w-6 h-6 ${textColor}`} />
                ) : (
                  <Volume2 className={`w-6 h-6 ${textColor}`} />
                )}
                <span className={`${textColor} text-lg`}>Sound Effects</span>
              </div>
              <Switch
                checked={!isMuted}
                onCheckedChange={() => handleClick(onMuteToggle)}
                className="data-[state=checked]:bg-violet-500 h-6 w-11"
              />
            </div>

            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center">
                <label className={isDark ? "text-violet-300" : "text-gray-500"}>
                  Volume
                </label>
                <span className={`${textColor} font-medium text-lg`}>
                  {volume}%
                </span>
              </div>
              <div className="h-14 flex items-center">
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={([value]) =>
                    handleClick(onVolumeChange, value)
                  }
                  disabled={isMuted}
                  className="relative flex items-center select-none touch-none w-full h-8"
                >
                  <span
                    className={`absolute h-2.5 w-full rounded-full ${sliderBgColor}`}
                  />
                  <span
                    className={`absolute h-2.5 rounded-full ${sliderActiveColor}`}
                    style={{ width: `${volume}%` }}
                  />
                  <span
                    className={`absolute w-7 h-7 rounded-full bg-white shadow-md border-2 ${borderColor} touch-none`}
                    style={{
                      left: `${volume}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </Slider>
              </div>
            </div>
          </div>

          <div className={`h-px ${dividerColor}`} />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between h-14 px-2">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className={`w-6 h-6 ${textColor}`} />
              ) : (
                <Sun className={`w-6 h-6 ${textColor}`} />
              )}
              <span className={`${textColor} text-lg`}>Dark Mode</span>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={() => handleClick(onThemeToggle)}
              className="data-[state=checked]:bg-violet-500 h-6 w-11"
            />
          </div>

          <div className={`h-px ${dividerColor}`} />

          {/* Challenge Interval */}
          <div className="space-y-4 px-2">
            <div className="flex justify-between items-center">
              <label className={`${textColor} text-lg`}>Challenge Timer</label>
              <span className={`${textColor} font-medium text-lg`}>
                {challengeInterval}s
              </span>
            </div>
            <div className="h-14 flex items-center">
              <Slider
                value={[challengeInterval]}
                min={15}
                max={60}
                step={5}
                onValueChange={([value]) =>
                  handleClick(onIntervalChange, value)
                }
                className="relative flex items-center select-none touch-none w-full h-8"
              >
                <span
                  className={`absolute h-2.5 w-full rounded-full ${sliderBgColor}`}
                />
                <span
                  className={`absolute h-2.5 rounded-full ${sliderActiveColor}`}
                  style={{ width: `${((challengeInterval - 15) / 45) * 100}%` }}
                />
                <span
                  className={`absolute w-7 h-7 rounded-full bg-white shadow-md border-2 ${borderColor} touch-none`}
                  style={{
                    left: `${((challengeInterval - 15) / 45) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </Slider>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between h-14 px-2">
            <div className="flex items-center gap-3">
              <Globe className={`w-6 h-6 ${textColor}`} />
              <span className={`${textColor} text-lg`}>Language</span>
            </div>
            <Select
              value={language}
              onValueChange={(value) => handleClick(onLanguageChange, value)}
            >
              <SelectTrigger
                className={`w-32 ${inputBg} border-violet-500/30 ${textColor}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className={
                  isDark
                    ? "bg-violet-950 border-violet-500/30"
                    : "bg-white border-violet-300/30"
                }
              >
                <SelectItem value="en" className={textColor}>
                  English
                </SelectItem>
                <SelectItem value="pt" className={textColor}>
                  Português
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettings;
