import { useState, useCallback } from 'react';

interface AudioData {
  url: string;
  name: string;
}

/**
 * Hook for fetching signed audio URLs
 */
export function useAudioUrl(transcriptId: string | undefined) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioUrl = useCallback(async () => {
    if (!transcriptId) return null;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/audio/${transcriptId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No audio file - this is normal
          setAudioUrl(null);
          return null;
        }
        throw new Error('Failed to fetch audio URL');
      }

      const data = await response.json();
      
      if (data.success && data.data?.url) {
        setAudioUrl(data.data.url);
        return data.data.url;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching audio URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to load audio');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [transcriptId]);

  const deleteAudio = useCallback(async () => {
    if (!transcriptId) return false;
    
    try {
      const response = await fetch(`/api/audio/${transcriptId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAudioUrl(null);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting audio:', err);
      return false;
    }
  }, [transcriptId]);

  return {
    audioUrl,
    isLoading,
    error,
    fetchAudioUrl,
    deleteAudio,
  };
}

