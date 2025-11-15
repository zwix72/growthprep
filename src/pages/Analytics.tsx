import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { BarChart } from "lucide-react";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold mb-4 text-foreground">
            Your Analytics
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Track your progress, identify weak areas, and see your improvement over time.
          </p>
        </div>

        <Card className="p-12 text-center">
          <BarChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-h2 font-semibold mb-2 text-foreground">
            No Data Yet
          </h2>
          <p className="text-body text-muted-foreground">
            Your analytics will appear here once you complete practice tests and quizzes.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
