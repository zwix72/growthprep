import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface Achievement {
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
      isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`}>
      <Card className="p-6 bg-gradient-to-br from-primary to-accent border-2 border-primary shadow-2xl max-w-sm animate-bounce-in">
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-pulse">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <h3 className="text-lg font-bold text-white">Achievement Unlocked!</h3>
            </div>
            <h4 className="text-xl font-bold text-white mb-1">{achievement.name}</h4>
            <p className="text-sm text-white/90 mb-2">{achievement.description}</p>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white/20 rounded-full">
                <span className="text-sm font-semibold text-white">+{achievement.xp_reward} XP</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
