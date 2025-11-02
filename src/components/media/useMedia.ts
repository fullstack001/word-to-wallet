import { useState, useEffect, useCallback } from "react";
import { Media, MediaType, MediaSource, MediaService } from "../../services/mediaService";

interface UseMediaOptions {
  selectedType: MediaType | "all";
  selectedSource: MediaSource | "all";
  searchTerm: string;
  page: number;
}

export function useMedia({ selectedType, selectedSource, searchTerm, page }: UseMediaOptions) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MediaService.getMedia({
        type: selectedType !== "all" ? selectedType : undefined,
        source: selectedSource !== "all" ? selectedSource : undefined,
        search: searchTerm || undefined,
        page,
        limit: 20,
      });
      console.log("Media fetched:", response.media);
      setMedia(response.media);
      setTotalPages(response.pagination.pages);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch media");
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedSource, searchTerm, page]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, error, totalPages, refetch: fetchMedia };
}

