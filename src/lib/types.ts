export type TranscriptionMode = "cheetah" | "dolphin" | "whale";

export type TranscriptionStatus = "processing" | "completed" | "failed";

export interface Speaker {
  id: string;
  name: string;
}

export interface TranscriptSegment {
  speakerId: string;
  text: string;
  startTime: number; // in seconds
  endTime: number;
}

export interface Transcript {
  id: string;
  title: string;
  originalFileName: string;
  audioUrl?: string;
  duration: number; // in seconds
  language: string;
  mode: TranscriptionMode;
  status: TranscriptionStatus;
  content?: TranscriptSegment[];
  speakers?: Speaker[];
  recognizeSpeakers: boolean;
  translateToEnglish: boolean;
  restoreAudio: boolean;
  folderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  transcriptCount: number;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "unlimited";
  avatarUrl?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
  { code: "zh", name: "Chinese (Mandarin)", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
];

export const TRANSCRIPTION_MODES = [
  {
    id: "cheetah" as TranscriptionMode,
    name: "Cheetah",
    emoji: "🐆",
    description: "Fastest",
    model: "gpt-4o-mini-transcribe",
  },
  {
    id: "dolphin" as TranscriptionMode,
    name: "Dolphin",
    emoji: "🐬",
    description: "Balanced",
    model: "gpt-4o-transcribe",
  },
  {
    id: "whale" as TranscriptionMode,
    name: "Whale",
    emoji: "🐳",
    description: "Most Accurate",
    model: "gpt-4o-transcribe-diarize",
  },
];

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (secs > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${minutes}m`;
}

export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

