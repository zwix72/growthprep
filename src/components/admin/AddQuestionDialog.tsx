import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  test_id: z.string().min(1, "Test is required"),
  section: z.enum(["reading_writing", "math"]),
  module_number: z.coerce.number().min(1).max(2),
  difficulty: z.enum(["easy", "medium", "hard"]),
  question_text: z.string().min(1, "Question text is required"),
  option_a: z.string().min(1, "Option A is required"),
  option_b: z.string().min(1, "Option B is required"),
  option_c: z.string().min(1, "Option C is required"),
  option_d: z.string().min(1, "Option D is required"),
  correct_answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(1, "Explanation is required"),
  rw_domain: z.enum(["information_ideas", "craft_structure", "expression_ideas", "standard_english"]).optional(),
  math_domain: z.enum(["algebra", "advanced_math", "problem_solving_data", "geometry_trig"]).optional(),
  topic: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddQuestionDialog({ open, onOpenChange, onSuccess }: AddQuestionDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<Array<{ id: string; title: string }>>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section: "reading_writing",
      module_number: 1,
      difficulty: "medium",
      correct_answer: "A",
    },
  });

  const section = form.watch("section");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    const { data } = await supabase
      .from("tests")
      .select("id, title")
      .order("created_at", { ascending: false });
    
    if (data) setTests(data);
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("questions").insert({
        test_id: values.test_id,
        section: values.section,
        module_number: values.module_number,
        difficulty: values.difficulty,
        question_text: values.question_text,
        option_a: values.option_a,
        option_b: values.option_b,
        option_c: values.option_c,
        option_d: values.option_d,
        correct_answer: values.correct_answer,
        explanation: values.explanation,
        rw_domain: values.section === "reading_writing" ? values.rw_domain : null,
        math_domain: values.section === "math" ? values.math_domain : null,
        topic: values.topic || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question added successfully",
      });

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Add a question to a practice test
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="test_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a test" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tests.map((test) => (
                          <SelectItem key={test.id} value={test.id}>
                            {test.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reading_writing">Reading & Writing</SelectItem>
                          <SelectItem value="math">Math</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="module_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Module 1</SelectItem>
                          <SelectItem value="2">Module 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {section === "reading_writing" && (
                <FormField
                  control={form.control}
                  name="rw_domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RW Domain</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="information_ideas">Information & Ideas</SelectItem>
                          <SelectItem value="craft_structure">Craft & Structure</SelectItem>
                          <SelectItem value="expression_ideas">Expression of Ideas</SelectItem>
                          <SelectItem value="standard_english">Standard English Conventions</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {section === "math" && (
                <FormField
                  control={form.control}
                  name="math_domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Math Domain</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="algebra">Algebra</SelectItem>
                          <SelectItem value="advanced_math">Advanced Math</SelectItem>
                          <SelectItem value="problem_solving_data">Problem-Solving & Data Analysis</SelectItem>
                          <SelectItem value="geometry_trig">Geometry & Trigonometry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Linear Equations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the question..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="option_a"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option A</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="option_b"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option B</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="option_c"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option C</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="option_d"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option D</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="correct_answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explanation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why this is the correct answer..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Question"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
