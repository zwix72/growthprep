import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { Clock, Flag, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  section: string;
  module_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 14 * 60); // 2h 14min in seconds

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      initTest(session.user.id);
    };
    checkAuth();
  }, [testId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const initTest = async (userId: string) => {
    // Fetch questions
    const { data: questionsData, error: qError } = await supabase
      .from("questions")
      .select("*")
      .eq("test_id", testId)
      .order("order_index");

    if (qError) {
      toast({
        title: "Error loading test",
        description: qError.message,
        variant: "destructive",
      });
      navigate("/tests");
      return;
    }

    setQuestions(questionsData || []);

    // Create attempt
    const { data: attemptData, error: aError } = await supabase
      .from("test_attempts")
      .insert({
        user_id: userId,
        test_id: testId,
      })
      .select()
      .single();

    if (aError) {
      toast({
        title: "Error starting test",
        description: aError.message,
        variant: "destructive",
      });
      navigate("/tests");
      return;
    }

    setAttemptId(attemptData.id);
    setLoading(false);
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const toggleMark = () => {
    if (!currentQuestion) return;
    setMarked((prev) => {
      const newMarked = new Set(prev);
      if (newMarked.has(currentQuestion.id)) {
        newMarked.delete(currentQuestion.id);
      } else {
        newMarked.add(currentQuestion.id);
      }
      return newMarked;
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;

    // Save all answers
    const answerRecords = questions.map((q) => ({
      attempt_id: attemptId,
      question_id: q.id,
      selected_answer: answers[q.id] || null,
      is_correct: answers[q.id] === q.correct_answer,
      is_marked: marked.has(q.id),
      time_spent: 0,
    }));

    const { error } = await supabase.from("user_answers").insert(answerRecords);

    if (error) {
      toast({
        title: "Error submitting test",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Calculate scores
    const rwQuestions = questions.filter((q) => q.section === "reading_writing");
    const mathQuestions = questions.filter((q) => q.section === "math");
    
    const rwCorrect = rwQuestions.filter((q) => answers[q.id] === q.correct_answer).length;
    const mathCorrect = mathQuestions.filter((q) => answers[q.id] === q.correct_answer).length;

    // Simplified scoring (real SAT uses complex conversion tables)
    const rwScore = Math.round(200 + (rwCorrect / rwQuestions.length) * 600);
    const mathScore = Math.round(200 + (mathCorrect / mathQuestions.length) * 600);
    const totalScore = rwScore + mathScore;

    // Update attempt
    await supabase
      .from("test_attempts")
      .update({
        completed_at: new Date().toISOString(),
        total_score: totalScore,
        rw_score: rwScore,
        math_score: mathScore,
        rw_correct: rwCorrect,
        rw_total: rwQuestions.length,
        math_correct: mathCorrect,
        math_total: mathQuestions.length,
      })
      .eq("id", attemptId);

    toast({
      title: "Test submitted!",
      description: `Your score: ${totalScore}/1600`,
    });

    navigate(`/test-results/${attemptId}`);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-body text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-h2 font-semibold mb-2 text-foreground">
              No Questions Available
            </h2>
            <p className="text-body text-muted-foreground mb-6">
              This test doesn't have any questions yet.
            </p>
            <Button onClick={() => navigate("/tests")}>Back to Tests</Button>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Test Header */}
      <div className="bg-card border-b border-border/50 sticky top-[73px] z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className="text-hint text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {currentQuestion && (
                <span className="text-hint text-muted-foreground">
                  {currentQuestion.section === "reading_writing" ? "Reading & Writing" : "Math"} | 
                  Module {currentQuestion.module_number}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-body font-mono text-foreground">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMark}
                className={marked.has(currentQuestion?.id || "") ? "bg-accent/20" : ""}
              >
                <Flag className="w-4 h-4" />
                {marked.has(currentQuestion?.id || "") ? "Marked" : "Mark"}
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {currentQuestion && (
          <Card className="p-8 mb-6">
            <div className="prose max-w-none mb-8">
              <p className="text-body text-foreground whitespace-pre-wrap">
                {currentQuestion.question_text}
              </p>
            </div>

            <div className="space-y-3">
              {["A", "B", "C", "D"].map((option) => {
                const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string;
                const isSelected = answers[currentQuestion.id] === option;
                
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left p-4 rounded-organic border-2 transition-smooth ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {option}
                      </div>
                      <span className="text-body text-foreground pt-1">
                        {optionText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-gradient-growth text-white"
              >
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg">
                Next
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestTaking;
