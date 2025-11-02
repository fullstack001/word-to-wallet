import React from "react";
import {
  DocumentArrowUpIcon,
  SparklesIcon,
  FilmIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";

interface MediaActionBarProps {
  onUploadClick: () => void;
  onGenerateImageClick: () => void;
  onGenerateAudioClick: () => void;
  onRecordVideoClick: () => void;
  onRecordAudioClick: () => void;
}

export default function MediaActionBar({
  onUploadClick,
  onGenerateImageClick,
  onGenerateAudioClick,
  onRecordVideoClick,
  onRecordAudioClick,
}: MediaActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <DocumentArrowUpIcon className="w-5 h-5" />
        Upload Media
      </button>
      <button
        onClick={onGenerateImageClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <SparklesIcon className="w-5 h-5" />
        Generate Image
      </button>
      <button
        onClick={onGenerateAudioClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <SparklesIcon className="w-5 h-5" />
        Generate Audio
      </button>
      <button
        onClick={onRecordVideoClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
      >
        <FilmIcon className="w-5 h-5" />
        Record Video
      </button>
      <button
        onClick={onRecordAudioClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <MusicalNoteIcon className="w-5 h-5" />
        Record Audio
      </button>
    </div>
  );
}

