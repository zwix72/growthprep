import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LogOut, Sprout, Leaf, Flower2, BookOpen, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "See you next time! Keep growing. 🌱",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Sprout className="w-12 h-12 text-primary animate-gentle-float mx-auto mb-4" />
          <p className="text-body text-muted-foreground">Loading your garden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-organic bg-gradient-growth flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">GrowthPrep</h1>
              <p className="text-hint text-muted-foreground">Your Learning Garden</p>
            </div>
          </div>

          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-leaf-pop">
            <Flower2 className="w-4 h-4 text-primary" />
            <span className="text-hint text-primary font-medium">Level 1 Gardener</span>
          </div>
          <h2 className="text-h1 md:text-[42px] font-bold mb-3 text-foreground">
            Welcome to Your Garden
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Every practice session plants a seed. Let's start growing your SAT skills today.
          </p>
        </div>

        {/* Garden Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 growth-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-organic bg-primary/10 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <span className="text-hint text-muted-foreground">This Week</span>
            </div>
            <div className="text-h2 font-bold text-foreground mb-1">0</div>
            <div className="text-body text-muted-foreground">Seeds Planted</div>
          </Card>

          <Card className="p-6 growth-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-organic bg-secondary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-hint text-muted-foreground">Total</span>
            </div>
            <div className="text-h2 font-bold text-foreground mb-1">0</div>
            <div className="text-body text-muted-foreground">Concepts Growing</div>
          </Card>

          <Card className="p-6 growth-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-organic bg-accent/10 flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-accent" />
              </div>
              <span className="text-hint text-muted-foreground">Mastered</span>
            </div>
            <div className="text-h2 font-bold text-foreground mb-1">0</div>
            <div className="text-body text-muted-foreground">Topics Bloomed</div>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="p-8 mb-12 border-2 border-primary/20">
          <h3 className="text-h2 font-semibold mb-6 text-foreground">Your Garden Progress</h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-body font-medium text-foreground">Math</span>
                </div>
                <span className="text-hint text-muted-foreground">0% Complete</span>
              </div>
              <Progress value={0} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <span className="text-body font-medium text-foreground">Reading</span>
                </div>
                <span className="text-hint text-muted-foreground">0% Complete</span>
              </div>
              <Progress value={0} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <span className="text-body font-medium text-foreground">Writing</span>
                </div>
                <span className="text-hint text-muted-foreground">0% Complete</span>
              </div>
              <Progress value={0} />
            </div>
          </div>
        </Card>

        {/* Start Practicing CTA */}
        <Card className="p-12 text-center bg-gradient-growth border-0 shadow-glow">
          <div className="max-w-2xl mx-auto">
            <Target className="w-16 h-16 text-white mx-auto mb-6 animate-gentle-float" />
            <h3 className="text-h2 font-bold text-white mb-4">Ready to Plant Your First Seed?</h3>
            <p className="text-body text-white/90 mb-8">
              Choose a subject below to begin your first practice session. 
              Each question you answer helps your garden grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Start Math Practice
              </Button>
              <Button
                size="lg"
                className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm font-semibold"
              >
                Explore All Subjects
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
