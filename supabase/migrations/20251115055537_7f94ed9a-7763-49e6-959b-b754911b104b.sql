-- Create enum types
CREATE TYPE public.question_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.question_section AS ENUM ('reading_writing', 'math');
CREATE TYPE public.rw_domain AS ENUM ('information_ideas', 'craft_structure', 'expression_ideas', 'standard_english');
CREATE TYPE public.math_domain AS ENUM ('algebra', 'advanced_math', 'problem_solving_data', 'geometry_trig');

-- Tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section question_section NOT NULL,
  module_number INTEGER NOT NULL CHECK (module_number IN (1, 2)),
  difficulty question_difficulty NOT NULL,
  rw_domain rw_domain,
  math_domain math_domain,
  topic TEXT,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User test attempts
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_score INTEGER,
  rw_score INTEGER,
  math_score INTEGER,
  rw_correct INTEGER,
  rw_total INTEGER,
  math_correct INTEGER,
  math_total INTEGER
);

-- User answers
CREATE TABLE public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN,
  time_spent INTEGER,
  is_marked BOOLEAN DEFAULT false,
  answered_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Saved questions
CREATE TABLE public.saved_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- User roles for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Enable RLS
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tests (everyone can view published tests)
CREATE POLICY "Anyone can view published tests"
  ON public.tests FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage tests"
  ON public.tests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for questions
CREATE POLICY "Anyone can view questions from published tests"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = questions.test_id
      AND (tests.is_published = true OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for test attempts
CREATE POLICY "Users can view own attempts"
  ON public.test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts"
  ON public.test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts"
  ON public.test_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user answers
CREATE POLICY "Users can view own answers"
  ON public.user_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE test_attempts.id = user_answers.attempt_id
      AND test_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own answers"
  ON public.user_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE test_attempts.id = user_answers.attempt_id
      AND test_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own answers"
  ON public.user_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.test_attempts
      WHERE test_attempts.id = user_answers.attempt_id
      AND test_attempts.user_id = auth.uid()
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for saved questions
CREATE POLICY "Users can manage own saved questions"
  ON public.saved_questions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for user roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON public.tests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();