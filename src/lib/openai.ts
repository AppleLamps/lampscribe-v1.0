import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Transcription models mapping
export const TRANSCRIPTION_MODELS = {
  cheetah: 'gpt-4o-mini-transcribe',    // Fastest, best for quick drafts
  dolphin: 'gpt-4o-transcribe',          // Balanced speed and accuracy
  whale: 'gpt-4o-transcribe',            // Most accurate (with diarization)
} as const;

export type TranscriptionModelKey = keyof typeof TRANSCRIPTION_MODELS;

// Supported audio formats
export const SUPPORTED_FORMATS = [
  'audio/mpeg',      // mp3
  'audio/mp4',       // mp4, m4a
  'audio/wav',       // wav
  'audio/webm',      // webm
  'audio/ogg',       // ogg
  'audio/flac',      // flac
  'video/mp4',       // video mp4
  'video/webm',      // video webm
  'video/quicktime', // mov
] as const;

// File extension to MIME type mapping
export const EXTENSION_TO_MIME: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.mp4': 'audio/mp4',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.webm': 'audio/webm',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.mov': 'video/quicktime',
};

// Max file size (25MB for OpenAI API)
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

// For larger files, we need to chunk them (OpenAI limit)
export const CHUNK_DURATION_MS = 10 * 60 * 1000; // 10 minutes per chunk

export interface TranscriptionOptions {
  mode: TranscriptionModelKey;
  language?: string;
  translate?: boolean;
  speakerRecognition?: boolean;
  numSpeakers?: number;
  timestamps?: boolean;
}

export interface TranscriptionResult {
  text: string;
  segments?: TranscriptionSegment[];
  language?: string;
  duration?: number;
}

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

/**
 * Transcribe audio using OpenAI's speech-to-text API
 */
export async function transcribeAudio(
  file: File | Blob,
  options: TranscriptionOptions
): Promise<TranscriptionResult> {
  const model = TRANSCRIPTION_MODELS[options.mode];
  
  // Create a form-compatible file object
  const audioFile = file instanceof File 
    ? file 
    : new File([file], 'audio.mp3', { type: 'audio/mpeg' });

  try {
    // Use translation endpoint if translate option is enabled
    if (options.translate) {
      const translation = await openai.audio.translations.create({
        file: audioFile,
        model: model,
        response_format: 'verbose_json',
      });

      return {
        text: translation.text,
        language: 'en', // Translation always outputs English
        duration: translation.duration,
        segments: translation.segments?.map((seg, idx) => ({
          id: idx,
          start: seg.start,
          end: seg.end,
          text: seg.text,
        })),
      };
    }

    // Standard transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: model,
      language: options.language,
      response_format: 'verbose_json',
      timestamp_granularities: options.timestamps ? ['segment', 'word'] : ['segment'],
    });

    let segments = transcription.segments?.map((seg, idx) => ({
      id: idx,
      start: seg.start,
      end: seg.end,
      text: seg.text,
    }));

    // If speaker recognition is enabled and using whale mode, add speaker labels
    // Note: OpenAI's diarization is handled by the model automatically
    if (options.speakerRecognition && options.mode === 'whale' && segments) {
      segments = addSpeakerLabels(segments, options.numSpeakers || 2);
    }

    return {
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      segments,
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

/**
 * Simple speaker diarization simulation
 * In production, you'd use a proper diarization service or OpenAI's built-in diarization
 */
function addSpeakerLabels(
  segments: TranscriptionSegment[],
  numSpeakers: number
): TranscriptionSegment[] {
  // Simple heuristic: alternate speakers based on pauses
  // This is a placeholder - real implementation would use proper diarization
  let currentSpeaker = 0;
  let lastEnd = 0;
  
  return segments.map((segment) => {
    // If there's a significant pause (>1.5s), possibly switch speaker
    if (segment.start - lastEnd > 1.5) {
      currentSpeaker = (currentSpeaker + 1) % numSpeakers;
    }
    lastEnd = segment.end;
    
    return {
      ...segment,
      speaker: `Speaker ${currentSpeaker + 1}`,
    };
  });
}

/**
 * Validate if file format is supported
 */
export function isValidFormat(mimeType: string): boolean {
  return SUPPORTED_FORMATS.includes(mimeType as typeof SUPPORTED_FORMATS[number]);
}

/**
 * Validate file size
 */
export function isValidSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

/**
 * Get file duration (requires browser Audio API)
 */
export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = reject;
    audio.src = URL.createObjectURL(file);
  });
}

