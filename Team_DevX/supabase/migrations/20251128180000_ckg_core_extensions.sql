-- Create ministries table if not exists
CREATE TABLE IF NOT EXISTS public.ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add embedding columns to problems and solutions tables
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE public.solutions ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 3. Create problem_relationships table for semantic similarity edges
CREATE TABLE IF NOT EXISTS public.problem_relationships (
  id BIGSERIAL PRIMARY KEY,
  problem_id_a UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  problem_id_b UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  similarity_score FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  relationship_type TEXT DEFAULT 'semantic',
  UNIQUE(problem_id_a, problem_id_b)
);

-- 4. Create solution_approvals table for ministry validation of solutions
CREATE TABLE IF NOT EXISTS public.solution_approvals (
  id BIGSERIAL PRIMARY KEY,
  solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
  ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE,
  approved BOOLEAN DEFAULT TRUE,
  approved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(solution_id, ministry_id)
);

-- 5. Create ministry_regions table for ministry-region relationships
CREATE TABLE IF NOT EXISTS public.ministry_regions (
  id BIGSERIAL PRIMARY KEY,
  ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE,
  region_code TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ministry_id, region_code)
);

-- 6. Create location table if not already present
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT,
  region TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  population_density INTEGER,
  region_code TEXT UNIQUE
);

-- 7. Placeholder for embedding generation and similarity functions
-- These will be implemented as Supabase functions or external jobs
-- Example: generate_embedding(text), calculate_similarity(vector, vector)
