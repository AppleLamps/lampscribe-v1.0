"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  FolderOpen,
  Search,
  Mic,
  Upload,
  Download,
  FolderInput,
  Trash2,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileTable } from "@/components/dashboard/FileTable";
import { TranscribeModal } from "@/components/dashboard/TranscribeModal";
import { mockTranscripts, mockFolders } from "@/lib/mock-data";

export default function FolderPage() {
  const params = useParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [transcribeModalOpen, setTranscribeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const folder = mockFolders.find((f) => f.id === params.id);
  const folderTranscripts = mockTranscripts.filter(
    (t) => t.folderId === params.id
  );
  const filteredTranscripts = folderTranscripts.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Folder not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{folder.name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Rename Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in folder..."
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

