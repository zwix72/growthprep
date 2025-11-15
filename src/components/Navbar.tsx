import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        setIsAdmin(!!data);
      }
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="text-body text-foreground hover:text-primary transition-smooth"
        onClick={() => setIsOpen(false)}
      >
        Home
      </Link>
      {user ? (
        <>
          <Link
            to="/dashboard"
            className="text-body text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/tests"
            className="text-body text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsOpen(false)}
          >
            Practice Tests
          </Link>
          <Link
            to="/question-bank"
            className="text-body text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsOpen(false)}
          >
            Question Bank
          </Link>
          <Link
            to="/topic-practice"
            className="text-body text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsOpen(false)}
          >
            Topic Practice
          </Link>
          <Link
            to="/analytics"
            className="text-body text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsOpen(false)}
          >
            Analytics
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-body text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
        </>
      ) : null}
      <Link
        to="/donate"
        className="text-body text-foreground hover:text-primary transition-smooth"
        onClick={() => setIsOpen(false)}
      >
        Donate
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-organic bg-gradient-growth flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-h3 text-foreground">
              GrowthPrep
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            {user ? (
              <Button variant="ghost" onClick={handleSignOut} size="sm">
                Sign Out
              </Button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <NavLinks />
            {user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                size="sm"
                className="w-full"
              >
                Sign Out
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
};
