"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Mic,
  Upload,
  Download,
  FolderInput,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileTable } from "@/components/dashboard/FileTable";
import { TranscribeModal } from "@/components/dashboard/TranscribeModal";
import { mockTranscripts } from "@/lib/mock-data";

export default function UncategorizedPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [transcribeModalOpen, setTranscribeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get transcripts without a folder
  const uncategorizedTranscripts = mockTranscripts.filter((t) => !t.folderId);
  const filteredTranscripts = uncategorizedTranscripts.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Uncategorized</h1>
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

      {/* File Table */}
      <FileTable
        transcripts={filteredTranscripts}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

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
        onOpenChange={setTranscribeModalOpen}
      />
    </div>
  );
}

