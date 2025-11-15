import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import GardenShowcase from "@/components/GardenShowcase";
import CTA from "@/components/CTA";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Redirect to dashboard if authenticated
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero onAuthOpen={() => setAuthModalOpen(true)} />
      <Features />
      <GardenShowcase onAuthOpen={() => setAuthModalOpen(true)} />
      <CTA onAuthOpen={() => setAuthModalOpen(true)} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </main>
  );
};

export default Index;
