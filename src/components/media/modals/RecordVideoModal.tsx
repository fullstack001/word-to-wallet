import React, { useState, useEffect, useRef } from "react";
import { FilmIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface RecordVideoModalProps {
  onClose: () => void;
  onUpload: (videoBlob: Blob) => void;
  uploading: boolean;
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
}

export default function RecordVideoModal({
  onClose,
  onUpload,
  uploading,
  title,
  setTitle,
  description,
  setDescription,
}: RecordVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

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
        console.log("Recording stopped, blob created:", blob.size, "bytes");
        setRecordedBlob(blob);
        // Auto-play preview after a short delay to ensure blob URL is set
        setTimeout(() => {
          if (previewVideoRef.current) {
            previewVideoRef.current.play().catch((err) => {
              console.log("Autoplay prevented:", err);
            });
          }
        }, 100);
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
      // Stop camera stream when showing preview to save resources
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }
  };

  const handleUpload = () => {
    if (recordedBlob) {
      onUpload(recordedBlob);
    }
  };

  const handleRetake = async () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
    setMediaRecorder(null);

    // Restart camera for retake
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
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
    // Reset state (blob URL will be cleaned up by useEffect)
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
          {recordedBlob && blobUrl ? (
            <>
              <video
                ref={previewVideoRef}
                src={blobUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                Preview
              </div>
            </>
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
