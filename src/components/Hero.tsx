import { Button } from "@/components/ui/button";
import { Sprout, TrendingUp, Award } from "lucide-react";
import heroGarden from "@/assets/hero-garden.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroGarden})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-30 animate-gentle-float">
        <Sprout className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute bottom-32 right-16 opacity-20 animate-gentle-float" style={{ animationDelay: '1s' }}>
        <Sprout className="w-20 h-20 text-secondary" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center max-w-5xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-leaf-pop">
          <Sprout className="w-4 h-4 text-primary" />
          <span className="text-hint text-primary font-medium">Your Learning Garden Awaits</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-h1 md:text-[56px] font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          SAT Prep That Grows With You
        </h1>

        {/* Subheadline */}
        <p className="text-body md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-reading">
          Transform your test preparation into a serene learning journey. 
          Every study session nurtures your garden, every milestone blooms into achievement. 
          Watch your confidence flourish naturally.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button variant="hero" size="lg" className="min-w-[200px]">
            <Sprout className="w-5 h-5" />
            Start Growing Today
          </Button>
          <Button variant="outline" size="lg" className="min-w-[200px]">
            Explore Features
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-6 rounded-organic bg-card/50 backdrop-blur-sm border border-primary/10 growth-hover">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="text-h2 font-bold text-foreground">250+</div>
            <div className="text-hint text-muted-foreground">Points Improved Avg.</div>
          </div>

          <div className="flex flex-col items-center gap-2 p-6 rounded-organic bg-card/50 backdrop-blur-sm border border-secondary/10 growth-hover" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
              <Sprout className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-h2 font-bold text-foreground">10K+</div>
            <div className="text-hint text-muted-foreground">Gardens Cultivated</div>
          </div>

          <div className="flex flex-col items-center gap-2 p-6 rounded-organic bg-card/50 backdrop-blur-sm border border-accent/10 growth-hover" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <div className="text-h2 font-bold text-foreground">98%</div>
            <div className="text-hint text-muted-foreground">Student Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Decorative Vine SVG */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-32 opacity-20 pointer-events-none"
        viewBox="0 0 1200 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          fill="none"
          strokeDasharray="1000"
          className="animate-vine-grow"
        />
      </svg>
    </section>
  );
};

export default Hero;
