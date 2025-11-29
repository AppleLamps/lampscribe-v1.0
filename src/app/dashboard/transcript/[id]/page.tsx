"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  FileText,
  FileType,
  FileCode,
  Subtitles,
  Download,
  MessageSquare,
  Languages,
  Share2,
  Pencil,
  Music,
  FolderInput,
  Trash2,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/lib/types";
import { useTranscript } from "@/hooks/useTranscripts";
import { useAudioUrl } from "@/hooks/useAudio";

type ExportFormat = 'pdf' | 'docx' | 'txt' | 'srt';

export default function TranscriptPage() {
  const params = useParams();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showSpeakers, setShowSpeakers] = useState(true);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const [exportSuccess, setExportSuccess] = useState<ExportFormat | null>(null);
  const [advancedExportOpen, setAdvancedExportOpen] = useState(false);

  const { transcript, isLoading, error, deleteTranscript } = useTranscript(params.id as string);
  const { audioUrl, fetchAudioUrl, deleteAudio } = useAudioUrl(params.id as string);

  // Fetch audio URL when transcript has audio
  useEffect(() => {
    if (transcript?.audioUrl) {
      fetchAudioUrl();
    }
  }, [transcript?.audioUrl, fetchAudioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || transcript?.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [transcript?.duration]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !transcript) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">{error || 'Transcript not found'}</p>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this transcript?')) {
      const success = await deleteTranscript();
      if (success) {
        router.push('/dashboard');
      }
    }
  };

  const handleExport = async (format: ExportFormat, withTimestamps = false, withSpeakers = false) => {
    setExportingFormat(format);
    setExportSuccess(null);
    
    try {
      const params = new URLSearchParams({
        format,
        timestamps: withTimestamps.toString(),
        speakers: withSpeakers.toString(),
      });
      
      const response = await fetch(`/api/export/${transcript.id}?${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      // Get the filename from content-disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `${transcript.name}.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }
      
      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportSuccess(format);
      setTimeout(() => setExportSuccess(null), 2000);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export transcript');
    } finally {
      setExportingFormat(null);
    }
  };

  const exportOptions = [
    { icon: FileText, label: "Download PDF", format: "pdf" as ExportFormat },
    { icon: FileType, label: "Download DOCX", format: "docx" as ExportFormat },
    { icon: FileCode, label: "Download TXT", format: "txt" as ExportFormat },
    { icon: Subtitles, label: "Download SRT", format: "srt" as ExportFormat },
  ];

  const transcriptDuration = transcript.duration || 0;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to files
          </button>
          <h1 className="text-xl sm:text-2xl font-bold line-clamp-2">
            {transcript.name}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>{format(new Date(transcript.createdAt), "MMM d, yyyy, h:mm a")}</span>
            {transcriptDuration > 0 && (
              <>
                <span>•</span>
                <span>{formatTimestamp(transcriptDuration)}</span>
              </>
            )}
            <span>•</span>
            <span className="capitalize">{transcript.mode.toLowerCase()} mode</span>
          </div>
        </div>

        {/* Transcript Content */}
        <ScrollArea className="flex-1 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            {transcript.status === 'PROCESSING' ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Transcription in progress...
                </p>
              </div>
            ) : transcript.status === 'FAILED' ? (
              <div className="text-center py-12">
                <p className="text-destructive">
                  Transcription failed: {transcript.error || 'Unknown error'}
                </p>
              </div>
            ) : transcript.text ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {transcript.text}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No transcript content available
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Audio Player - only show if we have audio */}
        {audioUrl && (
          <div className="border-t border-border bg-card p-4">
            <div className="max-w-4xl mx-auto">
              {/* Title */}
              <p className="text-sm font-medium text-center mb-3 truncate px-4">
                {transcript.name}
              </p>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-muted-foreground font-mono w-12 text-right">
                  {formatTimestamp(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration || transcriptDuration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground font-mono w-12">
                  {formatTimestamp(duration || transcriptDuration)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {/* Play/Pause */}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-full"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>

                {/* Settings */}
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Export & Actions */}
      <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-muted/30">
        <ScrollArea className="h-full">
          <div className="p-4 sm:p-6">
            {/* Export Section */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Export</h3>
              <div className="space-y-1">
                {exportOptions.map((option) => (
                  <button
                    key={option.format}
                    onClick={() => handleExport(option.format)}
                    disabled={exportingFormat !== null}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left disabled:opacity-50"
                  >
                    {exportingFormat === option.format ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : exportSuccess === option.format ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setAdvancedExportOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                >
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span>Advanced Export</span>
                    <p className="text-xs text-muted-foreground">
                      Export with timestamps and speakers
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* More Section */}
            <div>
              <h3 className="font-semibold mb-3">More</h3>
              <div className="space-y-1">
                {/* Show Timestamps Toggle */}
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <Checkbox
                    id="timestamps"
                    checked={showTimestamps}
                    onCheckedChange={(checked) =>
                      setShowTimestamps(checked as boolean)
                    }
                  />
                  <Label htmlFor="timestamps" className="text-sm cursor-pointer">
                    Show Timestamps
                  </Label>
                </div>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <span>ChatGPT</span>
                    <p className="text-xs text-muted-foreground truncate">
                      Summarize and chat with this transcript
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <span>Translate</span>
                    <p className="text-xs text-muted-foreground truncate">
                      Translate to 134+ languages
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span>Share Transcript</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  <span>Edit Transcript</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </button>

                {audioUrl && (
                  <a 
                    href={audioUrl}
                    download={`${transcript.name}.${transcript.fileType?.split('/')[1] || 'mp3'}`}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                  >
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <span>Download Audio</span>
                      {transcript.fileSize && (
                        <p className="text-xs text-muted-foreground">
                          {(transcript.fileSize / 1024 / 1024).toFixed(1)} MB
                        </p>
                      )}
                    </div>
                  </a>
                )}

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  <span>Rename File</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <FolderInput className="h-4 w-4 text-muted-foreground" />
                  <span>Move to Folder</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-destructive/10 transition-colors text-left text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete File</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Advanced Export Dialog */}
      <Dialog open={advancedExportOpen} onOpenChange={setAdvancedExportOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Export</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose export options for your transcript.
            </p>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="export-timestamps"
                  checked={showTimestamps}
                  onCheckedChange={(checked) => setShowTimestamps(checked as boolean)}
                />
                <Label htmlFor="export-timestamps" className="text-sm cursor-pointer">
                  Include timestamps
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="export-speakers"
                  checked={showSpeakers}
                  onCheckedChange={(checked) => setShowSpeakers(checked as boolean)}
                />
                <Label htmlFor="export-speakers" className="text-sm cursor-pointer">
                  Include speaker labels
                </Label>
              </div>
            </div>

            {/* Format Selection */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {exportOptions.map((option) => (
                <Button
                  key={option.format}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-1"
                  onClick={() => {
                    handleExport(option.format, showTimestamps, showSpeakers);
                    setAdvancedExportOpen(false);
                  }}
                  disabled={exportingFormat !== null}
                >
                  {exportingFormat === option.format ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <option.icon className="h-5 w-5" />
                  )}
                  <span className="text-xs">{option.format.toUpperCase()}</span>
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdvancedExportOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
