
PadhAI/
├── app/
│   ├── api/                    # API routes
│   │   ├── upload/            # PDF upload endpoint
│   │   ├── generate/          # AI content generation
│   │   ├── quiz/submit/       # Quiz submission & scoring
│   │   └── youtube/           # YouTube recommendations
│   ├── dashboard/             # Dashboard pages
│   │   ├── page.tsx          # Dashboard home
│   │   ├── upload/           # PDF upload page
│   │   ├── documents/        # Documents library
│   │   ├── flashcards/       # Flashcard practice
│   │   ├── quizzes/          # Quiz interface
│   │   ├── kid-mode/         # Gamified kid mode
│   │   ├── progress/         # Progress analytics
│   │   ├── teacher/          # Teacher dashboard
│   │   └── settings/         # Settings page
│   ├── globals.css           # Global styles & utilities
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/               # Reusable components
│   ├── cta-section.tsx
│   ├── faq-section.tsx
│   ├── footer-section.tsx
│   ├── pricing-section.tsx
│   └── testimonials-section.tsx
├── types/
│   └── index.ts              # TypeScript type definitions
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md
```

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0a` (Deep black)
- **Cards**: `rgba(255, 255, 255, 0.03)` with backdrop blur
- **Primary Orange**: `#f97316` (3D button gradient)
- **Neon Accents**: Purple `#a855f7`, Pink `#ec4899`, Blue `#3b82f6`, Cyan `#06b6d4`

### Custom CSS Classes
- `.btn-3d-orange` - Primary 3D orange button
- `.btn-3d-orange-secondary` - Secondary button variant
- `.dark-card` - Standard dark card with glass effect
- `.dark-card-elevated` - Elevated card with stronger shadow
- `.text-gradient-neon` - Neon gradient text effect
- `.neon-border` - Animated neon border

## 🔧 Technology Stack

### Frontend
- **Next.js 14.2.25** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Backend (Production Setup)
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL / Supabase** - Database for user data and content
- **OpenAI API** - AI content generation (summaries, flashcards, quizzes)
- **YouTube Data API v3** - Video recommendations
- **AWS S3 / Cloudflare R2** - PDF file storage
- **pdf-parse** - PDF text extraction

### Authentication (To Be Integrated)
- **NextAuth.js** or **Clerk** - User authentication
- **JWT** - Session management

## 🔌 API Endpoints

### PDF Upload
```
POST /api/upload
- Accepts: multipart/form-data (file + optional prompt)
- Returns: Document ID and processing status
```

### AI Content Generation
```
POST /api/generate
Body: {
  documentId: string,
  contentType: "summary" | "flashcards" | "quiz" | "all",
  difficulty?: "easy" | "medium" | "hard",
  language?: string
}
Returns: Generated content based on type
```

### Quiz Submission
```
POST /api/quiz/submit
Body: {
  quizId: string,
  userId: string,
  answers: Record<string, number>,
  timeSpent: number
}
Returns: Quiz results with score, percentage, and achievements
```

### YouTube Recommendations
```
GET /api/youtube/recommendations?topic={topic}&limit={limit}
Returns: List of relevant educational videos
```

## 📊 Database Schema (Recommended)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student', -- student, teacher, parent
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  file_url TEXT,
  extracted_text TEXT,
  status VARCHAR(50) DEFAULT 'processing', -- processing, completed, failed
  created_at TIMESTAMP DEFAULT NOW()
);

-- Flashcards Table
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  difficulty VARCHAR(50),
  mastery_level INTEGER DEFAULT 0
);

-- Quizzes Table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  title VARCHAR(255),
  difficulty VARCHAR(50),
  time_limit INTEGER, -- in seconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Submissions Table
CREATE TABLE quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES users(id),
  score INTEGER,
  percentage INTEGER,
  time_spent INTEGER,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add environment variables
4. Deploy

### Manual Deployment
```bash
# Build the production app
npm run build

# Start the production server
npm start
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for content generation | Yes |
| `YOUTUBE_API_KEY` | YouTube Data API key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `STORAGE_BUCKET` | Cloud storage bucket name | Yes |

## 📝 Features Roadmap

### Phase 1 (MVP - Current)
- ✅ Landing page with dark theme
- ✅ Dashboard UI with navigation
- ✅ PDF upload interface
- ✅ Documents library
- ✅ Flashcards practice
- ✅ Quiz system
- ✅ Kid Mode
- ✅ Progress analytics
- ✅ Teacher dashboard
- ✅ Settings page
- ✅ API routes (mock implementation)

### Phase 2 (Production)
- 🔄 Real PDF text extraction (pdf-parse)
- 🔄 OpenAI integration for content generation
- 🔄 Database integration (PostgreSQL/Supabase)
- 🔄 Authentication system (NextAuth.js/Clerk)
- 🔄 File storage (AWS S3/Cloudflare R2)
- 🔄 YouTube Data API integration

### Phase 3 (Advanced Features)
- ⏳ Text-to-speech for read-aloud functionality
- ⏳ AI Q&A chatbot for document questions
- ⏳ Real-time collaboration for teachers
- ⏳ Mobile app (React Native)
- ⏳ Offline mode with service workers
- ⏳ Advanced analytics with charts (Chart.js/Recharts)
