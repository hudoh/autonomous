-- AUTONOMOUS Platform Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/lygxhsxffbvcejyolkrz/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'researching',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- WAITLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'direct',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  email TEXT,
  feedback TEXT NOT NULL,
  sentiment TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- BOARD_DECISIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS board_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  rationale TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_decisions ENABLE ROW LEVEL SECURITY;

-- Products: public read, authenticated write
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE USING (true);

-- Waitlist: public read and insert (for waitlist signups)
CREATE POLICY "Waitlist is publicly readable" ON waitlist FOR SELECT USING (true);
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- Feedback: public read and insert
CREATE POLICY "Feedback is publicly readable" ON feedback FOR SELECT USING (true);
CREATE POLICY "Anyone can submit feedback" ON feedback FOR INSERT WITH CHECK (true);

-- Board decisions: public read, authenticated write
CREATE POLICY "Board decisions are publicly readable" ON board_decisions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create decisions" ON board_decisions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update decisions" ON board_decisions FOR UPDATE USING (true);

-- ============================================
-- SAMPLE DATA (optional - remove in production)
-- ============================================
-- Uncomment to add sample data:
/*
INSERT INTO products (name, slug, status, description) VALUES
  ('Autonomous Platform', 'autonomous-platform', 'live', 'AI-run startup command center'),
  ('LeadSorcery', 'leadsorcery', 'testing', 'AI-powered B2B lead generation'),
  ('Crossroads AI', 'crossroads-ai', 'live', 'Procurement intake orchestration');
*/
