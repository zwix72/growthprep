import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: string;
  title: string;
  description: string | null;
}

const TestsList = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      fetchTests();
    };
    checkAuth();
  }, [navigate]);

  const fetchTests = async () => {
    const { data, error } = await supabase
      .from("tests")
      .select("id, title, description")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading tests",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTests(data || []);
    }
    setLoading(false);
  };

  const startTest = (testId: string) => {
    navigate(`/test/${testId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-body text-muted-foreground">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold mb-4 text-foreground">
            Digital SAT Practice Tests
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Take full-length practice tests that mirror the actual Digital SAT format.
            Track your progress and improve your score.
          </p>
        </div>

        {tests.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-h2 font-semibold mb-2 text-foreground">
              No Tests Available Yet
            </h2>
            <p className="text-body text-muted-foreground">
              Tests will appear here once they're added by the admin.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tests.map((test) => (
              <Card key={test.id} className="p-8 growth-hover">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-h2 font-semibold mb-2 text-foreground">
                      {test.title}
                    </h3>
                    {test.description && (
                      <p className="text-body text-muted-foreground mb-4">
                        {test.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-hint text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>~2 hours 14 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>Adaptive Format</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => startTest(test.id)}
                    size="lg"
                    className="bg-gradient-growth text-white hover:opacity-90"
                  >
                    Start Test
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TestsList;
