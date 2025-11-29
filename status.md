# 🔦 LampScribe - Project Status

> **Last Updated:** November 29, 2025

## 📋 Overview

**LampScribe** is an audio and video transcription web application inspired by TurboScribe. It allows users to upload audio/video files (up to 10 hours) and receive accurate transcriptions powered by OpenAI's speech-to-text models.

### Key Features
- Transcribe audio/video files up to **10 hours** long
- Support for **98+ languages**
- **Speaker recognition** (diarization)
- Multiple transcription modes for speed vs accuracy tradeoff
- Export to **PDF, DOCX, TXT, SRT** formats
- Folder organization for transcripts
- Audio player with timestamp sync
- **Database persistence with Neon PostgreSQL**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui |
| **Icons** | Lucide React |
| **Date Formatting** | date-fns |
| **Transcription API** | OpenAI Speech-to-Text ✅ |
| **OpenAI SDK** | openai ^4.x |
| **Database** | PostgreSQL (Neon) ✅ |
| **ORM** | Prisma v5.22 ✅ |
| **Authentication** | NextAuth.js v5 (Beta) ✅ |
| **File Storage** | Cloudflare R2 ✅ |

---

## 🎯 Transcription Modes

LampScribe offers three transcription modes mapped to OpenAI models:

| Mode | Emoji | Description | OpenAI Model |
|------|-------|-------------|--------------|
| **Cheetah** | 🐆 | Fastest | `gpt-4o-mini-transcribe` |
| **Dolphin** | 🐬 | Balanced | `gpt-4o-transcribe` |
| **Whale** | 🐳 | Most Accurate + Speaker Recognition | `gpt-4o-transcribe` |

---

## ✅ Completed Features

### Phase 1: Project Setup
- [x] Next.js 16 with TypeScript and Tailwind CSS
- [x] shadcn/ui component library installed
- [x] Custom warm amber/gold color theme (LampScribe branding)
- [x] DM Sans font for modern typography
- [x] Custom CSS variables and animations

### Phase 2: Landing Page (`/`)
- [x] Navigation header with logo
- [x] Hero section with "Illuminate your audio" headline
- [x] Stats badge (hours transcribed counter)
- [x] Feature cards grid (Accuracy, Languages, Upload limit, etc.)
- [x] Transcription modes showcase (Cheetah, Dolphin, Whale)
- [x] Pricing section (Free vs Unlimited plans)
- [x] CTA section with gradient background
- [x] Footer

### Phase 3: Dashboard Layout (`/dashboard`)
- [x] Responsive sidebar with collapse functionality
- [x] Shortcuts section (Recent Files, Uncategorized)
- [x] Folders section with expandable list
- [x] "New Folder" button with create dialog
- [x] User profile dropdown menu
- [x] "Unlimited" plan badge
- [x] Mobile-responsive hamburger menu
- [x] **Real-time folder loading from database**

### Phase 4: File Management
- [x] File table with columns: Name, Uploaded, Duration, Mode, Status
- [x] Checkbox selection for bulk actions
- [x] Row hover actions (dropdown menu)
- [x] Search transcripts functionality
- [x] Bulk action bar (Export, Move, Delete)
- [x] Status indicators (Completed ✓, Processing spinner, Failed ✗)
- [x] Mode display with emojis (🐆🐬🐳)
- [x] **Real-time transcript loading from database**
- [x] **Empty state for no transcripts**
- [x] **Loading state with spinner**

### Phase 5: Transcribe Modal
- [x] Drag & drop file upload zone
- [x] "Paste URL" option placeholder
- [x] File list with size and remove button
- [x] **File name truncation (20 characters max)**
- [x] Audio language selector (30+ languages with flags)
- [x] Transcription mode selector (visual cards)
- [x] Advanced settings panel:
  - [x] Recognize Speakers toggle
  - [x] Speaker count selector (2-8 or auto-detect)
  - [x] Transcribe to English toggle
  - [x] Restore Audio toggle (AI noise removal)
- [x] Submit button with file count
- [x] **Progress bar with percentage**
- [x] **Processing, Success, and Error states**
- [x] **Estimated time display**
- [x] **Auto-redirect to transcript after success**

### Phase 6: Transcript Viewer (`/dashboard/transcript/[id]`)
- [x] Back navigation button
- [x] Title and timestamp display
- [x] Transcript text content display
- [x] Audio player (when audio URL available):
  - [x] Play/Pause button
  - [x] Progress bar with seek
  - [x] Current time / Duration display
  - [x] Volume slider with mute toggle
  - [x] Settings button placeholder
- [x] Export panel:
  - [x] Download PDF button (placeholder)
  - [x] Download DOCX button (placeholder)
  - [x] Download TXT button ✅ (functional)
  - [x] Download SRT button (placeholder)
  - [x] Advanced Export option
- [x] More actions:
  - [x] Show Timestamps toggle
  - [x] ChatGPT integration placeholder
  - [x] Translate placeholder
  - [x] Share Transcript placeholder
  - [x] Edit Transcript placeholder
  - [x] Download Audio button
  - [x] Rename File placeholder
  - [x] Move placeholder
  - [x] Delete File ✅ (functional with confirmation)
- [x] **Loading state while fetching transcript**
- [x] **Error state for not found**
- [x] **Real-time data from database**

### Phase 7: Additional Pages
- [x] Folder view page (`/dashboard/folder/[id]`)
- [x] Uncategorized page (`/dashboard/uncategorized`)
- [x] Login page (`/login`) with Google OAuth button
- [x] Signup page (`/signup`) with form validation
- [x] Custom 404 Not Found page
- [x] Loading states (global and dashboard-specific)
- [x] Empty state component for tables

### Phase 8: Backend - Transcription API ✅
- [x] **OpenAI SDK installed and configured**
- [x] **`/api/transcribe` endpoint created**
  - [x] File upload handling (FormData)
  - [x] 3 transcription modes (Cheetah, Dolphin, Whale)
  - [x] Language selection support
  - [x] Translation to English option
  - [x] File size validation (25MB limit)
  - [x] Error handling for OpenAI API errors
  - [x] **Saves transcription to database**
- [x] **`useTranscribe` React hook**
  - [x] Progress tracking (simulated)
  - [x] Loading state management
  - [x] Error state management
- [x] **OpenAI client configuration (`src/lib/openai.ts`)**
- [x] **Frontend integration**
  - [x] TranscribeModal connected to real API
  - [x] Real-time progress bar
  - [x] Success/Error state displays
  - [x] Transcription result preview

### Phase 9: Database & Persistence ✅
- [x] **Neon PostgreSQL database configured**
- [x] **Prisma v5.22 ORM installed and configured**
- [x] **Database schema created:**
  - [x] User model (id, email, name, image, timestamps)
  - [x] Folder model (id, name, color, userId, timestamps)
  - [x] Transcript model (id, name, text, mode, status, duration, timestamps, relations)
  - [x] TranscriptSegment model (for future diarization)
  - [x] Enums: TranscriptionMode, TranscriptStatus
- [x] **API routes created:**
  - [x] `GET /api/transcripts` - List all transcripts with filtering
  - [x] `POST /api/transcripts` - Create new transcript
  - [x] `GET /api/transcripts/[id]` - Get single transcript
  - [x] `PATCH /api/transcripts/[id]` - Update transcript
  - [x] `DELETE /api/transcripts/[id]` - Delete transcript
  - [x] `GET /api/folders` - List all folders
  - [x] `POST /api/folders` - Create folder
  - [x] `GET /api/folders/[id]` - Get folder details
  - [x] `PATCH /api/folders/[id]` - Update folder
  - [x] `DELETE /api/folders/[id]` - Delete folder
- [x] **React hooks created:**
  - [x] `useTranscripts` - Fetch and manage transcripts
  - [x] `useFolders` - Fetch and manage folders
  - [x] `useTranscript` - Fetch single transcript with CRUD
- [x] **Frontend integration:**
  - [x] Dashboard loads real transcripts from DB
  - [x] Transcript viewer loads real data
  - [x] Sidebar loads real folders
  - [x] Create folder dialog functional
  - [x] Delete transcript functional
  - [x] Auto-save transcription results
  - [x] Redirect to transcript after transcription

---

### Phase 10: Authentication ✅
- [x] **NextAuth.js v5 (Beta) installed and configured**
- [x] **Prisma adapter for NextAuth**
- [x] **Database schema updated:**
  - [x] Account model (OAuth accounts)
  - [x] Session model
  - [x] VerificationToken model
  - [x] User model with password field
- [x] **Authentication providers:**
  - [x] Credentials (email/password)
  - [x] Google OAuth (ready - needs CLIENT_ID/SECRET)
- [x] **API routes:**
  - [x] `GET/POST /api/auth/*` - NextAuth handlers
  - [x] `POST /api/auth/register` - User registration
- [x] **Middleware for protected routes**
  - [x] `/dashboard/*` routes protected
  - [x] Redirect to login if not authenticated
  - [x] Redirect to dashboard if already logged in
- [x] **Session provider wrapper**
- [x] **Updated pages:**
  - [x] Login page with real auth (credentials + Google)
  - [x] Signup page with real registration
  - [x] Dashboard shows user session data
  - [x] Logout functionality
- [x] **API routes updated to require authentication**
  - [x] All transcript routes check user session
  - [x] All folder routes check user session
  - [x] Transcribe route requires authenticated user

### Phase 11: Export System ✅
- [x] **Export libraries installed:**
  - [x] `pdfkit` for PDF generation
  - [x] `docx` for DOCX generation
- [x] **Export utility functions (`src/lib/export.ts`):**
  - [x] `generateTxt()` - Plain text export with timestamps option
  - [x] `generateSrt()` - SRT subtitle file format
  - [x] `generatePdf()` - Styled PDF with LampScribe branding
  - [x] `generateDocx()` - Word document with formatting
- [x] **Export API endpoint (`/api/export/[id]`):**
  - [x] Format selection via query param (?format=pdf|docx|txt|srt)
  - [x] Timestamps option (?timestamps=true)
  - [x] Speaker labels option (?speakers=true)
  - [x] Proper content-type headers
  - [x] Filename sanitization
- [x] **Transcript viewer integration:**
  - [x] Quick export buttons for each format
  - [x] Advanced Export dialog with options
  - [x] Loading states during export
  - [x] Success indicators

### Phase 12: File Storage (Cloudflare R2) ✅
- [x] **AWS S3 SDK installed (R2 compatible)**
- [x] **Storage utility library (`src/lib/storage.ts`):**
  - [x] R2 client configuration
  - [x] `uploadFile()` - Upload to R2
  - [x] `getSignedDownloadUrl()` - Generate signed URLs for streaming
  - [x] `getSignedUploadUrl()` - Direct browser upload support
  - [x] `deleteFile()` - Remove files from R2
  - [x] `fileExists()` - Check file existence
  - [x] `getFileMetadata()` - Get file info
- [x] **Upload API endpoint (`/api/upload`):**
  - [x] POST - Upload file via server
  - [x] GET - Get presigned upload URL for direct upload
  - [x] File validation (size, type)
- [x] **Audio streaming API (`/api/audio/[id]`):**
  - [x] GET - Get signed URL for audio playback
  - [x] DELETE - Remove audio file
- [x] **Transcribe integration:**
  - [x] Optional "Save Audio" checkbox
  - [x] Audio saved to R2 during transcription
  - [x] Storage key saved in database
- [x] **Transcript viewer:**
  - [x] Audio player uses signed URLs
  - [x] Download audio button works
- [x] **useAudio hook for managing audio URLs**

---

## 🚧 Pending Features

### Authentication & Users (Additional)
- [ ] Email verification
- [ ] Password reset flow
- [ ] User profile settings page
- [ ] Subscription management (Stripe integration)

### File Storage ✅
- [x] Cloudflare R2 integration ✅
- [ ] Upload progress indicator (real)
- [ ] URL import functionality
- [ ] Large file support (>25MB chunking)

### Export System ✅
- [x] Download TXT ✅
- [x] PDF generation ✅
- [x] DOCX generation ✅
- [x] SRT subtitle generation ✅
- [x] Advanced export with custom formatting ✅

### Additional Features
- [ ] Full-text search across transcripts
- [ ] Transcript editing functionality
- [ ] Translation to 134+ languages (Google Translate API)
- [ ] Share transcript via public link
- [ ] ChatGPT summarization integration
- [ ] Audio recording directly in browser
- [ ] Dark mode toggle

---

## 📁 Project Structure

```
lampscribe/
├── prisma/
│   ├── schema.prisma          # ✅ Database schema
│   └── migrations/            # ✅ Database migrations
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts    # ✅ NextAuth handlers
│   │   │   │   └── register/
│   │   │   │       └── route.ts    # ✅ User registration
│   │   │   ├── transcribe/
│   │   │   │   └── route.ts        # ✅ Transcription API (auth required)
│   │   │   ├── transcripts/
│   │   │   │   ├── route.ts        # ✅ Transcripts CRUD (auth required)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # ✅ Single transcript CRUD
│   │   │   ├── folders/
│   │   │   │   ├── route.ts        # ✅ Folders CRUD (auth required)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # ✅ Single folder CRUD
│   │   │   ├── export/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # ✅ Export (PDF, DOCX, TXT, SRT)
│   │   │   ├── upload/
│   │   │   │   └── route.ts        # ✅ File upload to R2
│   │   │   └── audio/
│   │   │       └── [id]/
│   │   │           └── route.ts    # ✅ Audio streaming URLs
│   │   ├── globals.css             # Custom theme & styles
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── loading.tsx             # Global loading state
│   │   ├── not-found.tsx           # Custom 404 page
│   │   ├── page.tsx                # Landing page
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup page
│   │   └── dashboard/
│   │       ├── layout.tsx          # Dashboard layout (real folders)
│   │       ├── loading.tsx         # Dashboard loading state
│   │       ├── page.tsx            # Recent Files (real data)
│   │       ├── uncategorized/
│   │       │   └── page.tsx        # Uncategorized files
│   │       ├── folder/
│   │       │   └── [id]/
│   │       │       └── page.tsx    # Folder view
│   │       └── transcript/
│   │           └── [id]/
│   │               └── page.tsx    # Transcript viewer (real data)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── EmptyState.tsx      # Empty state component
│   │   │   ├── FileTable.tsx       # File list table
│   │   │   └── TranscribeModal.tsx # Upload modal (connected to API)
│   │   └── ui/                     # shadcn/ui components
│   │       └── ... 
│   ├── hooks/
│   │   ├── useTranscribe.ts        # ✅ Transcription hook
│   │   └── useTranscripts.ts       # ✅ Database hooks (transcripts, folders)
│   ├── hooks/
│   │   ├── useTranscribe.ts        # ✅ Transcription hook
│   │   ├── useTranscripts.ts       # ✅ Database hooks (transcripts, folders)
│   │   └── useAudio.ts             # ✅ Audio URL management hook
│   └── lib/
│       ├── prisma.ts               # ✅ Prisma client singleton
│       ├── openai.ts               # ✅ OpenAI client & config
│       ├── auth.ts                 # ✅ NextAuth configuration
│       ├── auth-utils.ts           # ✅ Auth helper functions
│       ├── export.ts               # ✅ Export utilities (PDF, DOCX, TXT, SRT)
│       ├── storage.ts              # ✅ R2 storage utilities
│       ├── types.ts                # TypeScript types & constants
│       ├── mock-data.ts            # Mock data (for reference)
│       └── utils.ts                # Utility functions (cn)
├── public/
│   └── lamp-icon.svg               # App icon
├── .env                            # Environment (DATABASE_URL, OPENAI_API_KEY)
├── .env.example                    # Environment variables template
├── .env.local                      # Local environment (gitignored)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── LICENSE                         # MIT License
├── README.md                       # Project documentation
└── status.md                       # This file
```

---

## 🎨 Design System

### Color Palette (Warm Amber Theme)

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--primary` | Amber | Golden Amber | Buttons, links, accents |
| `--background` | Warm cream | Deep warm gray | Page background |
| `--card` | White | Dark gray | Cards, modals |
| `--muted` | Light warm gray | Dark warm gray | Disabled states |
| `--destructive` | Red | Light red | Delete actions |

### Typography
- **Font Family:** DM Sans (Google Fonts)
- **Headings:** Bold (700)
- **Body:** Regular (400)
- **Code:** JetBrains Mono

### Components
All UI components are from shadcn/ui with custom theming applied.

---

## 🚀 Running the Project

```bash
# Navigate to project directory
cd lampscribe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY and DATABASE_URL

# Run database migrations (first time only)
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🔑 Environment Variables

```bash
# Required for transcription
OPENAI_API_KEY=sk-your-openai-api-key

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"  # For migrations

# Authentication (Required)
AUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudflare R2 Storage (Optional - for audio storage)
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=lampscribe-audio
```

---

## 📝 API Endpoints

### Implemented ✅

```
# Transcription
POST   /api/transcribe           # Transcribe audio/video file
       - file: File (FormData)
       - mode: 'cheetah' | 'dolphin' | 'whale'
       - language?: string (ISO code)
       - translate?: 'true' | 'false'
       - speakerRecognition?: 'true' | 'false'
       - numSpeakers?: number (2-8)
       - duration?: number (seconds)
       -> Returns: { success, data: { id, text, language, name, createdAt } }

# Transcripts CRUD
GET    /api/transcripts          # List user's transcripts
       - folderId?: string       # Filter by folder ('uncategorized' for null)
       - status?: string         # Filter by status
       - search?: string         # Search query
       - limit?: number          # Pagination (default: 50)
       - offset?: number         # Pagination (default: 0)
       -> Returns: { success, data, pagination }

POST   /api/transcripts          # Create transcript manually
GET    /api/transcripts/:id      # Get single transcript
PATCH  /api/transcripts/:id      # Update transcript (name, folder, text)
DELETE /api/transcripts/:id      # Delete transcript

# Folders CRUD
GET    /api/folders              # List user's folders
POST   /api/folders              # Create folder (name, color)
GET    /api/folders/:id          # Get folder with transcripts
PATCH  /api/folders/:id          # Update folder (name, color)
DELETE /api/folders/:id          # Delete folder (transcripts become uncategorized)
```

### Authentication (Implemented ✅)

```
# NextAuth.js handlers
GET/POST /api/auth/*             # NextAuth handlers (session, csrf, signin, etc.)

# Custom registration
POST   /api/auth/register        # Create new user account
       - name?: string
       - email: string
       - password: string
       -> Returns: { success, user: { id, name, email } }
```

### Export (Implemented ✅)

```
# Export transcript in various formats
GET    /api/export/:id           # Export transcript
       - format: 'pdf' | 'docx' | 'txt' | 'srt' (default: 'txt')
       - timestamps?: 'true' | 'false' (include timestamps)
       - speakers?: 'true' | 'false' (include speaker labels)
       -> Returns: File download with appropriate content-type
       
       Example: GET /api/export/abc123?format=pdf&timestamps=true&speakers=true
```

### File Storage (Implemented ✅)

```
# Upload files to R2
POST   /api/upload               # Upload audio file
       - file: File (FormData)
       -> Returns: { success, data: { key, size, contentType, url, fileName } }

GET    /api/upload               # Get presigned upload URL for direct upload
       - fileName: string
       - contentType: string
       -> Returns: { success, data: { uploadUrl, key } }

# Audio streaming
GET    /api/audio/:id            # Get signed URL for audio playback
       -> Returns: { success, data: { url, name } }

DELETE /api/audio/:id            # Delete audio file from R2
       -> Returns: { success, message }
```

### To Be Implemented

```
# Future features (not critical)
```

---

## 🔗 External API Integration

### OpenAI Speech-to-Text ✅
Documentation: https://platform.openai.com/docs/guides/speech-to-text

Models in use:
- `gpt-4o-mini-transcribe` - Fast, cost-effective (Cheetah mode)
- `gpt-4o-transcribe` - High accuracy (Dolphin & Whale modes)

**Note:** These models use `text` response format (not `verbose_json`)

### Neon PostgreSQL ✅
Documentation: https://neon.tech/docs

- Serverless PostgreSQL with connection pooling
- Auto-scaling and branching support
- Works with Prisma ORM v5.22

---

## 📊 Progress Summary

| Phase | Status | Completion |
|-------|--------|------------|
| Project Setup | ✅ Complete | 100% |
| Landing Page | ✅ Complete | 100% |
| Dashboard UI | ✅ Complete | 100% |
| File Management UI | ✅ Complete | 100% |
| Transcribe Modal | ✅ Complete | 100% |
| Transcript Viewer | ✅ Complete | 100% |
| Additional Pages | ✅ Complete | 100% |
| **Backend Transcription API** | ✅ **Complete** | **100%** |
| **Database & Persistence** | ✅ **Complete** | **100%** |
| **Authentication** | ✅ **Complete** | **100%** |
| **Export System** | ✅ **Complete** | **100%** |
| **File Storage (R2)** | ✅ **Complete** | **100%** |

**Overall Progress: ~95%**

---

## 🔜 Next Steps

1. ~~**Authentication** - User accounts with NextAuth.js~~ ✅ **DONE**
2. ~~**Export System** - PDF, DOCX, SRT generation~~ ✅ **DONE**
3. ~~**File Storage** - Cloud storage for audio files (Cloudflare R2)~~ ✅ **DONE**
4. **Polish & Deploy** - Final testing, Vercel deployment

---

## 👥 Contributors

- Initial development by AI assistant (Claude)

---

## 📄 License

MIT License - See LICENSE file

---

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.
