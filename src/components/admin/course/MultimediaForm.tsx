"use client";
import { MediaFile } from "@/utils/apiUtils";
import MultimediaUpload from "../MultimediaUpload";

interface MultimediaFormProps {
  multimediaContent: {
    audio: MediaFile[];
    video: MediaFile[];
  };
  onAudioChange: (files: MediaFile[]) => void;
  onVideoChange: (files: MediaFile[]) => void;
  uploadProgress?: {
    isUploading: boolean;
    audio: {
      [key: string]: {
        progress: number;
        status: "pending" | "uploading" | "completed" | "error";
        error?: string;
      };
    };
    video: {
      [key: string]: {
        progress: number;
        status: "pending" | "uploading" | "completed" | "error";
        error?: string;
      };
    };
  };
  onUpdateProgress?: (
    type: "audio" | "video",
    fileId: string,
    progress: number,
    status: "pending" | "uploading" | "completed" | "error",
    error?: string
  ) => void;
}

export default function MultimediaForm({
  multimediaContent,
  onAudioChange,
  onVideoChange,
  uploadProgress,
  onUpdateProgress,
}: MultimediaFormProps) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
        Multimedia Content
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MultimediaUpload
          type="audio"
          files={multimediaContent.audio}
          onFilesChange={onAudioChange}
          maxFiles={10}
          uploadProgress={uploadProgress?.audio}
          onUpdateProgress={(fileId, progress, status, error) =>
            onUpdateProgress?.("audio", fileId, progress, status, error)
          }
        />

        <MultimediaUpload
          type="video"
          files={multimediaContent.video}
          onFilesChange={onVideoChange}
          maxFiles={5}
          uploadProgress={uploadProgress?.video}
          onUpdateProgress={(fileId, progress, status, error) =>
            onUpdateProgress?.("video", fileId, progress, status, error)
          }
        />
      </div>
    </div>
  );
}
