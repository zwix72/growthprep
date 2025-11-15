import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { Clock, Flag, BookOpen, Calculator, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MathText } from "@/components/MathText";

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
  const [showDesmos, setShowDesmos] = useState(false);

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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Test Header - SAT Style */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {currentQuestion?.section === "reading_writing" ? "Reading and Writing" : "Math"} {currentQuestion?.module_number}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600 font-medium">
                {formatTime(timeLeft)}
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content - SAT Style */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-140px)]">
          {/* Left: Passage/Question */}
          <div className="border-r border-gray-200 p-8 bg-white overflow-y-auto">
            {currentQuestion && (
              <>
                {currentQuestion.section === "reading_writing" && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Passage</h2>
                    <p className="text-sm text-gray-500 italic mb-4">
                      Read the passage and select the best answer based on the question.
                    </p>
                  </div>
                )}
                {currentQuestion.section === "math" && (
                  <h2 className="text-xl font-bold mb-6 text-gray-900">Question</h2>
                )}
                <div className="prose prose-sm max-w-none">
                  <MathText text={currentQuestion.question_text} className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap" />
                </div>
              </>
            )}
          </div>

          {/* Right: Answer Choices */}
          <div className="p-8 bg-gray-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">Select an answer to save</p>
              <button
                onClick={toggleMark}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm ${
                  marked.has(currentQuestion?.id || "")
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Flag className={`w-4 h-4 ${marked.has(currentQuestion?.id || "") ? "fill-current" : ""}`} />
                Mark for review
              </button>
            </div>

            {currentQuestion?.section === "reading_writing" && (
              <h3 className="text-base font-semibold mb-4 text-gray-900">
                Which choice completes the text with the most logical and precise word or phrase?
              </h3>
            )}

            {currentQuestion?.section === "math" && (
              <h3 className="text-base font-semibold mb-4 text-gray-900">
                Select the correct answer
              </h3>
            )}

            <div className="space-y-2">
              {currentQuestion && ["A", "B", "C", "D"].map((option) => {
                const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string;
                const isSelected = answers[currentQuestion.id] === option;
                
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {option}
                      </div>
                      <MathText text={optionText} className="text-base text-gray-900 pt-0.5 flex-1" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desmos Calculator for Math */}
            {currentQuestion && currentQuestion.section === "math" && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDesmos(!showDesmos)}
                  className="w-full"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  {showDesmos ? "Hide" : "Show"} Calculator
                </Button>
                {showDesmos && (
                  <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.desmos.com/calculator"
                      className="w-full h-[500px] border-0"
                      title="Desmos Calculator"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Navigation Footer */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="px-8 bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200 disabled:opacity-50"
            >
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded hover:bg-gray-100">
                <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
              </button>
              <span className="text-sm font-medium text-gray-700">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="px-8 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Submit Test
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="px-8 bg-orange-500 hover:bg-orange-600 text-white"
              >
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
