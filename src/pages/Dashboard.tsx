import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sprout, Leaf, Flower2, BookOpen, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TestAttempt {
  id: string;
  test_id: string;
  started_at: string;
  completed_at: string | null;
  total_score: number | null;
  rw_score: number | null;
  math_score: number | null;
  tests: {
    title: string;
  };
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [pastAttempts, setPastAttempts] = useState<TestAttempt[]>([]);
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
      if (session?.user) {
        fetchPastAttempts(session.user.id);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchPastAttempts(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const fetchPastAttempts = async (userId: string) => {
    const { data, error } = await supabase
      .from('test_attempts')
      .select(`
        id,
        test_id,
        started_at,
        completed_at,
        total_score,
        rw_score,
        math_score,
        tests (
          title
        )
      `)
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setPastAttempts(data as TestAttempt[]);
    }
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
      <Navbar />
      
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

        {/* Past Exams Section */}
        <div className="mb-12">
          <h3 className="text-h2 font-semibold mb-6 text-foreground">Recent Test Scores</h3>
          {pastAttempts.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No completed exams yet. Start your first practice test!</p>
              <Button onClick={() => navigate('/tests')} variant="outline">
                Browse Practice Tests
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pastAttempts.map((attempt) => (
                <Card 
                  key={attempt.id} 
                  className="p-6 hover:shadow-lg transition-all cursor-pointer growth-hover"
                  onClick={() => navigate(`/test-results/${attempt.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        {attempt.tests.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(attempt.completed_at!), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {attempt.total_score || 0}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">out of 1600</div>
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <span>RW: {attempt.rw_score || 0}</span>
                        <span>•</span>
                        <span>Math: {attempt.math_score || 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

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
                onClick={() => navigate("/tests")}
              >
                Take Practice Test
              </Button>
              <Button
                size="lg"
                className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm font-semibold"
                onClick={() => navigate("/topic-practice")}
              >
                Practice by Topic
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
