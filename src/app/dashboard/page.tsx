"use client";

import { useState, useCallback } from "react";
import {
  LayoutGrid,
  Search,
  Mic,
  Upload,
  Download,
  FolderInput,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileTable } from "@/components/dashboard/FileTable";
import { TranscribeModal } from "@/components/dashboard/TranscribeModal";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useTranscripts, useFolders } from "@/hooks/useTranscripts";

export default function DashboardPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [transcribeModalOpen, setTranscribeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { transcripts, isLoading, error, refetch } = useTranscripts({
    search: searchQuery || undefined,
  });
  
  const { folders } = useFolders();

  // Handle moving a transcript to a folder
  const handleMoveToFolder = useCallback(async (transcriptId: string, folderId: string | null) => {
    try {
      const response = await fetch(`/api/transcripts/${transcriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId }),
      });

      if (response.ok) {
        refetch(); // Refresh the transcript list
      }
    } catch (error) {
      console.error('Failed to move transcript:', error);
    }
  }, [refetch]);

  // Handle deleting a transcript
  const handleDelete = useCallback(async (transcriptId: string) => {
    if (!confirm('Are you sure you want to delete this transcript?')) return;
    
    try {
      const response = await fetch(`/api/transcripts/${transcriptId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refetch();
        setSelectedIds(ids => ids.filter(id => id !== transcriptId));
      }
    } catch (error) {
      console.error('Failed to delete transcript:', error);
    }
  }, [refetch]);

  // Map database transcripts to FileTable format
  const mappedTranscripts = transcripts.map((t) => ({
    id: t.id,
    title: t.name,
    duration: t.duration || 0,
    createdAt: new Date(t.createdAt),
    status: t.status.toLowerCase() as 'processing' | 'completed' | 'failed',
    mode: t.mode.toLowerCase() as 'cheetah' | 'dolphin' | 'whale',
    folderId: t.folderId || undefined,
    folderName: t.folder?.name,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Recent Files</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transcripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48 sm:w-64"
            />
          </div>

          {/* Record Button */}
          <Button variant="outline" size="icon" className="shrink-0">
            <Mic className="h-4 w-4" />
          </Button>

          {/* Transcribe Button */}
          <Button
            onClick={() => setTranscribeModalOpen(true)}
            className="gradient-lamp text-lamp-dark hover:opacity-90 shrink-0"
          >
            <Upload className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Transcribe Files</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && transcripts.length === 0 && (
        <EmptyState
          title={searchQuery ? "No matching transcripts" : "No transcripts yet"}
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Upload an audio or video file to get started with your first transcription"
          }
          action={
            !searchQuery && (
              <Button
                onClick={() => setTranscribeModalOpen(true)}
                className="gradient-lamp text-lamp-dark hover:opacity-90 mt-4"
              >
                <Upload className="mr-2 h-4 w-4" />
                Transcribe Files
              </Button>
            )
          }
        />
      )}

      {/* File Table */}
      {!isLoading && !error && transcripts.length > 0 && (
        <FileTable
          transcripts={mappedTranscripts}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          folders={folders}
          onMoveToFolder={handleMoveToFolder}
          onDelete={handleDelete}
        />
      )}

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl shadow-lg px-4 py-3">
            <span className="text-sm font-medium mr-2">
              {selectedIds.length} selected
            </span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <FolderInput className="mr-2 h-4 w-4" />
              Move
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Transcribe Modal */}
      <TranscribeModal
        open={transcribeModalOpen}
        onOpenChange={(open) => {
          setTranscribeModalOpen(open);
          // Refresh the list when modal closes
          if (!open) {
            refetch();
          }
        }}
      />
    </div>
  );
}
