import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

const TopicPractice = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold mb-4 text-foreground">
            Topic Practice
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Focus on specific topics and domains to strengthen your weak areas.
          </p>
        </div>

        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-h2 font-semibold mb-2 text-foreground">
            Coming Soon
          </h2>
          <p className="text-body text-muted-foreground">
            Topic-specific practice will be available here once questions are categorized.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default TopicPractice;
