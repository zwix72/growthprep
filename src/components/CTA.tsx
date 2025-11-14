import { Button } from "@/components/ui/button";
import { Sprout, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-6 bg-gradient-growth relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6 animate-leaf-pop">
          <Sprout className="w-4 h-4 text-white" />
          <span className="text-hint text-white font-medium">Plant Your First Seed Today</span>
        </div>

        <h2 className="text-h1 md:text-[52px] font-bold text-white mb-6 leading-tight">
          Ready to Grow Your SAT Score?
        </h2>

        <p className="text-body md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-reading">
          Join thousands of students who've transformed their test prep journey 
          into a mindful, rewarding experience. Your garden awaits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="min-w-[220px] bg-white text-primary hover:bg-white/90 shadow-glow font-semibold serene-transition hover:scale-[1.02]"
          >
            <Sprout className="w-5 h-5" />
            Begin Your Journey
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="min-w-[220px] border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            Schedule a Demo
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80 text-hint">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free 7-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
