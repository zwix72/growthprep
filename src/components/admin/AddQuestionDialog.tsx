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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MathText } from "@/components/MathText";
import { Info } from "lucide-react";

const formSchema = z.object({
  question_type: z.enum(["practice_test", "topic_practice"]),
  test_id: z.string().optional(),
  section: z.enum(["reading_writing", "math"]),
  rw_domain: z.enum(["information_ideas", "craft_structure", "expression_ideas", "standard_english"]).optional(),
  math_domain: z.enum(["algebra", "advanced_math", "problem_solving_data", "geometry_trig"]).optional(),
  module_number: z.coerce.number().min(1).max(2),
  difficulty: z.enum(["easy", "medium", "hard"]),
  question_text: z.string().min(1, "Question text is required"),
  option_a: z.string().min(1, "Option A is required"),
  option_b: z.string().min(1, "Option B is required"),
  option_c: z.string().min(1, "Option C is required"),
  option_d: z.string().min(1, "Option D is required"),
  correct_answer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(1, "Explanation is required"),
}).refine(
  (data) => {
    if (data.question_type === "practice_test" && !data.test_id) {
      return false;
    }
    return true;
  },
  {
    message: "Test selection is required for practice test questions",
    path: ["test_id"],
  }
).refine(
  (data) => {
    if (data.section === "reading_writing" && !data.rw_domain) {
      return false;
    }
    if (data.section === "math" && !data.math_domain) {
      return false;
    }
    return true;
  },
  {
    message: "Domain is required",
    path: ["rw_domain"],
  }
);

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
      question_type: "practice_test",
      test_id: "",
      section: "reading_writing",
      module_number: 1,
      difficulty: "medium",
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
      explanation: "",
    },
  });

  const questionType = form.watch("question_type");
  const section = form.watch("section");
  const questionText = form.watch("question_text");
  const optionA = form.watch("option_a");
  const optionB = form.watch("option_b");
  const optionC = form.watch("option_c");
  const optionD = form.watch("option_d");

  useEffect(() => {
    if (open) {
      loadTests();
    }
  }, [open]);

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
      const insertData: any = {
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
      };

      // Add test_id only if it's a practice test
      if (values.question_type === "practice_test" && values.test_id) {
        insertData.test_id = values.test_id;
      }

      // Add domain based on section
      if (values.section === "reading_writing" && values.rw_domain) {
        insertData.rw_domain = values.rw_domain;
      } else if (values.section === "math" && values.math_domain) {
        insertData.math_domain = values.math_domain;
      }

      const { error } = await supabase.from("questions").insert(insertData);

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

  const domainLabels = {
    information_ideas: "Information and Ideas",
    craft_structure: "Craft and Structure",
    expression_ideas: "Expression of Ideas",
    standard_english: "Standard English Conventions",
    algebra: "Algebra",
    advanced_math: "Advanced Math",
    problem_solving_data: "Problem Solving and Data Analysis",
    geometry_trig: "Geometry and Trigonometry",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Add a question for practice tests or topic practice
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Question Type */}
            <FormField
              control={form.control}
              name="question_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="practice_test" id="practice_test" />
                        <Label htmlFor="practice_test">Practice Test</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="topic_practice" id="topic_practice" />
                        <Label htmlFor="topic_practice">Topic Practice</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Test Selection - Only for Practice Test */}
            {questionType === "practice_test" && (
              <FormField
                control={form.control}
                name="test_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Test</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select a test" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
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
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Section */}
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="reading_writing">Reading & Writing</SelectItem>
                        <SelectItem value="math">Math</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Module Number */}
              <FormField
                control={form.control}
                name="module_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Number</FormLabel>
                    <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="1">Module 1</SelectItem>
                        <SelectItem value="2">Module 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Domain Selection */}
            {section === "reading_writing" && (
              <FormField
                control={form.control}
                name="rw_domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading & Writing Domain</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="information_ideas">{domainLabels.information_ideas}</SelectItem>
                        <SelectItem value="craft_structure">{domainLabels.craft_structure}</SelectItem>
                        <SelectItem value="expression_ideas">{domainLabels.expression_ideas}</SelectItem>
                        <SelectItem value="standard_english">{domainLabels.standard_english}</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="algebra">{domainLabels.algebra}</SelectItem>
                        <SelectItem value="advanced_math">{domainLabels.advanced_math}</SelectItem>
                        <SelectItem value="problem_solving_data">{domainLabels.problem_solving_data}</SelectItem>
                        <SelectItem value="geometry_trig">{domainLabels.geometry_trig}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Difficulty */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Text */}
            <FormField
              control={form.control}
              name="question_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the question..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((letter) => (
                <FormField
                  key={letter}
                  control={form.control}
                  name={`option_${letter.toLowerCase()}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option {letter}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Option ${letter}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Correct Answer */}
            <FormField
              control={form.control}
              name="correct_answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background z-50">
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

            {/* Explanation */}
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this is the correct answer..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Math Help Card */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-2 items-start">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">Math Notation Help:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Inline math: <code className="bg-blue-100 px-1 rounded">$x^2$</code> → x²</li>
                    <li>• Display math: <code className="bg-blue-100 px-1 rounded">$$\frac{`{a}{b}`}$$</code> → fraction a/b</li>
                    <li>• Fractions: <code className="bg-blue-100 px-1 rounded">\frac{`{3}{4}`}</code></li>
                    <li>• Powers: <code className="bg-blue-100 px-1 rounded">x^{`{2}`}</code> or <code className="bg-blue-100 px-1 rounded">x^2</code></li>
                    <li>• Square root: <code className="bg-blue-100 px-1 rounded">\sqrt{`{x}`}</code></li>
                    <li>• Pi: <code className="bg-blue-100 px-1 rounded">\pi</code>, Modulus: <code className="bg-blue-100 px-1 rounded">|x|</code></li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Preview Section */}
            {(questionText || optionA || optionB || optionC || optionD) && (
              <Card className="p-4 bg-gray-50">
                <h3 className="font-semibold mb-3 text-sm">Preview:</h3>
                {questionText && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Question:</p>
                    <MathText text={questionText} className="text-sm" />
                  </div>
                )}
                <div className="space-y-2">
                  {[
                    { label: "A", text: optionA },
                    { label: "B", text: optionB },
                    { label: "C", text: optionC },
                    { label: "D", text: optionD }
                  ].map(option => option.text && (
                    <div key={option.label} className="flex gap-2">
                      <span className="text-xs font-medium text-gray-500">{option.label}.</span>
                      <MathText text={option.text} className="text-sm flex-1" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="flex justify-end gap-3">
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
      </DialogContent>
    </Dialog>
  );
}
