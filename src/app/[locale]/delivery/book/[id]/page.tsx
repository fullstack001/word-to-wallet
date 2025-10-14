"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useLocalizedNavigation } from "@/utils/navigation";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, deliveryApi } from "@/services/deliveryApi";
import "@/components/admin/course/jodit-styles.css";
import Image from "next/image";
import BookEditModal from "@/components/BookEditModal";
import {
  BookOpen,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  Calendar,
  FileText,
  Music,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Settings,
  Share2,
  Copy,
  Link,
  BarChart3,
  Users,
  Mail,
  ChevronDown,
  Monitor,
  Cloud,
  Stamp,
  Droplets,
  HelpCircle,
} from "lucide-react";

interface BookManagementPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface BookFile {
  type: string;
  filename: string;
  distributedSize: string | null;
  uploadedSize: string | null;
  updated: string | null;
  status: string | null;
  using: string | null;
}

interface CoverImageComponentProps {
  bookId: string;
  title: string;
  coverImageKey: string;
}

const CoverImageComponent: React.FC<CoverImageComponentProps> = ({
  bookId,
  title,
  coverImageKey,
}) => {
  // const [imageError, setImageError] = useState(false);
  // const [imageSrc, setImageSrc] = useState<string>("");

  // useEffect(() => {
  //   const loadImage = async () => {
  //     try {
  //       const url = `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/cover`;
  //       console.log("Attempting to load cover image:", url);

  //       // Test the URL first
  //       const response = await fetch(url, { method: "HEAD" });
  //       console.log(
  //         "Cover image HEAD response:",
  //         response.status,
  //         response.statusText
  //       );

  //       if (response.ok) {
  //         setImageSrc(url);
  //       } else {
  //         console.error(
  //           "Cover image HEAD failed:",
  //           response.status,
  //           response.statusText
  //         );
  //         setImageError(true);
  //       }
  //     } catch (error) {
  //       console.error("Error loading cover image:", error);
  //       setImageError(true);
  //     }
  //   };

  //   loadImage();
  // }, [bookId]);

  // if (imageError) {
  //   return (
  //     <div className="w-full h-full flex items-center justify-center text-center text-gray-500">
  //       <div>
  //         <div className="text-xs mb-1">COVER IMAGE</div>
  //         <div className="text-xs">FAILED TO LOAD</div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!imageSrc) {
  //   return (
  //     <div className="w-full h-full flex items-center justify-center text-center text-gray-500">
  //       <div>
  //         <div className="text-xs mb-1">LOADING</div>
  //         <div className="text-xs">COVER...</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Image
      className="w-full h-full rounded-lg object-cover"
      src={`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/cover}`}
      alt={title}
      width={128}
      height={192}
      // onLoad={() => {
      //   console.log("Cover image loaded successfully:", imageSrc);
      // }}
      // onError={() => {
      //   console.error("Cover image failed to load:", imageSrc);
      //   setImageError(true);
      // }}
    />
  );
};

export default function BookManagementPage({
  params,
}: BookManagementPageProps) {
  const { id } = use(params);
  const t = useTranslations();
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    description: "",
  });
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const [epubUploading, setEpubUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const epubFileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchBook = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch book: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setBook(data.data);
        setEditForm({
          title: data.data.title,
          author: data.data.author,
          description: data.data.description || "",
        });

        // Debug cover image data
        if (data.data.coverImageKey) {
          console.log("Cover image data:", {
            coverImageKey: data.data.coverImageKey,
            coverImageName: data.data.coverImageName,
            coverImageSize: data.data.coverImageSize,
            imageUrl: `${process.env.NEXT_PUBLIC_API_URL}/books/${data.data._id}/cover`,
          });
        }
      } else {
        throw new Error(data.message || "Failed to fetch book");
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && id) {
      fetchBook();
    }
  }, [isLoggedIn, id]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleAudioUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !book) return;

    // Validate file type
    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
      "audio/aac",
      "audio/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a valid audio file (MP3, WAV, OGG, M4A, AAC, or WebM)"
      );
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError("Audio file size must be less than 100MB");
      return;
    }

    setAudioUploading(true);
    setAudioUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setAudioUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await deliveryApi.uploadAudioFile(book._id, file);

      clearInterval(progressInterval);
      setAudioUploadProgress(100);

      // Refresh book data to get updated file information
      await fetchBook();

      // Reset file input
      if (audioFileInputRef.current) {
        audioFileInputRef.current.value = "";
      }

      setTimeout(() => {
        setAudioUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Audio upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload audio file"
      );
    } finally {
      setAudioUploading(false);
    }
  };

  const triggerAudioFileUpload = () => {
    audioFileInputRef.current?.click();
  };

  const handleEpubUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !book) return;

    // Validate file type
    if (
      file.type !== "application/epub+zip" &&
      !file.name.toLowerCase().endsWith(".epub")
    ) {
      setError("Please select a valid EPUB file");
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError("EPUB file size must be less than 100MB");
      return;
    }

    setEpubUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("epubFile", file);

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload EPUB file");
      }

      // Refresh book data
      await fetchBook();

      // Reset file input
      if (epubFileInputRef.current) {
        epubFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("EPUB upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload EPUB file"
      );
    } finally {
      setEpubUploading(false);
    }
  };

  const handlePdfUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !book) return;

    // Validate file type
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file");
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError("PDF file size must be less than 100MB");
      return;
    }

    setPdfUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("epubFile", file); // Using same field name as EPUB for backend compatibility

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload PDF file");
      }

      // Refresh book data
      await fetchBook();

      // Reset file input
      if (pdfFileInputRef.current) {
        pdfFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("PDF upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload PDF file"
      );
    } finally {
      setPdfUploading(false);
    }
  };

  const triggerEpubFileUpload = () => {
    epubFileInputRef.current?.click();
  };

  const triggerPdfFileUpload = () => {
    pdfFileInputRef.current?.click();
  };

  // Helper function to render JoditEditor HTML content with proper styling
  const renderJoditContent = (
    htmlString: string | undefined,
    fallback: string = ""
  ) => {
    const content = htmlString || fallback;
    return { __html: content };
  };

  const handleCoverUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !book) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("Cover image size must be less than 10MB");
      return;
    }

    setCoverUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}/upload-cover`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload cover image");
      }

      // Refresh book data to get updated cover information
      await fetchBook();

      // Reset file input
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Cover upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload cover image"
      );
    } finally {
      setCoverUploading(false);
    }
  };

  const handleCoverDownload = async () => {
    if (!book?.coverImageKey) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}/cover`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download cover image");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = book.coverImageName || `${book.title} - Cover.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Cover download failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to download cover image"
      );
    }
  };

  const triggerCoverFileUpload = () => {
    coverFileInputRef.current?.click();
  };

  if (!isLoggedIn) {
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading book...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-32">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Book Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              {error || "The book you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/delivery")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Books
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate file data from actual book data
  const getBookFiles = (): BookFile[] => {
    const files: BookFile[] = [];

    // EPUB File
    if (book.epubFile?.fileName) {
      files.push({
        type: "EPUB",
        filename: book.epubFile.fileName,
        distributedSize: book.epubFile.fileSize
          ? formatFileSize(book.epubFile.fileSize)
          : "-",
        uploadedSize: book.epubFile.fileSize
          ? formatFileSize(book.epubFile.fileSize)
          : "-",
        updated: book.epubFile.uploadedAt
          ? formatDate(book.epubFile.uploadedAt)
          : "-",
        status: "Ready",
        using: null,
      });
    }

    // PDF File
    if (book.pdfFile?.fileName) {
      files.push({
        type: "PDF",
        filename: book.pdfFile.fileName,
        distributedSize: book.pdfFile.fileSize
          ? formatFileSize(book.pdfFile.fileSize)
          : "-",
        uploadedSize: book.pdfFile.fileSize
          ? formatFileSize(book.pdfFile.fileSize)
          : "-",
        updated: book.pdfFile.uploadedAt
          ? formatDate(book.pdfFile.uploadedAt)
          : "-",
        status: "Ready",
        using: null,
      });
    }

    // Audio File
    if (book.audioFile?.fileName) {
      files.push({
        type: "AUDIO",
        filename: book.audioFile.fileName,
        distributedSize: book.audioFile.fileSize
          ? formatFileSize(book.audioFile.fileSize)
          : "-",
        uploadedSize: book.audioFile.fileSize
          ? formatFileSize(book.audioFile.fileSize)
          : "-",
        updated: book.audioFile.uploadedAt
          ? formatDate(book.audioFile.uploadedAt)
          : "-",
        status: "Ready",
        using: null,
      });
    }

    // Legacy file (for backward compatibility)
    if (book.fileName && !book.epubFile && !book.pdfFile && !book.audioFile) {
      files.push({
        type: book.fileType?.toUpperCase() || "FILE",
        filename: book.fileName,
        distributedSize: book.fileSize ? formatFileSize(book.fileSize) : "-",
        uploadedSize: book.fileSize ? formatFileSize(book.fileSize) : "-",
        updated: book.updatedAt ? formatDate(book.updatedAt) : "-",
        status: "Ready",
        using: null,
      });
    }

    return files;
  };

  const files = getBookFiles();

  return (
    <div className="min-h-screen ">
      {/* JoditEditor Content Styles */}
      <style jsx>{`
        .jodit-wysiwyg {
          line-height: 1.6;
        }
        .jodit-wysiwyg p {
          margin-bottom: 0.5rem;
        }
        .jodit-wysiwyg h1,
        .jodit-wysiwyg h2,
        .jodit-wysiwyg h3,
        .jodit-wysiwyg h4,
        .jodit-wysiwyg h5,
        .jodit-wysiwyg h6 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .jodit-wysiwyg ul,
        .jodit-wysiwyg ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .jodit-wysiwyg li {
          margin-bottom: 0.25rem;
        }
        .jodit-wysiwyg blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        .jodit-wysiwyg strong,
        .jodit-wysiwyg b {
          font-weight: 600;
        }
        .jodit-wysiwyg em,
        .jodit-wysiwyg i {
          font-style: italic;
        }
        .jodit-wysiwyg u {
          text-decoration: underline;
        }
        .jodit-wysiwyg a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .jodit-wysiwyg a:hover {
          color: #1d4ed8;
        }
      `}</style>
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-32">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/delivery/book")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books</span>
          </button>
        </div>

        {/* Main Content - Book Management Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Book Info and Cover Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* Book Info and Cover Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-6">
                {/* Logo and Cover Section */}
                <div className="flex flex-col items-center space-y-4">
                  {/* Cover Image */}
                  <div className="w-32 h-40 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                    {book.coverImageKey ? (
                      <CoverImageComponent
                        bookId={book._id}
                        title={book.title}
                        coverImageKey={book.coverImageKey}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="text-xs mb-1">BOOK COVER</div>
                        <div className="text-xs">NOT AVAILABLE</div>
                      </div>
                    )}
                  </div>

                  {/* Cover Actions */}
                  <div className="flex flex-col space-y-2 w-full">
                    {/* Hidden file input */}
                    <input
                      ref={coverFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />

                    <button
                      onClick={triggerCoverFileUpload}
                      disabled={coverUploading}
                      className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {coverUploading ? "Uploading..." : "Upload Cover"}
                    </button>
                    {book.coverImageKey && (
                      <button
                        onClick={handleCoverDownload}
                        className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Download Cover
                      </button>
                    )}
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {book.title}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const readerUrl =
                            process.env.NEXT_PUBLIC_READER_URL ||
                            "http://localhost:3002";
                          window.open(`${readerUrl}/${book._id}`, "_blank");
                        }}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        <Cloud className="w-4 h-4" />
                        <span>View on Cloud</span>
                      </button>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 mb-3">{book.author}</p>
                  <div
                    className="text-gray-700 mb-4 text-sm jodit-wysiwyg"
                    dangerouslySetInnerHTML={renderJoditContent(
                      book.description,
                      "Pregnant vet's wife wins a bet in San Diego tavern."
                    )}
                  />
                  {book.notesToReaders && !showNotes && (
                    <button
                      onClick={() => setShowNotes(true)}
                      className="text-red-600 hover:text-red-800 text-sm underline mb-4"
                    >
                      Show Note to Readers
                    </button>
                  )}
                  {book.notesToReaders && showNotes && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Note to Readers:
                        </h4>
                        <button
                          onClick={() => setShowNotes(false)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                          Hide
                        </button>
                      </div>
                      <div
                        className="text-gray-700 text-sm jodit-wysiwyg bg-gray-50 p-3 rounded-md"
                        dangerouslySetInnerHTML={renderJoditContent(
                          book.notesToReaders
                        )}
                      />
                    </div>
                  )}
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Rated: PG-13</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <span className="text-sm text-gray-700">
                      Readers can read in the WordToWallet app
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Readers can read in their browser on any device
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {book.ebookType === "audio"
                        ? "Readers can download and stream audio files"
                        : "Readers can download and email an EPUB, MOBI, or PDF"}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${
                      book.ebookType === "audio"
                        ? "text-green-500"
                        : "text-orange-500"
                    }`}
                  >
                    {book.ebookType === "audio" ? "enabled" : "disable"}
                  </span>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Stamp className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      PDF files will NOT be stamped with the reader's email
                      address
                    </span>
                  </div>
                  <span className="text-orange-500 text-xs">change</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Hidden watermarks* will be applied to EPUB and MOBI files
                    </span>
                  </div>
                  <span className="text-orange-500 text-xs">change</span>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  *Excluding simple download pages
                </p> */}
              </div>
            </div>
          </div>
        </div>

        {/* File Management Section */}
        {book.ebookType === "audio" ? (
          /* Audio File Upload Section */
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Music className="w-5 h-5 mr-2" />
              Audio File Management
            </h3>

            {/* Hidden file input */}
            <input
              ref={audioFileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />

            {/* Upload Progress */}
            {audioUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading audio file...</span>
                  <span>{audioUploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${audioUploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Upload Button */}
            <div className="text-center">
              <button
                onClick={triggerAudioFileUpload}
                disabled={audioUploading}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {audioUploading ? "Uploading..." : "Upload Audio File"}
              </button>
              <p className="text-gray-600 text-sm mb-2">
                Drop audio file here or click to add your .mp3, .wav, .m4a, or
                .aac file
              </p>
              <p className="text-gray-500 text-xs">
                Maximum file size: 100MB. Supported formats: MP3, WAV, OGG, M4A,
                AAC, WebM
              </p>
            </div>

            {/* Current Audio File Info */}
            {book.audioFile?.fileName && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Music className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {book.audioFile.fileName}
                      </p>
                      {book.audioFile.fileSize && (
                        <p className="text-xs text-gray-500">
                          {formatFileSize(book.audioFile.fileSize)}
                        </p>
                      )}
                      {book.audioFile.uploadedAt && (
                        <p className="text-xs text-gray-400">
                          Uploaded: {formatDate(book.audioFile.uploadedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                Learn more about audio file delivery and streaming
              </button>
            </div>
          </div>
        ) : (
          /* Regular Book Files Section */
          <div className="mt-8 bg-white rounded-lg shadow-sm border">
            {/* Hidden file inputs */}
            <input
              ref={epubFileInputRef}
              type="file"
              accept=".epub,application/epub+zip"
              onChange={handleEpubUpload}
              className="hidden"
            />
            <input
              ref={pdfFileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md m-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distributed Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4 text-gray-400" />
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {file.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              {file.filename}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.distributedSize || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.uploadedSize || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.updated || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {file.status ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {file.status}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Upload Book Files Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* EPUB Upload */}
                <div className="text-center">
                  <button
                    onClick={triggerEpubFileUpload}
                    disabled={epubUploading}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {epubUploading ? "Uploading EPUB..." : "Upload EPUB"}
                  </button>
                  <p className="text-gray-600 text-sm mb-1">
                    Upload .epub file
                  </p>
                  <p className="text-gray-500 text-xs">Maximum 100MB</p>
                </div>

                {/* PDF Upload */}
                <div className="text-center">
                  <button
                    onClick={triggerPdfFileUpload}
                    disabled={pdfUploading}
                    className="w-full px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pdfUploading ? "Uploading PDF..." : "Upload PDF"}
                  </button>
                  <p className="text-gray-600 text-sm mb-1">Upload .pdf file</p>
                  <p className="text-gray-500 text-xs">Maximum 100MB</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-xs">
                  Universal Book Links do not require any files.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                Learn more about these file types and how Word2Wallet uses them
              </button>
            </div>
          </div>
        )}
        {/* Add to Reader Library Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add to Reader Library
            </h3>
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
              <HelpCircle className="w-3 h-3 text-gray-600" />
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Reader Email Address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && book && (
        <BookEditModal
          book={book}
          onComplete={fetchBook}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
