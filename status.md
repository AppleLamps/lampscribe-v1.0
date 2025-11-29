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
| **Transcription API** | OpenAI Speech-to-Text (planned) |

---

## 🎯 Transcription Modes

LampScribe offers three transcription modes mapped to OpenAI models:

| Mode | Emoji | Description | OpenAI Model |
|------|-------|-------------|--------------|
| **Cheetah** | 🐆 | Fastest | `gpt-4o-mini-transcribe` |
| **Dolphin** | 🐬 | Balanced | `gpt-4o-transcribe` |
| **Whale** | 🐳 | Most Accurate + Speaker Recognition | `gpt-4o-transcribe-diarize` |

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
- [x] "New Folder" button
- [x] User profile dropdown menu
- [x] "Unlimited" plan badge
- [x] Mobile-responsive hamburger menu

### Phase 4: File Management
- [x] File table with columns: Name, Uploaded, Duration, Mode, Status
- [x] Checkbox selection for bulk actions
- [x] Row hover actions (dropdown menu)
- [x] Search transcripts functionality
- [x] Bulk action bar (Export, Move, Delete)
- [x] Status indicators (Completed ✓, Processing spinner, Failed ✗)
- [x] Mode display with emojis (🐆🐬🐳)

### Phase 5: Transcribe Modal
- [x] Drag & drop file upload zone
- [x] "Paste URL" option placeholder
- [x] File list with size and remove button
- [x] Audio language selector (30+ languages with flags)
- [x] Transcription mode selector (visual cards)
- [x] Advanced settings panel:
  - [x] Recognize Speakers toggle
  - [x] Speaker count selector (2-8 or auto-detect)
  - [x] Transcribe to English toggle
  - [x] Restore Audio toggle (AI noise removal)
- [x] Submit button with file count

### Phase 6: Transcript Viewer (`/dashboard/transcript/[id]`)
- [x] Back navigation button
- [x] Title and timestamp display
- [x] Speaker-labeled transcript content
- [x] Different colors for speaker labels
- [x] Audio player:
  - [x] Play/Pause button
  - [x] Progress bar with seek
  - [x] Current time / Duration display
  - [x] Volume slider with mute toggle
  - [x] Settings button placeholder
- [x] Export panel:
  - [x] Download PDF button
  - [x] Download DOCX button
  - [x] Download TXT button
  - [x] Download SRT button
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
  - [x] Delete File placeholder

### Phase 7: Additional Pages
- [x] Folder view page (`/dashboard/folder/[id]`)
- [x] Uncategorized page (`/dashboard/uncategorized`)
- [x] Login page (`/login`) with Google OAuth button
- [x] Signup page (`/signup`) with form validation
- [x] Custom 404 Not Found page
- [x] Loading states (global and dashboard-specific)
- [x] Empty state component for tables

---

## 🚧 Pending Features (Backend Required)

### Authentication & Users
- [x] Login page UI (placeholder)
- [x] Signup page UI (placeholder)
- [ ] NextAuth.js or Clerk integration
- [ ] Google OAuth implementation
- [ ] Email verification
- [ ] Password reset flow
- [ ] User profile settings page
- [ ] Subscription management (Stripe integration)

### File Upload & Storage
- [ ] File upload API endpoint
- [ ] Cloud storage integration (AWS S3 / Cloudflare R2 / Vercel Blob)
- [ ] File validation (size, format, duration)
- [ ] Upload progress indicator
- [ ] URL import functionality

### Transcription Engine
- [ ] OpenAI Speech-to-Text API integration
  - [ ] `gpt-4o-mini-transcribe` for Cheetah mode
  - [ ] `gpt-4o-transcribe` for Dolphin mode
  - [ ] `gpt-4o-transcribe-diarize` for Whale mode (with speaker diarization)
- [ ] Background job processing (queue system)
- [ ] Transcription status webhooks/polling
- [ ] Error handling and retry logic
- [ ] Audio restoration preprocessing

### Database
- [ ] Database setup (PostgreSQL with Neon recommended)
- [ ] Prisma ORM schema:
  - [ ] User model
  - [ ] Transcript model
  - [ ] Folder model
- [ ] Database migrations

### Export System
- [ ] PDF generation (with timestamps option)
- [ ] DOCX generation
- [ ] TXT export
- [ ] SRT subtitle generation
- [ ] Advanced export with custom formatting

### Additional Features
- [ ] Full-text search across transcripts
- [ ] Transcript editing functionality
- [ ] Translation to 134+ languages (Google Translate API)
- [ ] Share transcript via public link
- [ ] ChatGPT summarization integration
- [ ] Audio recording directly in browser
- [ ] Folder CRUD operations (create, rename, delete)
- [ ] Dark mode toggle

---

## 📁 Project Structure

```
lampscribe/
├── src/
│   ├── app/
│   │   ├── globals.css          # Custom theme & styles
│   │   ├── layout.tsx           # Root layout with fonts
│   │   ├── loading.tsx          # Global loading state
│   │   ├── not-found.tsx        # Custom 404 page
│   │   ├── page.tsx             # Landing page
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   └── dashboard/
│   │       ├── layout.tsx       # Dashboard layout with sidebar
│   │       ├── loading.tsx      # Dashboard loading state
│   │       ├── page.tsx         # Recent Files view
│   │       ├── uncategorized/
│   │       │   └── page.tsx     # Uncategorized files
│   │       ├── folder/
│   │       │   └── [id]/
│   │       │       └── page.tsx # Folder view
│   │       └── transcript/
│   │           └── [id]/
│   │               └── page.tsx # Transcript viewer
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── EmptyState.tsx   # Empty state component
│   │   │   ├── FileTable.tsx    # File list table
│   │   │   └── TranscribeModal.tsx # Upload modal
│   │   └── ui/                  # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── select.tsx
│   │       ├── checkbox.tsx
│   │       ├── slider.tsx
│   │       ├── table.tsx
│   │       └── ... (more)
│   └── lib/
│       ├── types.ts             # TypeScript types & constants
│       ├── mock-data.ts         # Mock data for development
│       └── utils.ts             # Utility functions (cn)
├── public/                      # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── status.md                    # This file
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

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 📝 API Endpoints (To Be Implemented)

```
POST   /api/upload          # Upload audio/video file
POST   /api/transcribe      # Start transcription job
GET    /api/transcripts     # List user's transcripts
GET    /api/transcripts/:id # Get single transcript
PATCH  /api/transcripts/:id # Update transcript (rename, move)
DELETE /api/transcripts/:id # Delete transcript
GET    /api/export/:id      # Export transcript (format query param)
POST   /api/folders         # Create folder
PATCH  /api/folders/:id     # Rename folder
DELETE /api/folders/:id     # Delete folder
```

---

## 🔗 External API Integration

### OpenAI Speech-to-Text
Documentation: https://platform.openai.com/docs/guides/speech-to-text

Models to use:
- `gpt-4o-mini-transcribe` - Fast, cost-effective
- `gpt-4o-transcribe` - High accuracy
- `gpt-4o-transcribe-diarize` - Includes speaker diarization

---

## 👥 Contributors

- Initial development by AI assistant (Claude)

---

## 📄 License

TBD

---

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

