"use client";

import { useState, useCallback } from "react";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

interface TranscribeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TranscribeModal({ open, onOpenChange }: TranscribeModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [language, setLanguage] = useState("en-US");
  const [mode, setMode] = useState<TranscriptionMode>("dolphin");
  const [recognizeSpeakers, setRecognizeSpeakers] = useState(true);
  const [speakerCount, setSpeakerCount] = useState("auto");
  const [translateToEnglish, setTranslateToEnglish] = useState(false);
  const [restoreAudio, setRestoreAudio] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/")
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTranscribe = () => {
    // TODO: Implement transcription
    console.log({
      files,
      language,
      mode,
      recognizeSpeakers,
      speakerCount,
      translateToEnglish,
      restoreAudio,
    });
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Upload className="h-5 w-5 text-primary" />
            Transcribe Files
          </DialogTitle>
        </DialogHeader>

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
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
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
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Labels each section of the transcript with who is speaking.
                    </p>
                  </div>
                </div>

                {recognizeSpeakers && (
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
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleTranscribe}
            disabled={files.length === 0}
            className="w-full h-12 text-base font-semibold gradient-lamp text-lamp-dark hover:opacity-90"
          >
            {files.length === 0 ? (
              "Select files to transcribe"
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Transcribe {files.length} file{files.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

