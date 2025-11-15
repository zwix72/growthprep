import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, BookOpen, Users, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/");
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-body text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-h1 font-bold text-foreground">Admin Panel</h1>
          </div>
          <p className="text-body text-muted-foreground">
            Manage tests, questions, and user data
          </p>
        </div>

        <Tabs defaultValue="tests" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tests">
              <BookOpen className="w-4 h-4 mr-2" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="questions">
              <BarChart className="w-4 h-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tests">
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-h2 font-semibold text-foreground">
                  Manage Tests
                </h2>
                <Button className="bg-gradient-growth text-white">
                  Create New Test
                </Button>
              </div>
              <p className="text-body text-muted-foreground">
                Test management interface will be available here. You'll be able to
                create, edit, and publish SAT practice tests.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-h2 font-semibold text-foreground">
                  Question Bank
                </h2>
                <Button className="bg-gradient-growth text-white">
                  Add Question
                </Button>
              </div>
              <p className="text-body text-muted-foreground">
                Question management interface will be available here. You'll be able to
                add, edit, categorize, and manage all SAT questions.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-8">
              <h2 className="text-h2 font-semibold mb-6 text-foreground">
                User Management
              </h2>
              <p className="text-body text-muted-foreground">
                User management interface will be available here. View user accounts,
                activity, and manage admin roles.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-8">
              <h2 className="text-h2 font-semibold mb-6 text-foreground">
                Platform Analytics
              </h2>
              <p className="text-body text-muted-foreground">
                Platform-wide analytics will be available here. Track usage, popular
                tests, and overall performance metrics.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
