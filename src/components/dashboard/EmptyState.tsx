"use client";

import { Upload, FolderPlus, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "files" | "folder" | "search";
  searchQuery?: string;
  onUpload?: () => void;
}

export function EmptyState({ type, searchQuery, onUpload }: EmptyStateProps) {
  if (type === "search" && searchQuery) {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <FileAudio className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          No transcripts match &quot;{searchQuery}&quot;. Try a different search term.
        </p>
      </div>
    );
  }

  if (type === "folder") {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <FolderPlus className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">This folder is empty</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          Upload a new file or move existing transcripts to this folder.
        </p>
        {onUpload && (
          <Button onClick={onUpload} className="gradient-lamp text-lamp-dark hover:opacity-90">
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-lamp-subtle mb-6">
        <Upload className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No transcripts yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        Upload your first audio or video file to get started with transcription.
      </p>
      {onUpload && (
        <Button 
          onClick={onUpload} 
          size="lg"
          className="gradient-lamp text-lamp-dark hover:opacity-90"
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload Your First File
        </Button>
      )}
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <span>✓ Up to 10 hours</span>
        <span>✓ 98+ languages</span>
        <span>✓ Speaker recognition</span>
      </div>
    </div>
  );
}

