"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link as LinkIcon, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  LANGUAGES,
  TRANSCRIPTION_MODES,
  TranscriptionMode,
} from "@/lib/types";
import {
  useTranscribe,
  formatFileSize,
  getEstimatedTime,
  getAudioDuration,
} from "@/hooks/useTranscribe";

interface TranscribeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TranscriptionStatus = 'idle' | 'processing' | 'success' | 'error';

interface FileWithDuration extends File {
  duration?: number;
}

export function TranscribeModal({ open, onOpenChange }: TranscribeModalProps) {
  const router = useRouter();
  const { transcribe, isLoading, progress, error, reset } = useTranscribe();
  
  const [files, setFiles] = useState<FileWithDuration[]>([]);
  const [language, setLanguage] = useState("en-US");
  const [mode, setMode] = useState<TranscriptionMode>("dolphin");
  const [recognizeSpeakers, setRecognizeSpeakers] = useState(true);
  const [speakerCount, setSpeakerCount] = useState("auto");
  const [translateToEnglish, setTranslateToEnglish] = useState(false);
  const [restoreAudio, setRestoreAudio] = useState(false);
  const [saveAudio, setSaveAudio] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState<TranscriptionStatus>('idle');
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [transcriptionResult, setTranscriptionResult] = useState<{ id: string; text: string } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/")
    );
    
    // Get duration for each file
    const filesWithDuration = await Promise.all(
      droppedFiles.map(async (file) => {
        try {
          const duration = await getAudioDuration(file);
          return Object.assign(file, { duration });
        } catch {
          return file;
        }
      })
    );
    
    setFiles((prev) => [...prev, ...filesWithDuration]);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Get duration for each file
      const filesWithDuration = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            const duration = await getAudioDuration(file);
            return Object.assign(file, { duration });
          } catch {
            return file;
          }
        })
      );
      
      setFiles((prev) => [...prev, ...filesWithDuration]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTranscribe = async () => {
    if (files.length === 0) return;
    
    setStatus('processing');
    setCurrentFileIndex(0);
    
    let lastTranscriptId: string | null = null;
    
    try {
      // Process files one at a time
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i);
        const file = files[i];
        
        const numSpeakersValue = speakerCount === 'auto' ? 2 : parseInt(speakerCount);
        
        const result = await transcribe(file, {
          mode: mode as 'cheetah' | 'dolphin' | 'whale',
          language: translateToEnglish ? undefined : language.split('-')[0],
          translate: translateToEnglish,
          speakerRecognition: recognizeSpeakers && mode === 'whale',
          numSpeakers: numSpeakersValue,
          duration: file.duration,
          saveAudio: saveAudio,
        });
        
        // Store the transcript ID from the database
        lastTranscriptId = result.id;
        
        setTranscriptionResult({
          id: result.id,
          text: result.text,
        });
      }
      
      setStatus('success');
      
      // Navigate to the transcript after a short delay
      setTimeout(() => {
        handleClose();
        if (lastTranscriptId) {
          router.push(`/dashboard/transcript/${lastTranscriptId}`);
        } else {
          // Refresh the page to show the new transcript
          router.refresh();
        }
      }, 1500);
      
    } catch (err) {
      console.error('Transcription failed:', err);
      setStatus('error');
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setStatus('idle');
    setCurrentFileIndex(0);
    setTranscriptionResult(null);
    reset();
    onOpenChange(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins < 60) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate total duration
  const totalDuration = files.reduce((acc, file) => acc + (file.duration || 0), 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {status === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : status === 'error' ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <Upload className="h-5 w-5 text-primary" />
            )}
            {status === 'processing' ? 'Transcribing...' : 
             status === 'success' ? 'Transcription Complete!' :
             status === 'error' ? 'Transcription Failed' :
             'Transcribe Files'}
          </DialogTitle>
        </DialogHeader>

        {/* Processing State */}
        {status === 'processing' && (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="text-lg font-medium" title={files[currentFileIndex]?.name}>
                Processing {files[currentFileIndex]?.name && files[currentFileIndex].name.length > 20 
                  ? `${files[currentFileIndex].name.slice(0, 20)}...` 
                  : files[currentFileIndex]?.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                File {currentFileIndex + 1} of {files.length}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <p className="text-xs text-center text-muted-foreground">
              {getEstimatedTime(totalDuration, mode)} estimated
            </p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-medium">Transcription Complete!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {files.length} file{files.length > 1 ? 's' : ''} transcribed successfully
              </p>
            </div>
            {transcriptionResult && (
              <div className="bg-muted/50 rounded-lg p-4 text-left max-h-40 overflow-y-auto">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <p className="text-sm">
                  {transcriptionResult.text.slice(0, 300)}
                  {transcriptionResult.text.length > 300 && '...'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-medium">Transcription Failed</p>
              <p className="text-sm text-red-500 mt-1">
                {error || 'An unexpected error occurred'}
              </p>
            </div>
            <Button onClick={() => setStatus('idle')} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Idle State - Main Form */}
        {status === 'idle' && (
          <div className="space-y-6 py-4">
            {/* File Upload Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Audio / Video Files</Label>
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" />
                  Paste URL
                </button>
              </div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-6 transition-all",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <input
                  type="file"
                  accept="audio/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports audio and video files up to 10 hours
                  </p>
                </div>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" title={file.name}>
                          {file.name.length > 20 
                            ? `${file.name.slice(0, 20)}...` 
                            : file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                          {file.duration && ` • ${formatDuration(file.duration)}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1.5 rounded hover:bg-muted flex-shrink-0"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Estimated time */}
                  {totalDuration > 0 && (
                    <p className="text-xs text-muted-foreground text-right">
                      Est. time: {getEstimatedTime(totalDuration, mode)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Language Selection */}
            <div>
              <Label className="mb-2 block">Audio Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transcription Mode */}
            <div>
              <Label className="mb-3 block">Transcription Mode</Label>
              <div className="grid grid-cols-3 gap-3">
                {TRANSCRIPTION_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all text-center",
                      mode === m.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="text-3xl mb-2">{m.emoji}</div>
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.id === "whale" && "⭐ "}
                      {m.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-lg">👥</span>
                Speaker Recognition & More Settings
                <span
                  className={cn(
                    "transition-transform",
                    showAdvanced && "rotate-180"
                  )}
                >
                  ▾
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 pl-1">
                  {/* Recognize Speakers */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="recognize-speakers"
                      checked={recognizeSpeakers}
                      onCheckedChange={(checked) =>
                        setRecognizeSpeakers(checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="recognize-speakers"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Recognize Speakers
                        {mode !== 'whale' && (
                          <span className="ml-2 text-xs text-amber-500">(Whale mode only)</span>
                        )}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Labels each section of the transcript with who is speaking.
                      </p>
                    </div>
                  </div>

                  {recognizeSpeakers && mode === 'whale' && (
                    <div className="ml-6">
                      <Label className="text-sm mb-2 block">How many speakers?</Label>
                      <Select value={speakerCount} onValueChange={setSpeakerCount}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Detect Automatically</SelectItem>
                          {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} speakers
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Translate to English */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="translate"
                      checked={translateToEnglish}
                      onCheckedChange={(checked) =>
                        setTranslateToEnglish(checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="translate"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Transcribe to English
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Transcribe the original audio language directly to English.
                      </p>
                    </div>
                  </div>

                  {/* Restore Audio */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="restore"
                      checked={restoreAudio}
                      onCheckedChange={(checked) =>
                        setRestoreAudio(checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="restore"
                        className="text-sm font-medium cursor-pointer"
                      >
                        🪄 Restore Audio
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Use AI to remove background noise and enhance speech.
                        Recommended only as a last resort for files with poor audio.
                      </p>
                    </div>
                  </div>

                  {/* Save Audio File */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="saveAudio"
                      checked={saveAudio}
                      onCheckedChange={(checked) =>
                        setSaveAudio(checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="saveAudio"
                        className="text-sm font-medium cursor-pointer"
                      >
                        💾 Save Audio File
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Store the original audio file in cloud storage for later playback.
                        Requires Cloudflare R2 to be configured.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleTranscribe}
              disabled={files.length === 0 || isLoading}
              className="w-full h-12 text-base font-semibold gradient-lamp text-lamp-dark hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : files.length === 0 ? (
                "Select files to transcribe"
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Transcribe {files.length} file{files.length > 1 ? "s" : ""}
                </>
              )}
            </Button>
            
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
