'use client';

import { useState, useCallback } from 'react';

export type TranscriptionMode = 'cheetah' | 'dolphin' | 'whale';

export interface TranscriptionOptions {
  mode: TranscriptionMode;
  language?: string;
  translate?: boolean;
  speakerRecognition?: boolean;
  numSpeakers?: number;
  folderId?: string;
  duration?: number;
  saveAudio?: boolean;
}

export interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface TranscriptionResult {
  id: string;  // Transcript ID from database
  name: string;
  text: string;
  segments?: TranscriptionSegment[];
  language?: string;
  duration?: number;
  createdAt?: string;
}

export interface UseTranscribeReturn {
  transcribe: (file: File, options: TranscriptionOptions) => Promise<TranscriptionResult>;
  isLoading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

export function useTranscribe(): UseTranscribeReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setProgress(0);
    setError(null);
  }, []);

  const transcribe = useCallback(async (
    file: File,
    options: TranscriptionOptions
  ): Promise<TranscriptionResult> => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', options.mode);
      
      if (options.language) {
        formData.append('language', options.language);
      }
      if (options.translate) {
        formData.append('translate', 'true');
      }
      if (options.speakerRecognition) {
        formData.append('speakerRecognition', 'true');
      }
      if (options.numSpeakers) {
        formData.append('numSpeakers', options.numSpeakers.toString());
      }
      if (options.folderId) {
        formData.append('folderId', options.folderId);
      }
      if (options.duration) {
        formData.append('duration', Math.round(options.duration).toString());
      }
      if (options.saveAudio) {
        formData.append('saveAudio', 'true');
      }

      // Simulate progress for UX (actual progress not available with fetch)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          // Slower progress for larger files
          const increment = file.size > 10 * 1024 * 1024 ? 2 : 5;
          return Math.min(prev + increment, 90);
        });
      }, 500);

      // Make the API request
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();
      
      setProgress(100);
      setIsLoading(false);

      return result.data as TranscriptionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transcription failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    transcribe,
    isLoading,
    progress,
    error,
    reset,
  };
}

/**
 * Get estimated transcription time based on file duration and mode
 */
export function getEstimatedTime(durationSeconds: number, mode: TranscriptionMode): string {
  const durationHours = durationSeconds / 3600;
  
  // Approximate processing speeds (minutes per hour of audio)
  const speeds = {
    cheetah: 1,   // ~1 min per hour
    dolphin: 3,   // ~3 min per hour
    whale: 5,     // ~5 min per hour
  };

  const estimatedMinutes = durationHours * speeds[mode];
  
  if (estimatedMinutes < 1) {
    return 'Less than a minute';
  } else if (estimatedMinutes < 60) {
    return `~${Math.ceil(estimatedMinutes)} minute${Math.ceil(estimatedMinutes) > 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(estimatedMinutes / 60);
    const mins = Math.ceil(estimatedMinutes % 60);
    return `~${hours}h ${mins}m`;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Get audio duration from file
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      reject(new Error('Failed to load audio file'));
    };
    audio.src = URL.createObjectURL(file);
  });
}

