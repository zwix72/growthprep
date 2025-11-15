import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

export const BulkQuestionUpload = () => {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      const questions = JSON.parse(jsonInput);
      
      if (!Array.isArray(questions)) {
        throw new Error("Input must be an array of questions");
      }

      const { error } = await supabase
        .from('questions')
        .insert(questions);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${questions.length} questions uploaded successfully`,
      });

      setJsonInput("");
      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload (JSON)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Questions (JSON)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>JSON Array of Questions</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Paste a JSON array of question objects. Each question should include: test_id, section, module_number, 
              question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, 
              and optional domain fields (rw_domain or math_domain).
            </p>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"test_id":"uuid","section":"math","module_number":1,"question_text":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","correct_answer":"A","explanation":"...","difficulty":"medium","math_domain":"algebra"}]'
              rows={15}
              className="font-mono text-sm"
            />
          </div>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Example format:</p>
            <pre className="text-xs overflow-x-auto">{`[
  {
    "test_id": "test-uuid-here",
    "section": "math",
    "module_number": 1,
    "question_text": "What is 2+2?",
    "option_a": "3",
    "option_b": "4",
    "option_c": "5",
    "option_d": "6",
    "correct_answer": "B",
    "explanation": "2+2=4",
    "difficulty": "easy",
    "math_domain": "algebra"
  }
]`}</pre>
          </div>
          <Button onClick={handleBulkUpload} disabled={loading} className="w-full">
            {loading ? "Uploading..." : "Upload Questions"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
