import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, BookOpen, Users, BarChart, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateTestDialog } from "@/components/admin/CreateTestDialog";
import { AddQuestionDialog } from "@/components/admin/AddQuestionDialog";
import { BulkQuestionUpload } from "@/components/admin/BulkQuestionUpload";
import { Badge } from "@/components/ui/badge";

type Test = {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
};

type Question = {
  id: string;
  question_text: string;
  section: string;
  difficulty: string;
  test_id: string;
  tests: { title: string } | null;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadTests();
      loadQuestions();
    }
  }, [isAdmin]);

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

  const loadTests = async () => {
    const { data } = await supabase
      .from("tests")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setTests(data);
  };

  const loadQuestions = async () => {
    const { data } = await supabase
      .from("questions")
      .select("id, question_text, section, difficulty, test_id, tests(title)")
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (data) setQuestions(data as Question[]);
  };

  const deleteTest = async (testId: string) => {
    if (!confirm("Are you sure? This will delete all questions in this test.")) return;

    const { error } = await supabase.from("tests").delete().eq("id", testId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete test",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Test deleted" });
      loadTests();
      loadQuestions();
    }
  };

  const togglePublish = async (testId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("tests")
      .update({ is_published: !currentStatus })
      .eq("id", testId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update test",
        variant: "destructive",
      });
    } else {
      toast({ 
        title: "Success", 
        description: !currentStatus ? "Test published" : "Test unpublished" 
      });
      loadTests();
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    const { error } = await supabase.from("questions").delete().eq("id", questionId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Question deleted" });
      loadQuestions();
    }
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
                <Button 
                  className="bg-gradient-growth text-white"
                  onClick={() => setCreateTestOpen(true)}
                >
                  Create New Test
                </Button>
              </div>
              <CreateTestDialog open={createTestOpen} onOpenChange={setCreateTestOpen} onSuccess={loadTests} />

              <div className="space-y-4">
                {tests.length === 0 ? (
                  <p className="text-body text-muted-foreground text-center py-8">
                    No tests created yet. Click "Create New Test" to add one.
                  </p>
                ) : (
                  tests.map((test) => (
                    <Card key={test.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {test.title}
                            </h3>
                            <Badge variant={test.is_published ? "default" : "secondary"}>
                              {test.is_published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          {test.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {test.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(test.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePublish(test.id, test.is_published)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {test.is_published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTest(test.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-h2 font-semibold text-foreground">
                  Question Bank
                </h2>
                <div className="flex gap-2">
                  <Button 
                    className="bg-gradient-growth text-white"
                    onClick={() => setAddQuestionOpen(true)}
                  >
                    Add Question
                  </Button>
                  <BulkQuestionUpload />
                </div>
              </div>
              <AddQuestionDialog open={addQuestionOpen} onOpenChange={setAddQuestionOpen} onSuccess={loadQuestions} />

              <div className="space-y-3">
                {questions.length === 0 ? (
                  <p className="text-body text-muted-foreground text-center py-8">
                    No questions added yet. Click "Add Question" to create one.
                  </p>
                ) : (
                  questions.map((question) => (
                    <Card key={question.id} className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                            {question.question_text}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {question.tests?.title || "No Test"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.section === "reading_writing" ? "R&W" : "Math"}
                            </Badge>
                            <Badge 
                              variant={
                                question.difficulty === "easy" ? "default" :
                                question.difficulty === "medium" ? "secondary" : "destructive"
                              }
                              className="text-xs"
                            >
                              {question.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
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

      <CreateTestDialog
        open={createTestOpen}
        onOpenChange={setCreateTestOpen}
        onSuccess={loadTests}
      />

      <AddQuestionDialog
        open={addQuestionOpen}
        onOpenChange={setAddQuestionOpen}
        onSuccess={loadQuestions}
      />
    </div>
  );
};

export default Admin;
