import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TestsList from "./pages/TestsList";
import TestTaking from "./pages/TestTaking";
import TestResults from "./pages/TestResults";
import TestReview from "./pages/TestReview";
import QuestionBank from "./pages/QuestionBank";
import TopicPractice from "./pages/TopicPractice";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";
import Donate from "./pages/Donate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tests" element={<TestsList />} />
          <Route path="/test/:testId" element={<TestTaking />} />
          <Route path="/test-results/:attemptId" element={<TestResults />} />
          <Route path="/test-review/:attemptId" element={<TestReview />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/topic-practice" element={<TopicPractice />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/donate" element={<Donate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
