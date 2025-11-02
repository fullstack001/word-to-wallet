import React, { useState, useEffect, useRef } from "react";
import { MusicalNoteIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface RecordAudioModalProps {
  onClose: () => void;
  onUpload: (audioBlob: Blob) => void;
  uploading: boolean;
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
}

export default function RecordAudioModal({
  onClose,
  onUpload,
  uploading,
  title,
  setTitle,
  description,
  setDescription,
}: RecordAudioModalProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Request microphone access
  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const startMicrophone = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        setStream(mediaStream);
      } catch (err: any) {
        setError(
          err.message ||
            "Failed to access microphone. Please check permissions."
        );
      }
    };

    startMicrophone();

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

  // Manage blob URL lifecycle
  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setBlobUrl(null);
    }
  }, [recordedBlob]);

  const startRecording = () => {
    if (!stream) {
      setError("Microphone stream not available");
      return;
    }

    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        console.log(
          "Audio recording stopped, blob created:",
          blob.size,
          "bytes"
        );
        setRecordedBlob(blob);
      };

      recorder.start(1000); // Request data every second
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
    // Stop microphone stream
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
        <h2 className="text-xl font-bold mb-4">Record Audio</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Audio Preview */}
        <div className="mb-4 relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          {recordedBlob && blobUrl ? (
            <div className="w-full p-8">
              <div className="bg-indigo-600 text-white rounded-lg p-8 text-center">
                <MusicalNoteIcon className="w-24 h-24 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-4">Audio Recorded</p>
                <audio
                  ref={audioRef}
                  src={blobUrl}
                  controls
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <div
                className={`w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  recording ? "bg-red-600 animate-pulse" : "bg-gray-400"
                }`}
              >
                <MusicalNoteIcon className="w-16 h-16 text-white" />
              </div>
              {recording && (
                <div className="flex items-center gap-2 justify-center text-red-600 font-semibold">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span>{formatTime(recordingTime)}</span>
                </div>
              )}
              {!recording && (
                <p className="text-gray-600">
                  Click "Start Recording" to begin
                </p>
              )}
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
                <MusicalNoteIcon className="w-5 h-5" />
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
                placeholder="Enter audio title (optional)"
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
                placeholder="Enter audio description (optional)"
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
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Audio"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
