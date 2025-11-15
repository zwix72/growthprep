import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, Sparkles } from "lucide-react";

const Donate = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4 animate-leaf-pop">
            <Heart className="w-5 h-5 text-accent" />
            <span className="text-hint text-accent font-medium">Support Us</span>
          </div>
          <h1 className="text-h1 font-bold mb-4 text-foreground">
            Help Keep GrowthPrep Free
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            GrowthPrep is completely free for all students. Your donations help us maintain
            the platform, create new content, and support students worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 text-center growth-hover">
            <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-h3 font-semibold mb-2 text-foreground">$5</h3>
            <p className="text-hint text-muted-foreground">Buy us a coffee</p>
          </Card>

          <Card className="p-8 text-center growth-hover border-2 border-primary/30">
            <Heart className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-h3 font-semibold mb-2 text-foreground">$25</h3>
            <p className="text-hint text-muted-foreground">Support our mission</p>
          </Card>

          <Card className="p-8 text-center growth-hover">
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-h3 font-semibold mb-2 text-foreground">Custom</h3>
            <p className="text-hint text-muted-foreground">Choose your amount</p>
          </Card>
        </div>

        <Card className="p-12 bg-gradient-growth border-0 text-center">
          <h2 className="text-h2 font-bold text-white mb-4">
            Every Contribution Matters
          </h2>
          <p className="text-body text-white/90 mb-8 max-w-2xl mx-auto">
            100% of donations go directly to maintaining and improving the platform.
            We're committed to keeping SAT prep accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              Donate via Stripe
            </Button>
            <Button
              size="lg"
              className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm font-semibold"
            >
              Donate via PayPal
            </Button>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-hint text-muted-foreground">
            All donations are one-time and optional. No subscriptions, ever.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Donate;
