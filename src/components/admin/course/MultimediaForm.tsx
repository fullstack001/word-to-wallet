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
}

export default function MultimediaForm({
  multimediaContent,
  onAudioChange,
  onVideoChange,
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
        />

        <MultimediaUpload
          type="video"
          files={multimediaContent.video}
          onFilesChange={onVideoChange}
          maxFiles={5}
        />
      </div>
    </div>
  );
}
