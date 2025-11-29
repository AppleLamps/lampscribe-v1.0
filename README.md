<p align="center">
  <img src="public/lamp-icon.svg" alt="LampScribe Logo" width="80" height="80" />
</p>

<h1 align="center">LampScribe</h1>

<p align="center">
  <strong>AI-Powered Audio & Video Transcription</strong>
</p>

<p align="center">
  Transform your audio and video files into accurate, searchable transcripts with speaker recognition.
  <br />
  Powered by OpenAI's latest speech-to-text models.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#transcription-modes">Modes</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#api-endpoints">API</a>
</p>

---

## ✨ Features

- **🔐 User Authentication** - Secure login with email/password or Google OAuth
- **📤 Multiple Upload Methods** - Drag & drop files with support for audio/video formats
- **🎯 Speaker Recognition** - Automatic speaker diarization with customizable labels
- **🌍 98+ Languages** - Transcribe content in virtually any language
- **🔄 Translation** - Automatically translate transcripts to English
- **📁 Organization** - Create folders to organize your transcriptions
- **📥 Export Options** - Download as PDF, DOCX, TXT, or SRT subtitle format
- **⚡ Blazing Fast** - Process up to 10 hours of audio/video content
- **🎨 Modern UI** - Beautiful, responsive design with warm amber/gold theme
- **💾 Cloud Storage** - Store audio files in Cloudflare R2 for playback
- **🗄️ Persistent Database** - All transcripts saved to PostgreSQL

## 🎙️ Transcription Modes

| Mode | Model | Speed | Best For |
|------|-------|-------|----------|
| **🐆 Cheetah** | `gpt-4o-mini-transcribe` | ~1 min/hr | Quick drafts, simple audio |
| **🐬 Dolphin** | `gpt-4o-transcribe` | ~3 min/hr | Most use cases, balanced accuracy |
| **🐋 Whale** | `gpt-4o-transcribe` + diarization | ~5 min/hr | Professional, multi-speaker content |

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- Neon PostgreSQL database ([free tier](https://neon.tech))
- Cloudflare R2 bucket (optional, for audio storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lampscribe.git
   cd lampscribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following in `.env.local`:
   ```env
   # OpenAI API (Required)
   OPENAI_API_KEY=sk-your-openai-api-key
   
   # Database (Required - Get free at https://neon.tech)
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"
   
   # Authentication (Required)
   AUTH_SECRET=your-secret-key-generate-with-openssl
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

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** [DM Sans](https://fonts.google.com/specimen/DM+Sans)

### Backend
- **Transcription:** [OpenAI Speech-to-Text API](https://platform.openai.com/docs/guides/speech-to-text)
- **Database:** [Neon PostgreSQL](https://neon.tech/)
- **ORM:** [Prisma v5.22](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **File Storage:** [Cloudflare R2](https://developers.cloudflare.com/r2/)
- **Export:** pdfkit, docx

## 📝 API Endpoints

### Authentication
```
GET/POST /api/auth/*           # NextAuth.js handlers
POST     /api/auth/register    # User registration
```

### Transcription
```
POST /api/transcribe
  - file: File (FormData)
  - mode: 'cheetah' | 'dolphin' | 'whale'
  - language?: string
  - translate?: boolean
  - saveAudio?: boolean
```

### Transcripts CRUD
```
GET    /api/transcripts          # List transcripts
POST   /api/transcripts          # Create transcript
GET    /api/transcripts/:id      # Get transcript
PATCH  /api/transcripts/:id      # Update transcript
DELETE /api/transcripts/:id      # Delete transcript
```

### Folders CRUD
```
GET    /api/folders              # List folders
POST   /api/folders              # Create folder
GET    /api/folders/:id          # Get folder
PATCH  /api/folders/:id          # Update folder
DELETE /api/folders/:id          # Delete folder
```

### Export
```
GET /api/export/:id?format=pdf|docx|txt|srt
    - timestamps?: boolean
    - speakers?: boolean
```

### File Storage
```
POST   /api/upload               # Upload audio file
GET    /api/audio/:id            # Get signed URL for playback
DELETE /api/audio/:id            # Delete audio file
```

## 📁 Project Structure

```
lampscribe/
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication
│   │   │   ├── transcribe/  # Transcription
│   │   │   ├── transcripts/ # Transcripts CRUD
│   │   │   ├── folders/     # Folders CRUD
│   │   │   ├── export/      # Export (PDF, DOCX, TXT, SRT)
│   │   │   ├── upload/      # File upload
│   │   │   └── audio/       # Audio streaming
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page
│   ├── components/
│   │   ├── dashboard/       # Dashboard components
│   │   ├── providers/       # Session provider
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/
│   │   ├── useTranscribe.ts # Transcription hook
│   │   ├── useTranscripts.ts # Database hooks
│   │   └── useAudio.ts      # Audio URL hook
│   └── lib/
│       ├── prisma.ts        # Database client
│       ├── auth.ts          # NextAuth config
│       ├── storage.ts       # R2 storage
│       ├── export.ts        # Export utilities
│       └── utils.ts         # Utilities
├── public/                  # Static assets
├── middleware.ts            # Route protection
└── package.json
```

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Lamp Dark | `#1a1612` | Background |
| Lamp Light | `#faf6f1` | Text, Cards |
| Primary | `#f59e0b` | Buttons, Links |
| Accent | `#fbbf24` | Highlights |
| Sidebar | `#231f1b` | Navigation |

### Typography

- **Font Family:** DM Sans
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## ✅ Features Status

| Feature | Status |
|---------|--------|
| Landing Page | ✅ Complete |
| Dashboard UI | ✅ Complete |
| Transcription (OpenAI) | ✅ Complete |
| Database (PostgreSQL) | ✅ Complete |
| Authentication | ✅ Complete |
| Export (PDF, DOCX, TXT, SRT) | ✅ Complete |
| File Storage (R2) | ✅ Complete |
| Google OAuth | 🔧 Ready (needs credentials) |
| URL Import | 📋 Planned |
| Full-text Search | 📋 Planned |
| Sharing & Collaboration | 📋 Planned |

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db push` | Push schema to database |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the incredible speech-to-text API
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Cloudflare](https://cloudflare.com/) for R2 object storage
- [Vercel](https://vercel.com/) for Next.js
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components
- Inspired by [TurboScribe](https://turboscribe.ai/)

---

<p align="center">
  Made with ☕ and 💛
</p>
