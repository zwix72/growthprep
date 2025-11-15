import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  rw_domain?: string;
  math_domain?: string;
}

const TopicPractice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [section, setSection] = useState<"reading_writing" | "math" | "">("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

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
  }, [navigate]);

  const domainLabels = {
    information_ideas: "Information and Ideas",
    craft_structure: "Craft and Structure",
    expression_ideas: "Expression of Ideas",
    standard_english: "Standard English Conventions",
    algebra: "Algebra",
    advanced_math: "Advanced Math",
    problem_solving_data: "Problem Solving and Data Analysis",
    geometry_trig: "Geometry and Trigonometry",
  };

  const rwDomains = [
    "information_ideas",
    "craft_structure",
    "expression_ideas",
    "standard_english",
  ];

  const mathDomains = [
    "algebra",
    "advanced_math",
    "problem_solving_data",
    "geometry_trig",
  ];

  const startPractice = async () => {
    if (!section || !domain) {
      toast({
        title: "Please select options",
        description: "Select a section and domain to start practicing",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('section', section)
        .is('test_id', null) // Only get topic practice questions
        .limit(parseInt(questionCount));

      // Add domain filter
      if (section === "reading_writing") {
        query = query.eq('rw_domain', domain as any);
      } else {
        query = query.eq('math_domain', domain as any);
      }

      // Add difficulty filter if selected
      if (difficulty) {
        query = query.eq('difficulty', difficulty as any);
      }

      const { data: questions, error } = await query;

      if (error) throw error;

      if (!questions || questions.length === 0) {
        toast({
          title: "No questions found",
          description: "There are no questions available for the selected criteria",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store questions in session storage and navigate to practice session
      sessionStorage.setItem('topicPracticeQuestions', JSON.stringify(questions));
      navigate('/topic-practice-session');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-hint text-primary font-medium">Targeted Practice</span>
          </div>
          <h1 className="text-h1 font-bold mb-4 text-foreground">
            Topic Practice
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Focus on specific topics and difficulty levels to strengthen your skills.
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            {/* Section Selection */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                1. Choose Section
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={section === "reading_writing" ? "default" : "outline"}
                  onClick={() => {
                    setSection("reading_writing");
                    setDomain("");
                  }}
                  className="h-20"
                >
                  <div className="text-center">
                    <BookOpen className="w-6 h-6 mx-auto mb-2" />
                    <div>Reading & Writing</div>
                  </div>
                </Button>
                <Button
                  variant={section === "math" ? "default" : "outline"}
                  onClick={() => {
                    setSection("math");
                    setDomain("");
                  }}
                  className="h-20"
                >
                  <div className="text-center">
                    <Target className="w-6 h-6 mx-auto mb-2" />
                    <div>Math</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Domain Selection */}
            {section && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  2. Choose Topic
                </label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {(section === "reading_writing" ? rwDomains : mathDomains).map((d) => (
                      <SelectItem key={d} value={d}>
                        {domainLabels[d as keyof typeof domainLabels]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Difficulty Selection */}
            {domain && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  3. Choose Difficulty (Optional)
                </label>
                <div className="flex gap-3">
                  <Button
                    variant={difficulty === "" ? "default" : "outline"}
                    onClick={() => setDifficulty("")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={difficulty === "easy" ? "default" : "outline"}
                    onClick={() => setDifficulty("easy")}
                    size="sm"
                  >
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Easy</Badge>
                  </Button>
                  <Button
                    variant={difficulty === "medium" ? "default" : "outline"}
                    onClick={() => setDifficulty("medium")}
                    size="sm"
                  >
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Medium</Badge>
                  </Button>
                  <Button
                    variant={difficulty === "hard" ? "default" : "outline"}
                    onClick={() => setDifficulty("hard")}
                    size="sm"
                  >
                    <Badge variant="secondary" className="bg-red-100 text-red-700">Hard</Badge>
                  </Button>
                </div>
              </div>
            )}

            {/* Question Count */}
            {domain && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  4. Number of Questions
                </label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Start Button */}
            {domain && (
              <Button
                onClick={startPractice}
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-growth text-white"
              >
                {loading ? "Loading Questions..." : "Start Practice"}
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default TopicPractice;
