


<div align="center">
  <img src="./public/resuvee-mark.webp" alt="Resuvee Logo" width="80" height="80" style="border-radius: 18px;" />

# Resuvee

**AI-Powered ATS Resume Builder, Smart Analyzer & Career Studio**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq AI](https://img.shields.io/badge/Groq-Fast_LLM_Inference-F55036?style=flat&logo=fastapi&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat)](./LICENSE)
</div>

---

## System Overview

**Resuvee** is a modern, privacy-first career document studio that brings together an interactive resume builder, deep AI-powered ATS resume analyzer, smart cover letter generator, and document conversion engine. 

Designed for job seekers and professionals, Resuvee enables users to build ATS-optimized resumes with 16 original templates, perform granular on-canvas edits, analyze resume-to-job keyword alignment with actionable scoring, and export clean vector PDFs alongside native Microsoft Word DOCX files with embedded structured metadata.

---

## Application Video Walkthrough


https://github.com/user-attachments/assets/4c557fdb-a85d-45d2-b6a7-a83df48e1239


<p align="center">
  <em>Demonstration of interactive resume building, ATS compatibility scoring, AI text refinement, multi-page canvas pagination, and vector export.</em>
</p>

---

## Technology Stack

### Frontend Architecture

- **Framework**: Next.js 16.2.4 (App Router, Turbopack, Server Actions)
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5.0 (Strict Mode Enabled)
- **Styling**: Tailwind CSS 4.3.3 (`@theme` design tokens, responsive typography, glassmorphic UI)
- **State Management**: Zustand 5.0 (Reactive multi-step stores with IndexedDB hydration)
- **Icons & Fonts**: Lucide React, Plus Jakarta Sans, Inter, Outfit, Merriweather, Playfair

### AI & Document Processing Engine

- **LLM Inference**: Groq Cloud SDK (`openai/gpt-oss-120b`, Llama 3.3) for ultra-low latency text refinement and ATS scoring
- **Client-Side PDF Extraction**: `pdfjs-dist` (In-browser text layer extraction with zero external upload latency)
- **DOCX Processing**: `mammoth` (Word document text extraction), `jszip` (ZIP archive parsing)
- **DOCX Generation**: `docx` 9.7 (Native Word document XML generator with custom structured resume metadata)
- **Vector PDF Engine**: Precision print stylesheets with automated multi-page sheet pagination

### Cloud & Persistence Layer

- **Authentication & Database**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`, PostgreSQL with Row Level Security)
- **Offline Storage**: Custom IndexedDB Key-Value Stores (`resuvee_resume_db`, `resuvee_cover_letter_db`) for zero-loss offline draft recovery
- **Deployment**: Vercel Edge & Serverless Runtime

### Quality Assurance & Tooling

- **Code Quality**: ESLint 9 (Flat Config), Prettier 3.9
- **Git Hooks**: Husky (Automated pre-commit linting & pre-push build verification)
- **Package Manager**: Bun 1.1+ / npm

---

## Key Features

- **16 Original Copyright-Safe Templates** — Built from the ground up to guarantee high visual appeal and 100% compliance with modern ATS parsers.
- **Interactive Studio Canvas** — Direct on-page element selection, font sizing (`A-`/`A+`), bold/italic formatting, text alignment, and custom color wheel swatches.
- **AI Smart Writing Refiner** — Highlight any bullet point or summary and instantly enhance it with AI for clarity, impact, and action-driven metrics.
- **Deep ATS Compatibility Analyzer** — Upload existing PDF/DOCX resumes to receive an ATS score, keyword gap analysis, strengths, weaknesses, and step-by-step improvement fixes.
- **Smart Cover Letter Studio** — Generate targeted, role-matched cover letters with customizable sections, live formatting, and cloud synchronization.
- **Dual Persistence Architecture** — Work seamlessly offline with IndexedDB local backups and synchronize instantly to your Supabase account upon save.
- **Multi-Page Smart Pagination** — Automatic section overflow calculation and multi-page canvas rendering to eliminate layout overlap.
- **Structured DOCX & PDF Export** — Export clean vector PDFs for applications and Microsoft Word DOCX files with embedded structured XML data for seamless re-importing.

---

## Getting Started

### Prerequisites

- **Bun**: `v1.1.0`+ (Recommended) or **Node.js**: `v20.9.0`+
- **Supabase Account**: Free project from [Supabase](https://supabase.com)
- **Groq API Key**: Free API key from [Groq Console](https://console.groq.com)

### Installation & Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/kuldeeprajput-dev/resuvee.git
   cd resuvee
   ```

2. **Install Dependencies**:

   ```bash
   bun install
   # or npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file from the example:

   ```bash
   cp .env.example .env.local
   ```

4. **Launch Development Server**:

   ```bash
   bun run dev
   # or npm run dev
   ```

   Open your browser at `http://localhost:3000`.

---

## Environment Configuration

Configure your environment variables inside `.env.local`:

```env
# Groq API Key for ATS Resume Analysis, Writing Checks & AI Cover Letter (https://console.groq.com/keys)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# Supabase Project URL & Publishable Key (https://supabase.com/dashboard/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key_here

# Public App URL for SEO & OpenGraph Metadata
NEXT_PUBLIC_APP_URL=https://resuvee.vercel.app
```

### Key Resolution Matrix

| Variable | Scope | Primary Purpose | Required |
| :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | Server-only | API key for high-speed AI text refinement, writing checks, and ATS analysis. | Yes |
| `GROQ_MODEL` | Server-only | Model identifier for Groq LLM inference (defaults to `openai/gpt-oss-120b`). | Optional |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Supabase project API endpoint for authentication and database queries. | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public / Client | Anon/Publishable API key for client-side Supabase authentication. | Yes |
| `NEXT_PUBLIC_APP_URL` | Public / Client | Canonical base URL used for sitemap, robots, and OpenGraph preview images. | Optional |

---

## License

This project is licensed under the [MIT License](./LICENSE) - see the [`LICENSE`](./LICENSE) file for details.

---

## Support & Feedback

If you find this project helpful, please consider giving it a ⭐ star on [GitHub](https://github.com/kuldeeprajput-dev/resuvee)!
