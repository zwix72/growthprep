import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAchievements } from "@/hooks/useAchievements";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  section: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

const TopicPracticeSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { incrementQuestions } = useAchievements(user?.id);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      } else {
        setUser(session.user);
      }
    };
    checkAuth();

    const stored = sessionStorage.getItem('topicPracticeQuestions');
    if (stored) {
      setQuestions(JSON.parse(stored));
    } else {
      navigate('/topic-practice');
    }
  }, [navigate]);

  const currentQuestion = questions[currentIndex];
  const hasAnswered = answers[currentQuestion?.id] !== undefined;
  const isCorrect = answers[currentQuestion?.id] === currentQuestion?.correct_answer;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion || hasAnswered) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
    setShowExplanation(true);
    
    // Track question answered
    if (user) {
      await incrementQuestions();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    }
  };

  const handleFinish = () => {
    const correct = Object.entries(answers).filter(([qId, ans]) => {
      const q = questions.find(qu => qu.id === qId);
      return q && ans === q.correct_answer;
    }).length;

    toast({
      title: "Practice Complete!",
      description: `You got ${correct} out of ${questions.length} correct (${Math.round((correct / questions.length) * 100)}%)`,
    });

    sessionStorage.removeItem('topicPracticeQuestions');
    navigate('/dashboard');
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Progress Bar */}
      <div className="bg-card border-b border-border/50 sticky top-[73px] z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className="text-hint text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Card className="p-8 mb-6">
          <div className="prose max-w-none mb-8">
            <p className="text-body text-foreground whitespace-pre-wrap">
              {currentQuestion.question_text}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {["A", "B", "C", "D"].map((option) => {
              const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string;
              const isSelected = answers[currentQuestion.id] === option;
              const isCorrectOption = option === currentQuestion.correct_answer;
              const showResult = hasAnswered;
              
              let buttonClass = "border-border hover:border-primary/50";
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass = "border-green-500 bg-green-50 dark:bg-green-950";
                } else if (isSelected && !isCorrectOption) {
                  buttonClass = "border-red-500 bg-red-50 dark:bg-red-950";
                }
              } else if (isSelected) {
                buttonClass = "border-primary bg-primary/10";
              }
              
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-organic border-2 transition-smooth ${buttonClass} ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                        showResult && isCorrectOption
                          ? "bg-green-500 text-white"
                          : showResult && isSelected && !isCorrectOption
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {option}
                    </div>
                    <span className="text-body text-foreground pt-1 flex-1">
                      {optionText}
                    </span>
                    {showResult && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <h3 className="font-semibold text-foreground">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground mt-1" />
                <p className="text-body text-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/topic-practice')}
          >
            Exit Practice
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              onClick={handleFinish}
              disabled={!hasAnswered}
              className="bg-gradient-growth text-white"
            >
              Finish Practice
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
            >
              Next Question
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default TopicPracticeSession;
