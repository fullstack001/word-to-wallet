import { useState, useEffect } from "react";
import { emailCampaignService, Book } from "@/services/emailCampaignService";

export const useBooks = (options?: { type?: string }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await emailCampaignService.getUserBooks(options);
      if (response.success && response.data) {
        // Filter out written books, only allow uploaded books
        const regularBooks = response.data.filter(
          (book) => book.type === "uploaded"
        );
        setBooks(regularBooks);
      } else {
        throw new Error(response.message || "Failed to fetch books");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch books");
      console.error("Error fetching books:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [options?.type]);

  return {
    books,
    isLoading,
    error,
    refreshBooks: fetchBooks,
  };
};
