import { Card } from "@/components/ui/card";
import { BookOpen, BarChart3, Target, Sparkles, Users, Trophy } from "lucide-react";
import leafIcon from "@/assets/leaf-icon.png";

const features = [
  {
    icon: BookOpen,
    title: "Personalized Study Paths",
    description: "Your garden grows uniquely. Adaptive learning adjusts to your pace and style.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Visual Progress Garden",
    description: "Watch your knowledge bloom with beautiful, motivating progress visualizations.",
    color: "secondary",
  },
  {
    icon: Target,
    title: "Focused Practice Sessions",
    description: "Mindful 25-minute sessions designed for deep learning without burnout.",
    color: "accent",
  },
  {
    icon: Sparkles,
    title: "Achievement Blooms",
    description: "Celebrate milestones with satisfying animations and unlock garden elements.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Supportive Community",
    description: "Connect with fellow learners tending their gardens. Grow together.",
    color: "secondary",
  },
  {
    icon: Trophy,
    title: "Score Guarantee",
    description: "Cultivate your potential with confidence. Our proven method delivers results.",
    color: "accent",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={leafIcon} alt="Leaf" className="w-8 h-8 animate-leaf-pop" />
            <span className="text-hint text-primary font-medium">Why GrowthPrep?</span>
          </div>
          <h2 className="text-h1 md:text-[48px] font-bold mb-4 text-foreground">
            Nurture Your Success
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto font-reading">
            Every feature designed to make your SAT journey feel less like a grind 
            and more like watching something beautiful grow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 border-2 border-border/50 rounded-organic growth-hover bg-card shadow-soft hover:shadow-medium"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-organic mb-6 flex items-center justify-center ${
                    feature.color === "primary"
                      ? "bg-primary/10"
                      : feature.color === "secondary"
                      ? "bg-secondary/10"
                      : "bg-accent/10"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      feature.color === "primary"
                        ? "text-primary"
                        : feature.color === "secondary"
                        ? "text-secondary"
                        : "text-accent"
                    }`}
                  />
                </div>
                <h3 className="text-h3 font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
