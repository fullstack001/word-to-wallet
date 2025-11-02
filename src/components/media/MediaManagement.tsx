"use client";

import React, { useState } from "react";
import {
  MediaType,
  MediaSource,
  MediaService,
} from "../../services/mediaService";
import { useMedia } from "./useMedia";
import MediaGrid from "./MediaGrid";
import MediaFilters from "./MediaFilters";
import MediaActionBar from "./MediaActionBar";
import MediaPagination from "./MediaPagination";
import ErrorMessage from "./ErrorMessage";
import UploadModal from "./modals/UploadModal";
import GenerateImageModal from "./modals/GenerateImageModal";
import GenerateAudioModal from "./modals/GenerateAudioModal";
import RecordVideoModal from "./modals/RecordVideoModal";
import RecordAudioModal from "./modals/RecordAudioModal";

interface MediaManagementProps {}

export default function MediaManagement({}: MediaManagementProps) {
  const [selectedType, setSelectedType] = useState<MediaType | "all">("all");
  const [selectedSource, setSelectedSource] = useState<MediaSource | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGenerateImageModal, setShowGenerateImageModal] = useState(false);
  const [showGenerateAudioModal, setShowGenerateAudioModal] = useState(false);
  const [showRecordVideoModal, setShowRecordVideoModal] = useState(false);
  const [showRecordAudioModal, setShowRecordAudioModal] = useState(false);
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

  // Use custom hook for media fetching
  const {
    media,
    loading,
    error,
    totalPages,
    refetch: refetchMedia,
  } = useMedia({
    selectedType,
    selectedSource,
    searchTerm,
    page,
  });

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
      refetchMedia();
    } catch (err: any) {
      // Error handled by useMedia hook
      console.error(err);
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
      refetchMedia();
    } catch (err: any) {
      // Error handled by useMedia hook
      console.error(err);
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
      refetchMedia();
    } catch (err: any) {
      // Error handled by useMedia hook
      console.error(err);
    } finally {
      setGeneratingAudio(false);
    }
  };

  const handleUploadRecordedVideo = async (videoBlob: Blob) => {
    if (!videoBlob) return;

    try {
      setUploading(true);
      const timestamp = Date.now();
      const videoFile = new File(
        [videoBlob],
        `video-recording-${timestamp}.webm`,
        { type: "video/webm" }
      );

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
      refetchMedia();
    } catch (err: any) {
      // Error handled by useMedia hook
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadRecordedAudio = async (audioBlob: Blob) => {
    if (!audioBlob) return;

    try {
      setUploading(true);
      const timestamp = Date.now();
      const audioFile = new File(
        [audioBlob],
        `audio-recording-${timestamp}.webm`,
        { type: "audio/webm" }
      );

      const defaultTitle =
        uploadTitle || `Recorded Audio ${new Date(timestamp).toLocaleString()}`;

      await MediaService.uploadMedia({
        file: audioFile,
        title: defaultTitle,
        description: uploadDescription || undefined,
      });
      setShowRecordAudioModal(false);
      setUploadTitle("");
      setUploadDescription("");
      refetchMedia();
    } catch (err: any) {
      // Error handled by useMedia hook
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      await MediaService.deleteMedia(id);
      refetchMedia();
    } catch (err: any) {
      // Error handled by useMedia hook
      console.error(err);
    }
  };

  const handleCopyUrl = async (url: string, id: string) => {
    const success = await MediaService.copyToClipboard(url);
    if (success) {
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error} />

      {/* Action Bar */}
      <div className="space-y-4">
        <MediaActionBar
          onUploadClick={() => setShowUploadModal(true)}
          onGenerateImageClick={() => setShowGenerateImageModal(true)}
          onGenerateAudioClick={() => setShowGenerateAudioModal(true)}
          onRecordVideoClick={() => setShowRecordVideoModal(true)}
          onRecordAudioClick={() => setShowRecordAudioModal(true)}
        />

        <MediaFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Media Grid */}
      <MediaGrid
        media={media}
        loading={loading}
        onDelete={handleDelete}
        onCopyUrl={handleCopyUrl}
        copySuccess={copySuccess}
      />

      {/* Pagination */}
      <MediaPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

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

      {/* Record Audio Modal */}
      {showRecordAudioModal && (
        <RecordAudioModal
          onClose={() => setShowRecordAudioModal(false)}
          onUpload={handleUploadRecordedAudio}
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
