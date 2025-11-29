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
  <a href="#project-structure">Structure</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## ✨ Features

- **📤 Multiple Upload Methods** - Drag & drop files, paste URLs from YouTube/Vimeo/Drive, or record directly
- **🎯 Speaker Recognition** - Automatic speaker diarization with customizable labels
- **🌍 98+ Languages** - Transcribe content in virtually any language
- **🔄 Translation** - Automatically translate transcripts to English
- **📁 Organization** - Create folders to organize your transcriptions
- **📥 Export Options** - Download as PDF, DOCX, TXT, or SRT subtitle format
- **⚡ Blazing Fast** - Process up to 10 hours of audio/video content
- **🎨 Modern UI** - Beautiful, responsive design with warm amber/gold theme

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
   
   Configure the following variables:
   ```env
   # OpenAI API (Required for transcription)
   OPENAI_API_KEY=your_openai_api_key
   
   # Database (Coming soon)
   DATABASE_URL=your_database_url
   
   # Authentication (Coming soon)
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** [DM Sans](https://fonts.google.com/specimen/DM+Sans)

### Backend (Planned)
- **Transcription:** [OpenAI Speech-to-Text API](https://platform.openai.com/docs/guides/speech-to-text)
- **Authentication:** NextAuth.js or Clerk
- **Database:** PostgreSQL with Prisma ORM
- **Storage:** Vercel Blob / AWS S3 / Cloudflare R2
- **Queue:** Vercel Background Functions / BullMQ

## 📁 Project Structure

```
lampscribe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── folder/[id]/    # Folder view
│   │   │   ├── transcript/[id]/# Transcript viewer
│   │   │   ├── uncategorized/  # Uncategorized files
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   └── loading.tsx     # Loading state
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── globals.css         # Global styles & theme
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── loading.tsx         # Global loading
│   │   └── not-found.tsx       # 404 page
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── FileTable.tsx   # Transcript list table
│   │   │   ├── TranscribeModal.tsx # Upload modal
│   │   │   └── EmptyState.tsx  # Empty state component
│   │   └── ui/                 # shadcn/ui components
│   └── lib/
│       ├── types.ts            # TypeScript definitions
│       ├── mock-data.ts        # Mock data for development
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies
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

## 🗺️ Roadmap

### ✅ Completed
- [x] Project setup (Next.js, TypeScript, Tailwind, shadcn/ui)
- [x] Landing page with features and pricing
- [x] Dashboard layout with collapsible sidebar
- [x] File table with selection and actions
- [x] Transcribe modal with upload and settings
- [x] Transcript viewer with audio player
- [x] Folder management UI
- [x] Authentication pages (login/signup)
- [x] Loading states and 404 page
- [x] Responsive design

### 🚧 In Progress
- [ ] Backend API integration
- [ ] OpenAI transcription implementation
- [ ] User authentication

### 📋 Planned
- [ ] Export system (PDF, DOCX, TXT, SRT)
- [ ] Search functionality
- [ ] Translation feature
- [ ] Sharing & collaboration
- [ ] Billing & subscription management
- [ ] Usage analytics

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

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
- [Vercel](https://vercel.com/) for Next.js and hosting
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components
- Inspired by [TurboScribe](https://turboscribe.ai/)

---

<p align="center">
  Made with ☕ and 💛
</p>
