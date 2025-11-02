import React from "react";

interface GenerateImageModalProps {
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
}

export default function GenerateImageModal({
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
}: GenerateImageModalProps) {
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
                setSize(e.target.value as "1024x1024" | "1024x1792" | "1792x1024")
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

