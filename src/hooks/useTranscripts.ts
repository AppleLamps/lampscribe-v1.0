'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Transcript {
  id: string;
  name: string;
  originalName: string;
  text: string;
  language: string | null;
  duration: number | null;
  mode: 'CHEETAH' | 'DOLPHIN' | 'WHALE';
  fileSize: number | null;
  fileType: string | null;
  audioUrl: string | null;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  error: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  userId: string;
  folderId: string | null;
  folder: Folder | null;
}

export interface Folder {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _count?: {
    transcripts: number;
  };
}

interface UseTranscriptsOptions {
  folderId?: string;
  status?: string;
  search?: string;
  limit?: number;
}

interface UseTranscriptsReturn {
  transcripts: Transcript[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  pagination: {
    total: number;
    hasMore: boolean;
  };
}

export function useTranscripts(options: UseTranscriptsOptions = {}): UseTranscriptsReturn {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });

  const fetchTranscripts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.folderId) params.set('folderId', options.folderId);
      if (options.status) params.set('status', options.status);
      if (options.search) params.set('search', options.search);
      if (options.limit) params.set('limit', options.limit.toString());

      const response = await fetch(`/api/transcripts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transcripts');
      }

      const data = await response.json();
      
      if (data.success) {
        setTranscripts(data.data);
        setPagination({
          total: data.pagination.total,
          hasMore: data.pagination.hasMore,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch transcripts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcripts');
    } finally {
      setIsLoading(false);
    }
  }, [options.folderId, options.status, options.search, options.limit]);

  useEffect(() => {
    fetchTranscripts();
  }, [fetchTranscripts]);

  return {
    transcripts,
    isLoading,
    error,
    refetch: fetchTranscripts,
    pagination,
  };
}

interface UseFoldersReturn {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createFolder: (name: string, color?: string) => Promise<Folder | null>;
}

export function useFolders(): UseFoldersReturn {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/folders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }

      const data = await response.json();
      
      if (data.success) {
        setFolders(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch folders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (name: string, color?: string): Promise<Folder | null> => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      const data = await response.json();
      
      if (data.success) {
        setFolders(prev => [...prev, data.data]);
        return data.data;
      }
      
      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    isLoading,
    error,
    refetch: fetchFolders,
    createFolder,
  };
}

interface UseTranscriptReturn {
  transcript: Transcript | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTranscript: (updates: Partial<Transcript>) => Promise<boolean>;
  deleteTranscript: () => Promise<boolean>;
}

export function useTranscript(id: string): UseTranscriptReturn {
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscript = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transcripts/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Transcript not found');
        }
        throw new Error('Failed to fetch transcript');
      }

      const data = await response.json();
      
      if (data.success) {
        setTranscript(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch transcript');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const updateTranscript = useCallback(async (updates: Partial<Transcript>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/transcripts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update transcript');
      }

      const data = await response.json();
      
      if (data.success) {
        setTranscript(data.data);
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }, [id]);

  const deleteTranscript = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/transcripts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transcript');
      }

      return true;
    } catch {
      return false;
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTranscript();
    }
  }, [id, fetchTranscript]);

  return {
    transcript,
    isLoading,
    error,
    refetch: fetchTranscript,
    updateTranscript,
    deleteTranscript,
  };
}

