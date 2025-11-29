"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Download,
  FolderInput,
  Pencil,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Transcript, formatDuration, TRANSCRIPTION_MODES } from "@/lib/types";

interface FileTableProps {
  transcripts: Transcript[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function FileTable({
  transcripts,
  selectedIds,
  onSelectionChange,
}: FileTableProps) {
  const allSelected =
    transcripts.length > 0 && selectedIds.length === transcripts.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(transcripts.map((t) => t.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const getModeInfo = (mode: string) => {
    return TRANSCRIPTION_MODES.find((m) => m.id === mode);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                // @ts-ignore - indeterminate is a valid prop
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Uploaded</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead className="hidden lg:table-cell">Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transcripts.map((transcript) => {
            const modeInfo = getModeInfo(transcript.mode);
            const isSelected = selectedIds.includes(transcript.id);

            return (
              <TableRow
                key={transcript.id}
                className={cn(
                  "group",
                  isSelected && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleOne(transcript.id)}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/transcript/${transcript.id}`}
                    className="font-medium hover:text-primary transition-colors line-clamp-1"
                  >
                    {transcript.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {format(transcript.createdAt, "MMM d, yyyy, h:mm a")}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {formatDuration(transcript.duration)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {modeInfo && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{modeInfo.emoji}</span>
                      <span className="text-sm text-muted-foreground">
                        {modeInfo.name}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(transcript.status)}
                    <span
                      className={cn(
                        "text-sm capitalize",
                        transcript.status === "completed" && "text-green-600",
                        transcript.status === "processing" && "text-primary",
                        transcript.status === "failed" && "text-destructive"
                      )}
                    >
                      {transcript.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FolderInput className="mr-2 h-4 w-4" />
                        Move to Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {transcripts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No transcripts yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload an audio or video file to get started
          </p>
        </div>
      )}
    </div>
  );
}

