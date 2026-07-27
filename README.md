# Resulyra

Resulyra is a resume product that combines a guided resume builder with the
existing AI-powered ATS analyzer. Users can create a resume, switch between
original templates, export to PDF, and review an existing resume from the same
product.

This version intentionally uses local browser storage. Authentication and
database persistence can be added later without changing the resume document
model or editor structure.

## Product features

### Resume builder

- Six original, copyright-safe resume templates
- Guided editing for personal details, summary, work, education, projects, and
  skills
- Live document preview while editing
- Template switching without losing content
- Resume strength indicator
- Undo and redo history
- Local draft autosave
- Start-fresh flow for a blank resume
- Responsive editing and preview experience
- A4 print and save-as-PDF export

### ATS analyzer

- Drag-and-drop PDF and DOCX upload
- Client-side PDF text extraction
- Server-side DOCX extraction
- AI-powered ATS scoring
- Keyword gap identification
- Strengths and weaknesses
- Prioritized improvement suggestions
- Direct route back into the resume builder

### Product experience

- Product landing page with clear builder and analyzer entry points
- Shared brand, navigation, and footer
- Responsive layouts for desktop and mobile
- Route-specific metadata
- Copyright-safe template messaging

## Templates

All templates were designed specifically for this project. They use common
resume structures and typography conventions rather than copying third-party
template artwork.

| Template | Style | Best suited for |
| --- | --- | --- |
| Meridian | Fresh portrait layout | Product, people, and operations |
| Editorial | Timeless single column | Academia, law, and consulting |
| Summit | Executive profile panel | Leadership and management |
| Column | Minimal information layout | ATS-first applications |
| Horizon | Contemporary portrait layout | Education, research, and creative |
| Blueprint | Technical grid sidebar | Software and data roles |

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page and template gallery |
| `/builder` | Interactive resume builder |
| `/builder?template=nova` | Builder with a selected template |
| `/analyzer` | Existing ATS analyzer |
| `/api/analyze` | Resume analysis API |

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide icons
- OpenAI SDK with Groq
- PDF.js and Mammoth document extraction
- Browser `localStorage` for temporary draft persistence

## Getting started

### Prerequisites

- Node.js 18 or newer
- A Groq API key for analyzer requests

### Install

```bash
npm install
```

### Environment

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

The builder and all template features run without an API key. The key is only
required when using the ATS analyzer.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verification

```bash
npm run lint
npm run build
```

### Production

```bash
npm start
```

## Project structure

```text
src/
├── app/
│   ├── analyzer/page.tsx
│   ├── api/analyze/route.ts
│   ├── builder/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/
│   │   ├── ATSDashboard.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingState.tsx
│   │   └── ResumeAnalyzer.tsx
│   ├── layout/
│   │   ├── SiteFooter.tsx
│   │   └── SiteHeader.tsx
│   ├── resume/
│   │   ├── EditorFields.tsx
│   │   ├── ResumeBuilder.tsx
│   │   ├── ResumeEditor.tsx
│   │   ├── ResumePreview.tsx
│   │   └── TemplateThumbnail.tsx
│   └── ui/
├── lib/
│   ├── extractors/
│   ├── services/
│   └── resume-data.ts
└── types/
    ├── index.ts
    └── resume.ts
```

## Persistence upgrade path

The builder reads and writes a single versioned local draft under
`resulyra-draft-v1`. Existing drafts stored under the former product key are
migrated automatically. When database and authentication work begins, the
`ResumeData` type in `src/types/resume.ts` can be used as the stored document
shape. Replace the local save/load effects in `ResumeBuilder.tsx` with
authenticated API calls while preserving the editor and preview components.

## License

MIT
