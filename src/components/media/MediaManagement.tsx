"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MediaService,
  Media,
  MediaType,
  MediaSource,
  GenerateImageRequest,
  GenerateAudioRequest,
} from "../../services/mediaService";
import {
  PhotoIcon,
  MusicalNoteIcon,
  FilmIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  LinkIcon,
  SparklesIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

interface MediaManagementProps {}

export default function MediaManagement({}: MediaManagementProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const [selectedSource, setSelectedSource] = useState<MediaSource | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGenerateImageModal, setShowGenerateImageModal] = useState(false);
  const [showGenerateAudioModal, setShowGenerateAudioModal] = useState(false);
  const [showRecordVideoModal, setShowRecordVideoModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Generate Image state
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imageSize, setImageSize] = useState<
    "1024x1024" | "1024x1792" | "1792x1024"
  >("1024x1024");

  // Generate Audio state
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [audioText, setAudioText] = useState("");
  const [audioTitle, setAudioTitle] = useState("");
  const [audioDescription, setAudioDescription] = useState("");
  const [audioVoice, setAudioVoice] = useState<
    "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
  >("alloy");
  const [audioModel, setAudioModel] = useState<"tts-1" | "tts-1-hd">("tts-1");

  useEffect(() => {
    fetchMedia();
  }, [selectedType, selectedSource, searchTerm, page]);

  const fetchMedia = async () => {
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
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      setUploading(true);
      await MediaService.uploadMedia({
        file: uploadFile,
        title: uploadTitle || undefined,
        description: uploadDescription || undefined,
      });
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle("");
      setUploadDescription("");
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;

    try {
      setGeneratingImage(true);
      await MediaService.generateImage({
        prompt: imagePrompt,
        title: imageTitle || undefined,
        description: imageDescription || undefined,
        size: imageSize,
      });
      setShowGenerateImageModal(false);
      setImagePrompt("");
      setImageTitle("");
      setImageDescription("");
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!audioText) return;

    try {
      setGeneratingAudio(true);
      await MediaService.generateAudio({
        text: audioText,
        title: audioTitle || undefined,
        description: audioDescription || undefined,
        voice: audioVoice,
        model: audioModel,
      });
      setShowGenerateAudioModal(false);
      setAudioText("");
      setAudioTitle("");
      setAudioDescription("");
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Failed to generate audio");
    } finally {
      setGeneratingAudio(false);
    }
  };

  const handleUploadRecordedVideo = async (videoBlob: Blob) => {
    if (!videoBlob) return;

    try {
      setUploading(true);
      // Convert blob to File - use proper filename with .webm extension
      const timestamp = Date.now();
      const videoFile = new File(
        [videoBlob],
        `video-recording-${timestamp}.webm`,
        { type: "video/webm" }
      );

      // Use default title if not provided, same as other uploads
      const defaultTitle =
        uploadTitle || `Recorded Video ${new Date(timestamp).toLocaleString()}`;

      await MediaService.uploadMedia({
        file: videoFile,
        title: defaultTitle,
        description: uploadDescription || undefined,
      });
      setShowRecordVideoModal(false);
      setUploadTitle("");
      setUploadDescription("");
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      await MediaService.deleteMedia(id);
      fetchMedia();
    } catch (err: any) {
      setError(err.message || "Failed to delete media");
    }
  };

  const handleCopyUrl = async (url: string, id: string) => {
    const success = await MediaService.copyToClipboard(url);
    if (success) {
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case MediaType.IMAGE:
        return PhotoIcon;
      case MediaType.AUDIO:
        return MusicalNoteIcon;
      case MediaType.VIDEO:
        return FilmIcon;
      default:
        return PhotoIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            Upload Media
          </button>
          <button
            onClick={() => setShowGenerateImageModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <SparklesIcon className="w-5 h-5" />
            Generate Image
          </button>
          <button
            onClick={() => setShowGenerateAudioModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <SparklesIcon className="w-5 h-5" />
            Generate Audio
          </button>
          <button
            onClick={() => setShowRecordVideoModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <FilmIcon className="w-5 h-5" />
            Record Video
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as MediaType | "all");
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value={MediaType.IMAGE}>Images</option>
            <option value={MediaType.AUDIO}>Audio</option>
            <option value={MediaType.VIDEO}>Videos</option>
          </select>
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value as MediaSource | "all");
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value={MediaSource.UPLOADED}>Uploaded</option>
            <option value={MediaSource.GENERATED}>Generated</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading media...</p>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No media files
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading or generating media
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => {
            const Icon = getMediaIcon(item.type);
            console.log(
              "Rendering media item:",
              item.title,
              "URL:",
              item.publicUrl
            );
            return (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Media Preview */}
                <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                  {item.type === MediaType.IMAGE ? (
                    <img
                      src={item.publicUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.error(
                          "Failed to load image:",
                          item.publicUrl,
                          "Error:",
                          e
                        );
                      }}
                      onLoad={() => {
                        console.log(
                          "Image loaded successfully:",
                          item.publicUrl
                        );
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <Icon className="w-16 h-16 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-500 capitalize">
                        {item.type}
                      </p>
                    </div>
                  )}
                  {item.source === MediaSource.GENERATED && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      AI
                    </div>
                  )}
                </div>

                {/* Media Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.createdBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Created by:{" "}
                      {item.createdBy.firstName && item.createdBy.lastName
                        ? `${item.createdBy.firstName} ${item.createdBy.lastName}`
                        : item.createdBy.email}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(item.size)}</span>
                    <span className="capitalize">{item.type}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleCopyUrl(item.publicUrl, item._id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                      title="Copy public URL"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {copySuccess === item._id ? "Copied!" : "Copy URL"}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => {
            setShowUploadModal(false);
            setUploadFile(null);
            setUploadTitle("");
            setUploadDescription("");
          }}
          onUpload={handleUpload}
          uploading={uploading}
          title={uploadTitle}
          setTitle={setUploadTitle}
          description={uploadDescription}
          setDescription={setUploadDescription}
          file={uploadFile}
          setFile={setUploadFile}
        />
      )}

      {/* Generate Image Modal */}
      {showGenerateImageModal && (
        <GenerateImageModal
          onClose={() => {
            setShowGenerateImageModal(false);
            setImagePrompt("");
            setImageTitle("");
            setImageDescription("");
          }}
          onGenerate={handleGenerateImage}
          generating={generatingImage}
          prompt={imagePrompt}
          setPrompt={setImagePrompt}
          title={imageTitle}
          setTitle={setImageTitle}
          description={imageDescription}
          setDescription={setImageDescription}
          size={imageSize}
          setSize={setImageSize}
        />
      )}

      {/* Generate Audio Modal */}
      {showGenerateAudioModal && (
        <GenerateAudioModal
          onClose={() => {
            setShowGenerateAudioModal(false);
            setAudioText("");
            setAudioTitle("");
            setAudioDescription("");
          }}
          onGenerate={handleGenerateAudio}
          generating={generatingAudio}
          text={audioText}
          setText={setAudioText}
          title={audioTitle}
          setTitle={setAudioTitle}
          description={audioDescription}
          setDescription={setAudioDescription}
          voice={audioVoice}
          setVoice={setAudioVoice}
          model={audioModel}
          setModel={setAudioModel}
        />
      )}

      {/* Record Video Modal */}
      {showRecordVideoModal && (
        <RecordVideoModal
          onClose={() => setShowRecordVideoModal(false)}
          onUpload={handleUploadRecordedVideo}
          uploading={uploading}
          title={uploadTitle}
          setTitle={setUploadTitle}
          description={uploadDescription}
          setDescription={setUploadDescription}
        />
      )}
    </div>
  );
}

// Upload Modal Component
function UploadModal({
  onClose,
  onUpload,
  uploading,
  title,
  setTitle,
  description,
  setDescription,
  file,
  setFile,
}: {
  onClose: () => void;
  onUpload: () => void;
  uploading: boolean;
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Upload Media</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File
            </label>
            <input
              type="file"
              accept="image/*,audio/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {file && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={!file || uploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Generate Image Modal Component
function GenerateImageModal({
  onClose,
  onGenerate,
  generating,
  prompt,
  setPrompt,
  title,
  setTitle,
  description,
  setDescription,
  size,
  setSize,
}: {
  onClose: () => void;
  onGenerate: () => void;
  generating: boolean;
  prompt: string;
  setPrompt: (s: string) => void;
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
  size: "1024x1024" | "1024x1792" | "1792x1024";
  setSize: (s: "1024x1024" | "1024x1792" | "1792x1024") => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Generate Image with AI</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              value={size}
              onChange={(e) =>
                setSize(
                  e.target.value as "1024x1024" | "1024x1792" | "1792x1024"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="1024x1024">Square (1024x1024)</option>
              <option value="1024x1792">Portrait (1024x1792)</option>
              <option value="1792x1024">Landscape (1792x1024)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onGenerate}
            disabled={!prompt || generating}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Generate Audio Modal Component
function GenerateAudioModal({
  onClose,
  onGenerate,
  generating,
  text,
  setText,
  title,
  setTitle,
  description,
  setDescription,
  voice,
  setVoice,
  model,
  setModel,
}: {
  onClose: () => void;
  onGenerate: () => void;
  generating: boolean;
  text: string;
  setText: (s: string) => void;
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  setVoice: (
    v: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
  ) => void;
  model: "tts-1" | "tts-1-hd";
  setModel: (m: "tts-1" | "tts-1-hd") => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Generate Audio with AI</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text to convert to speech..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice
              </label>
              <select
                value={voice}
                onChange={(e) =>
                  setVoice(
                    e.target.value as
                      | "alloy"
                      | "echo"
                      | "fable"
                      | "onyx"
                      | "nova"
                      | "shimmer"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="alloy">Alloy</option>
                <option value="echo">Echo</option>
                <option value="fable">Fable</option>
                <option value="onyx">Onyx</option>
                <option value="nova">Nova</option>
                <option value="shimmer">Shimmer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) =>
                  setModel(e.target.value as "tts-1" | "tts-1-hd")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="tts-1">TTS-1 (Faster)</option>
                <option value="tts-1-hd">TTS-1-HD (Higher Quality)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onGenerate}
            disabled={!text || generating}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Record Video Modal Component
function RecordVideoModal({
  onClose,
  onUpload,
  uploading,
  title,
  setTitle,
  description,
  setDescription,
}: {
  onClose: () => void;
  onUpload: (videoBlob: Blob) => void;
  uploading: boolean;
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Request camera and microphone access
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err: any) {
        setError(
          err.message ||
            "Failed to access camera and microphone. Please check permissions."
        );
      }
    };

    startCamera();

    // Cleanup on unmount
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);

  const startRecording = () => {
    if (!stream) {
      setError("Camera stream not available");
      return;
    }

    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordingTime(0);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleUpload = () => {
    if (recordedBlob) {
      onUpload(recordedBlob);
    }
  };

  const handleRetake = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
    setMediaRecorder(null);
  };

  const handleClose = () => {
    // Stop recording if active
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    // Reset state
    setRecordedBlob(null);
    setRecordingTime(0);
    setMediaRecorder(null);
    setError(null);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-xl font-bold mb-4">Record Video</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Video Preview */}
        <div className="mb-4 relative bg-black rounded-lg overflow-hidden aspect-video">
          {recordedBlob ? (
            <video
              src={URL.createObjectURL(recordedBlob)}
              controls
              className="w-full h-full"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          )}
          {recording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        {!recordedBlob && (
          <div className="mb-4 flex justify-center gap-4">
            {!recording ? (
              <button
                onClick={startRecording}
                disabled={!stream || uploading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FilmIcon className="w-5 h-5" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <XCircleIcon className="w-5 h-5" />
                Stop Recording
              </button>
            )}
          </div>
        )}

        {/* Title and Description */}
        {recordedBlob && (
          <div className="mb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description (optional)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          {recordedBlob && (
            <>
              <button
                onClick={handleRetake}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Retake
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
