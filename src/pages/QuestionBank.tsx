import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const QuestionBank = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold mb-4 text-foreground">
            Question Bank
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Practice with thousands of SAT questions, organized by topic and difficulty.
          </p>
        </div>

        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-h2 font-semibold mb-2 text-foreground">
            Coming Soon
          </h2>
          <p className="text-body text-muted-foreground">
            The question bank will be available here once questions are added.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default QuestionBank;
