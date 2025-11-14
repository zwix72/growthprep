import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GardenShowcase from "@/components/GardenShowcase";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <GardenShowcase />
      <CTA />
    </main>
  );
};

export default Index;
