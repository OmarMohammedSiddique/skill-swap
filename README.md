# SkillSwap 🤝

A peer-to-peer learning platform that solves the "double coincidence of wants" problem in skill exchange. Built with Next.js, TypeScript, and Graph Theory logic.

## 🚀 The Concept
SkillSwap eliminates the need for monetary transactions in education by using a **Bipartite Matching Algorithm**.
- Users list what they can **Teach** (Supply).
- Users list what they want to **Learn** (Demand).
- The system identifies cycles where `User A(Teach X, Want Y)` matches `User B(Teach Y, Want X)`.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **UI System:** Shadcn/ui (Radix Primitives)
- **Backend:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (JWT)
- **Deployment:** Vercel

## ⚡ Features
- **Instant Matching Engine:** Real-time SQL queries to find compatible peer pairs.
- **Secure Authentication:** Robust user sessions via Supabase.
- **Direct Connection:** Integrated WhatsApp API for instant peer communication.

## 🏃‍♂️ How to Run Locally
1. Clone the repo:
   ```bash
   git clone [https://github.com/yourusername/skill-swap.git](https://github.com/yourusername/skill-swap.git)
Install dependencies:

Bash
npm install
Set up environment variables in .env.local:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
Run the development server:

Bash
npm run dev
🔮 Future Roadmap
[ ] Implement Circular Matching (A->B->C->A) for non-direct swaps.

[ ] Add Reputation/Rating system for teachers.
