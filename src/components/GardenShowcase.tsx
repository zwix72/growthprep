import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sprout, Leaf, Flower2 } from "lucide-react";

interface GardenShowcaseProps {
  onAuthOpen: () => void;
}

const GardenShowcase = ({ onAuthOpen }: GardenShowcaseProps) => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <Flower2 className="w-4 h-4 text-secondary" />
              <span className="text-hint text-secondary font-medium">Your Learning Garden</span>
            </div>

            <h2 className="text-h1 md:text-[48px] font-bold mb-6 text-foreground leading-tight">
              Watch Your Knowledge Bloom
            </h2>

            <p className="text-body text-muted-foreground mb-6 font-reading leading-relaxed">
              Every practice question you complete, every concept you master, 
              adds a new element to your personal garden. Transform abstract 
              progress into something tangible and beautiful.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1 flex-shrink-0">
                  <Sprout className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">Seeds</div>
                  <div className="text-body text-muted-foreground">New concepts and practice sessions</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center mt-1 flex-shrink-0">
                  <Leaf className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">Growth</div>
                  <div className="text-body text-muted-foreground">Skills developing through consistent practice</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1 flex-shrink-0">
                  <Flower2 className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">Blooms</div>
                  <div className="text-body text-muted-foreground">Mastered topics and achieved milestones</div>
                </div>
              </li>
            </ul>

            <Button variant="growth" size="lg" onClick={onAuthOpen}>
              Start Your Garden
            </Button>
          </div>

          {/* Right - Garden Visualization Mock */}
          <div className="relative">
            <Card className="p-8 rounded-organic border-2 border-primary/20 bg-card shadow-medium">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-h3 font-semibold text-foreground">Your Garden Progress</h3>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-hint text-primary font-medium">
                  Level 7
                </div>
              </div>

              {/* Progress Sections */}
              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body font-medium text-foreground">Math</span>
                    <span className="text-hint text-muted-foreground">85% Complete</span>
                  </div>
                  <Progress value={85} className="h-3" />
                  <div className="flex gap-2 mt-3">
                    <Flower2 className="w-5 h-5 text-primary animate-leaf-pop" />
                    <Flower2 className="w-5 h-5 text-primary animate-leaf-pop" style={{ animationDelay: '0.1s' }} />
                    <Flower2 className="w-5 h-5 text-primary animate-leaf-pop" style={{ animationDelay: '0.2s' }} />
                    <Leaf className="w-5 h-5 text-secondary animate-leaf-pop" style={{ animationDelay: '0.3s' }} />
                    <Sprout className="w-5 h-5 text-muted-foreground opacity-40" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body font-medium text-foreground">Reading</span>
                    <span className="text-hint text-muted-foreground">62% Complete</span>
                  </div>
                  <Progress value={62} className="h-3" />
                  <div className="flex gap-2 mt-3">
                    <Flower2 className="w-5 h-5 text-secondary animate-leaf-pop" />
                    <Flower2 className="w-5 h-5 text-secondary animate-leaf-pop" style={{ animationDelay: '0.1s' }} />
                    <Leaf className="w-5 h-5 text-secondary animate-leaf-pop" style={{ animationDelay: '0.2s' }} />
                    <Sprout className="w-5 h-5 text-muted-foreground opacity-40" />
                    <Sprout className="w-5 h-5 text-muted-foreground opacity-40" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-body font-medium text-foreground">Writing</span>
                    <span className="text-hint text-muted-foreground">43% Complete</span>
                  </div>
                  <Progress value={43} className="h-3" />
                  <div className="flex gap-2 mt-3">
                    <Leaf className="w-5 h-5 text-secondary animate-leaf-pop" />
                    <Leaf className="w-5 h-5 text-secondary animate-leaf-pop" style={{ animationDelay: '0.1s' }} />
                    <Sprout className="w-5 h-5 text-muted-foreground opacity-40" />
                    <Sprout className="w-5 h-5 text-muted-foreground opacity-40" />
                    <Sprout className="w-5 h-5 text-muted-foreground opacity-40" />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-h3 font-bold text-primary">127</div>
                  <div className="text-hint text-muted-foreground">Practice Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-h3 font-bold text-secondary">18</div>
                  <div className="text-hint text-muted-foreground">Mastered Topics</div>
                </div>
                <div className="text-center">
                  <div className="text-h3 font-bold text-accent">42</div>
                  <div className="text-hint text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </Card>

            {/* Floating Achievement */}
            <div className="absolute -top-4 -right-4 p-4 rounded-organic bg-gradient-achievement shadow-glow animate-leaf-pop">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GardenShowcase;
