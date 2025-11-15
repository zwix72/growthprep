-- Create user_stats table for tracking achievements and progress
CREATE TABLE IF NOT EXISTS public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level integer NOT NULL DEFAULT 1,
  xp integer NOT NULL DEFAULT 0,
  total_questions_answered integer NOT NULL DEFAULT 0,
  streak_days integer NOT NULL DEFAULT 0,
  last_activity_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  xp_reward integer NOT NULL DEFAULT 0,
  requirement_type text NOT NULL, -- 'questions_answered', 'tests_completed', 'streak_days', 'score_achieved'
  requirement_value integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user_achievements junction table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_stats
CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for updating user_stats updated_at
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert default achievements
INSERT INTO public.achievements (key, name, description, icon, xp_reward, requirement_type, requirement_value) VALUES
  ('first_question', 'First Steps', 'Answer your first question', '🌱', 10, 'questions_answered', 1),
  ('ten_questions', 'Getting Started', 'Answer 10 questions', '🌿', 50, 'questions_answered', 10),
  ('fifty_questions', 'Practice Makes Perfect', 'Answer 50 questions', '🌳', 100, 'questions_answered', 50),
  ('hundred_questions', 'Dedicated Learner', 'Answer 100 questions', '🎯', 200, 'questions_answered', 100),
  ('first_test', 'Test Taker', 'Complete your first practice test', '📝', 100, 'tests_completed', 1),
  ('five_tests', 'Serial Tester', 'Complete 5 practice tests', '📚', 250, 'tests_completed', 5),
  ('three_day_streak', 'Consistent', 'Maintain a 3-day streak', '🔥', 75, 'streak_days', 3),
  ('week_streak', 'Weekly Warrior', 'Maintain a 7-day streak', '⚡', 150, 'streak_days', 7),
  ('perfect_score', 'Perfectionist', 'Achieve a perfect score on any test', '🏆', 500, 'score_achieved', 1600)
ON CONFLICT (key) DO NOTHING;