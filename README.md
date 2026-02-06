# IS4GI.dev — Creative Portfolio

A cinematic, high-end portfolio built for showcase. Featuring immersive scrollytelling, glassmorphism aesthetics, and a powerful custom admin dashboard.

## ✨ Key Features

- **Cinematic Scrollytelling**: 3D-like image sequence animations that respond to scroll.
- **Dynamic Arsenal**: Manage showcased devices with custom start frames and alternating layouts.
- **Premium UI**: Built with Next.js, Framer Motion, and Vanilla CSS for a fluid, high-performance experience.
- **Admin Dashboard**: Full control over projects, gear, profile, and sequences.
- **Bi-lingual Support**: English and Indonesian localization.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database/Auth**: [Supabase](https://supabase.com/)
- **Storage**: Supabase Storage (for high-resolution sequences)

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/FikriBintangx/myportofolio.git
   cd myportofolio
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Setup**
   Run the SQL scripts provided in `SUPABASE_SETUP.md` within your Supabase SQL Editor.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## 📦 Deployment

Deploy easily on [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import project to Vercel.
3. Add Environment Variables.
4. Deployment complete.

---
Built with 🖤 by Fikri Bintang.
