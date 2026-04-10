# AUTONOMOUS — Product Intelligence Platform

## What is AUTONOMOUS?
AUTONOMOUS is TheMcQ's product intelligence & autonomous building platform — a system where:
1. The Research Agent identifies product opportunities
2. Chief (Apex) proposes Board Decisions
3. Bruce votes on decisions
4. If approved → Builder Agent spins up the MVP autonomously

**Goal**: Build an autonomous product development machine that surfaces opportunities, gets rapid human sign-off, and ships MVPs fast.

---

## Production Status
- **Live URL**: https://autonomous-nine.vercel.app
- **Repo**: https://github.com/hudoh/autonomous
- **Stack**: Next.js 16 · TypeScript · Supabase · Tailwind CSS
- **Color Scheme**: Navy #0f2942 + White + Amber #f59e0b
- **Supabase**: `yjpbployzwpsybkcvesg` (dedicated autonomous project)
- **Vercel Project**: hudohs-projects/autonomous

---

## Pages
1. `/dashboard` — Central hub
2. `/products` — Product pipeline with status badges
3. `/products/[id]` — Product brief editor
4. `/products/[id]/waitlist` — Signup table + CSV export
5. `/products/[id]/feedback` — Sentiment analysis + trend charts
6. `/board` — Decision approval portal (password: `board_password`)
7. `/[slug]` — Public landing pages per product with email capture

---

## Features
- Full CRUD for products, waitlists, feedback, board decisions
- Real-time Supabase data
- Responsive Tailwind UI
- Board page password protection
- Public landing pages with email capture forms
- CSV export for waitlists

---

## Tech Stack
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel
- **Styling**: Custom navy/amber theme

---

## Database Schema (Supabase `yjpbployzwpsybkcvesg`)
- `products` — id, name, slug, status, description, created_at, updated_at
- `waitlist` — id, product_id, email, source, created_at
- `feedback` — id, product_id, email, feedback, sentiment, created_at
- `board_decisions` — id, product_id, decision, rationale, status, outcome, created_at

---

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://yjpbployzwpsybkcvesg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_BOARD_PASSWORD=board_password
```

---

## Model Configuration
- **Primary**: studio-coder/qwen3-coder-30b-a3b-instruct-mlx
- **Fallback**: minimax/MiniMax-M2.7-highspeed
- **Channel**: #autonomous (Discord: 1492280775804977162)

---

## Local Development
```bash
cd ~/autonomous
npm run dev
```

---

## Next Steps
1. Add first product through the board
2. Wire up the builder agent (studio-coder) for approved MVPs
3. Set up research → chief proposal → board vote → build flow
