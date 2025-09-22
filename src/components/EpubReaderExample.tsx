"use client";
import React, { useState, useEffect } from "react";
import EpubReader from "./EpubReader";
import axios from "axios";

interface BookData {
  id: string;
  title: string;
  author: string;
  ebookFile: string;
  watermarkFile?: string;
  audioItems: Array<{
    _id: string;
    title: string;
    fileUrl: string;
  }>;
  videoItems: Array<{
    _id: string;
    title: string;
    fileUrl: string;
  }>;
  youtubeItems: Array<{
    _id: string;
    title: string;
    link: string;
  }>;
  pages: Array<{
    content: string;
  }>;
  bookType: string;
}

interface EpubReaderExampleProps {
  bookId: string;
  inviteToken?: string;
  subscriberInviteToken?: string;
}

const EpubReaderExample: React.FC<EpubReaderExampleProps> = ({
  bookId,
  inviteToken,
  subscriberInviteToken,
}) => {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build request parameters
        const params: any = {};
        if (inviteToken) {
          params.invite = inviteToken;
        } else if (subscriberInviteToken) {
          params.subscriberInvite = subscriberInviteToken;
        }

        // Make API request
        const response = await axios.get(`/api/books/${bookId}`, { params });
        const book = response.data.book;

        // Determine which file to use based on user role/permissions
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");

        const selectedUrl =
          // Uncomment the following lines if you want to use watermark for non-authenticated users
          // role === "user" || !token
          //   ? `${process.env.NEXT_PUBLIC_API_URL}${book.watermarkFile}`
          //   :
          `${process.env.NEXT_PUBLIC_API_URL}${book.ebookFile}`;

        setBookData({
          id: book._id,
          title: book.title,
          author: book.author,
          ebookFile: selectedUrl,
          watermarkFile: book.watermarkFile,
          audioItems: book.audioItems || [],
          videoItems: book.videoItems || [],
          youtubeItems: book.youtubeItems || [],
          pages: book.pages || [],
          bookType: book.bookType || "",
        });
      } catch (err) {
        console.error("Error fetching book data:", err);
        setError("Failed to load book data");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId, inviteToken, subscriberInviteToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error || "Book not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <EpubReader
      epubUrl={bookData.ebookFile}
      title={bookData.title}
      author={bookData.author}
      audioItems={bookData.audioItems}
      videoItems={bookData.videoItems}
      youtubeItems={bookData.youtubeItems}
      bookContents={bookData.pages}
      bookType={bookData.bookType}
      onBack={() => window.history.back()}
    />
  );
};

export default EpubReaderExample;
