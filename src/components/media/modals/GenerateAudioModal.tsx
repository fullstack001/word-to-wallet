import React from "react";

interface GenerateAudioModalProps {
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
  setVoice: (v: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer") => void;
  model: "tts-1" | "tts-1-hd";
  setModel: (m: "tts-1" | "tts-1-hd") => void;
}

export default function GenerateAudioModal({
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
}: GenerateAudioModalProps) {
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
                onChange={(e) => setModel(e.target.value as "tts-1" | "tts-1-hd")}
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

