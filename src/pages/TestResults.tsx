import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestAttempt {
  id: string;
  total_score: number;
  rw_score: number;
  math_score: number;
  rw_correct: number;
  rw_total: number;
  math_correct: number;
  math_total: number;
}

const TestResults = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      fetchResults();
    };
    checkAuth();
  }, [attemptId, navigate]);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("test_attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (error) {
      toast({
        title: "Error loading results",
        description: error.message,
        variant: "destructive",
      });
      navigate("/tests");
      return;
    }

    setAttempt(data);
    setLoading(false);
  };

  if (loading || !attempt) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-body text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const rwPercent = (attempt.rw_correct / attempt.rw_total) * 100;
  const mathPercent = (attempt.math_correct / attempt.math_total) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-leaf-pop">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-hint text-primary font-medium">Test Complete!</span>
          </div>
          <h1 className="text-h1 font-bold mb-3 text-foreground">Your Results</h1>
          <p className="text-body text-muted-foreground">
            Here's how you performed on this practice test
          </p>
        </div>

        {/* Total Score */}
        <Card className="p-12 mb-8 text-center border-2 border-primary/20">
          <p className="text-hint text-muted-foreground mb-2">Total Score</p>
          <p className="text-[64px] font-bold text-foreground mb-2">
            {attempt.total_score}
          </p>
          <p className="text-body text-muted-foreground">out of 1600</p>
        </Card>

        {/* Section Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-semibold text-foreground">
                Reading & Writing
              </h3>
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <p className="text-[42px] font-bold text-foreground mb-4">
              {attempt.rw_score}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-hint text-muted-foreground">
                <span>Correct Answers</span>
                <span>
                  {attempt.rw_correct} / {attempt.rw_total}
                </span>
              </div>
              <Progress value={rwPercent} />
              <p className="text-hint text-muted-foreground text-right">
                {rwPercent.toFixed(1)}% Correct
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-semibold text-foreground">Math</h3>
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-[42px] font-bold text-foreground mb-4">
              {attempt.math_score}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-hint text-muted-foreground">
                <span>Correct Answers</span>
                <span>
                  {attempt.math_correct} / {attempt.math_total}
                </span>
              </div>
              <Progress value={mathPercent} />
              <p className="text-hint text-muted-foreground text-right">
                {mathPercent.toFixed(1)}% Correct
              </p>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(`/test-review/${attemptId}`)}
            size="lg"
            className="bg-gradient-growth text-white"
          >
            Review Questions
          </Button>
          <Button onClick={() => navigate("/tests")} size="lg" variant="outline">
            Back to Tests
          </Button>
          <Button onClick={() => navigate("/dashboard")} size="lg" variant="outline">
            View Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TestResults;
