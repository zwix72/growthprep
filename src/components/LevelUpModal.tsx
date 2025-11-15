import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
}

export const LevelUpModal = ({ isOpen, onClose, newLevel }: LevelUpModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0">
        <div className="relative bg-gradient-to-br from-primary via-accent to-secondary p-8 text-center">
          {/* Sparkles decoration */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-yellow-300 animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${Math.random() * 20 + 10}px`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="mb-6 animate-bounce">
              <Trophy className="w-24 h-24 mx-auto text-yellow-300" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-2">Level Up!</h2>
            <p className="text-xl text-white/90 mb-6">
              You've reached Level {newLevel}
            </p>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="text-6xl font-bold text-white mb-2">{newLevel}</div>
              <p className="text-white/90">Keep up the amazing work!</p>
            </div>

            <Button
              onClick={onClose}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold px-8"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
