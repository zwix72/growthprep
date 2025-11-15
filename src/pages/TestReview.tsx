import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Flag, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserAnswer {
  id: string;
  selected_answer: string | null;
  is_correct: boolean;
  is_marked: boolean;
  questions: {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation: string;
    section: string;
  };
}

const TestReview = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "wrong" | "marked">("all");
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
      fetchAnswers();
    };
    checkAuth();
  }, [attemptId, navigate]);

  const fetchAnswers = async () => {
    const { data, error } = await supabase
      .from("user_answers")
      .select(
        `
        id,
        selected_answer,
        is_correct,
        is_marked,
        questions (
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          explanation,
          section
        )
      `
      )
      .eq("attempt_id", attemptId)
      .order("answered_at");

    if (error) {
      toast({
        title: "Error loading review",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setAnswers(data as any);
    setLoading(false);
  };

  const filteredAnswers = answers.filter((ans) => {
    if (filter === "wrong") return !ans.is_correct;
    if (filter === "marked") return ans.is_marked;
    return true;
  });

  const currentAnswer = filteredAnswers[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-body text-muted-foreground">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!currentAnswer) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-h2 font-semibold mb-2 text-foreground">
              No Questions to Review
            </h2>
            <p className="text-body text-muted-foreground mb-6">
              {filter === "wrong"
                ? "You got all questions correct!"
                : filter === "marked"
                ? "You didn't mark any questions"
                : "No questions available"}
            </p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Review Header */}
      <div className="bg-card border-b border-border/50 sticky top-[73px] z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-hint text-muted-foreground">
                Question {currentIndex + 1} of {filteredAnswers.length}
              </span>
              {currentAnswer.is_marked && (
                <Flag className="w-4 h-4 text-accent" />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => {
                  setFilter("all");
                  setCurrentIndex(0);
                }}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === "wrong" ? "default" : "outline"}
                onClick={() => {
                  setFilter("wrong");
                  setCurrentIndex(0);
                }}
              >
                Wrong Only
              </Button>
              <Button
                size="sm"
                variant={filter === "marked" ? "default" : "outline"}
                onClick={() => {
                  setFilter("marked");
                  setCurrentIndex(0);
                }}
              >
                Marked
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Card className="p-8 mb-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-6">
            {currentAnswer.is_correct ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-hint text-primary font-medium">Correct</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="text-hint text-destructive font-medium">Incorrect</span>
              </div>
            )}
          </div>

          {/* Question */}
          <div className="prose max-w-none mb-8">
            <p className="text-body text-foreground whitespace-pre-wrap">
              {currentAnswer.questions.question_text}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {["A", "B", "C", "D"].map((option) => {
              const optionText = currentAnswer.questions[
                `option_${option.toLowerCase()}` as keyof typeof currentAnswer.questions
              ] as string;
              const isCorrect = currentAnswer.questions.correct_answer === option;
              const wasSelected = currentAnswer.selected_answer === option;

              return (
                <div
                  key={option}
                  className={`p-4 rounded-organic border-2 ${
                    isCorrect
                      ? "border-primary bg-primary/10"
                      : wasSelected
                      ? "border-destructive bg-destructive/10"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                        isCorrect
                          ? "bg-primary text-white"
                          : wasSelected
                          ? "bg-destructive text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {option}
                    </div>
                    <div className="flex-1">
                      <span className="text-body text-foreground">{optionText}</span>
                      {isCorrect && (
                        <p className="text-hint text-primary mt-1">✓ Correct Answer</p>
                      )}
                      {wasSelected && !isCorrect && (
                        <p className="text-hint text-destructive mt-1">✗ Your Answer</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="p-6 rounded-organic bg-muted/50 border border-border">
            <h3 className="text-h3 font-semibold mb-3 text-foreground">
              Explanation
            </h3>
            <p className="text-body text-muted-foreground whitespace-pre-wrap">
              {currentAnswer.questions.explanation}
            </p>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            variant="outline"
          >
            Previous
          </Button>

          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>

          <Button
            onClick={() =>
              setCurrentIndex(Math.min(filteredAnswers.length - 1, currentIndex + 1))
            }
            disabled={currentIndex === filteredAnswers.length - 1}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TestReview;
