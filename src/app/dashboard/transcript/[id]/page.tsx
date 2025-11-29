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
  Clock,
  MessageSquare,
  Languages,
  Share2,
  Pencil,
  Music,
  FolderInput,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { mockTranscripts } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/types";

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

  const transcript = mockTranscripts.find((t) => t.id === params.id);

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

  if (!transcript) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Transcript not found</p>
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

  const seekToTime = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const exportOptions = [
    { icon: FileText, label: "Download PDF", format: "pdf" },
    { icon: FileType, label: "Download DOCX", format: "docx" },
    { icon: FileCode, label: "Download TXT", format: "txt" },
    { icon: Subtitles, label: "Download SRT", format: "srt" },
  ];

  const moreActions = [
    { icon: Clock, label: "Show Timestamps", action: () => setShowTimestamps(!showTimestamps), toggle: true },
    { icon: MessageSquare, label: "ChatGPT", sublabel: "Summarize and chat with this transcript" },
    { icon: Languages, label: "Translate", sublabel: "Translate this transcript to 134+ languages" },
    { icon: Share2, label: "Share Transcript" },
    { icon: Pencil, label: "Edit Transcript" },
    { icon: Music, label: "Download Audio", sublabel: `${Math.round((transcript.duration * 128) / 8 / 1024)} KB` },
    { icon: Pencil, label: "Rename File" },
    { icon: FolderInput, label: "Move" },
    { icon: Trash2, label: "Delete File", destructive: true },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={transcript.audioUrl} preload="metadata" />

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
            {transcript.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(transcript.createdAt, "MMM d, yyyy, h:mm a")}
          </p>
        </div>

        {/* Transcript Content */}
        <ScrollArea className="flex-1 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {transcript.content && transcript.content.length > 0 ? (
              transcript.content.map((segment, index) => {
                const speaker = transcript.speakers?.find(
                  (s) => s.id === segment.speakerId
                );
                return (
                  <div key={index} className="group">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary">
                            {speaker?.name || segment.speakerId}
                          </span>
                          {showTimestamps && (
                            <button
                              onClick={() => seekToTime(segment.startTime)}
                              className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                            >
                              [{formatTimestamp(segment.startTime)}]
                            </button>
                          )}
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {segment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {transcript.status === "processing"
                    ? "Transcription in progress..."
                    : "No transcript content available"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Audio Player */}
        <div className="border-t border-border bg-card p-4">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <p className="text-sm font-medium text-center mb-3 truncate px-4">
              {transcript.title}
            </p>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-muted-foreground font-mono w-12 text-right">
                {formatTimestamp(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || transcript.duration}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground font-mono w-12">
                {formatTimestamp(duration || transcript.duration)}
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                  >
                    <option.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{option.label}</span>
                  </button>
                ))}
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span>Advanced Export</span>
                    <p className="text-xs text-muted-foreground">
                      Export with timestamps and in more formats
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

                {moreActions.slice(1).map((action, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left",
                      action.destructive && "text-destructive hover:bg-destructive/10"
                    )}
                  >
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <span>{action.label}</span>
                      {action.sublabel && (
                        <p className="text-xs text-muted-foreground truncate">
                          {action.sublabel}
                        </p>
                      )}
                    </div>
                    {!action.destructive && !action.sublabel && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

