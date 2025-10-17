"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  BookOpen,
  Megaphone,
  GraduationCap,
  Gavel,
  Truck,
  DollarSign,
  Target,
  Video,
  Bot,
} from "lucide-react";
import { OpenAIService } from "@/services/openaiService";
import VideoTutorialGenerator from "./VideoTutorialGenerator";
import CustomGPTInterface from "./CustomGPTInterface";

interface AIPromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
  currentInstructions?: string;
  chapterTitle?: string;
  chapterDescription?: string;
}

type ContentType =
  | "promotional"
  | "educational"
  | "tutorial"
  | "auction"
  | "delivery"
  | "sales"
  | "marketing";

const AIPromptGenerator: React.FC<AIPromptGeneratorProps> = ({
  onPromptGenerated,
  currentInstructions = "",
  chapterTitle = "",
  chapterDescription = "",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [contentType, setContentType] = useState<ContentType>("educational");
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const [showCustomGPT, setShowCustomGPT] = useState(false);

  const generatePrompt = async () => {
    setIsGenerating(true);
    setError("");
    setGeneratedPrompt("");
    setValidation(null);

    try {
      const prompt = await OpenAIService.generateStrictNativeBlocksPrompt(
        chapterTitle,
        chapterDescription,
        currentInstructions,
        contentType
      );

      setGeneratedPrompt(prompt);

      // Validate the generated prompt
      const validationResult = OpenAIService.validateStrictNativeBlocks(prompt);
      setValidation(validationResult);
    } catch (err) {
      setError(
        "Failed to generate prompt. Please check your OpenAI API configuration and try again."
      );
      console.error("Prompt generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const usePrompt = () => {
    onPromptGenerated(generatedPrompt);
    setGeneratedPrompt("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI Prompt Generator
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={generatePrompt}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? "Generating..." : "Generate Prompt"}</span>
          </button>
          <button
            onClick={() => setShowCustomGPT(!showCustomGPT)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Bot className="w-4 h-4" />
            <span>{showCustomGPT ? "Hide GPT Chat" : "GPT Chat"}</span>
          </button>
          <button
            onClick={() => setShowVideoGenerator(!showVideoGenerator)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Video className="w-4 h-4" />
            <span>
              {showVideoGenerator ? "Hide Video Tools" : "Video Tools"}
            </span>
          </button>
        </div>
      </div>

      {/* Content Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Content Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setContentType("educational")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              contentType === "educational"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Educational</span>
          </button>
          <button
            onClick={() => setContentType("promotional")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              contentType === "promotional"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Promotional</span>
          </button>
          <button
            onClick={() => setContentType("tutorial")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              contentType === "tutorial"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Tutorial</span>
          </button>
          <button
            onClick={() => setContentType("auction")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              contentType === "auction"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>Auction</span>
          </button>
          <button
            onClick={() => setContentType("delivery")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              contentType === "delivery"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivery</span>
          </button>
          <button
            onClick={() => setContentType("sales")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              contentType === "sales"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Sales</span>
          </button>
          <button
            onClick={() => setContentType("marketing")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              contentType === "marketing"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Marketing</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      {generatedPrompt && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Generated Strict Native Blocks Prompt:
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={usePrompt}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Use This Prompt
              </button>
            </div>
          </div>

          <div className="codebox">
            <textarea
              className="codearea"
              readOnly
              value={generatedPrompt}
              rows={Math.min(generatedPrompt.split("\n").length, 15)}
              style={{
                width: "100%",
                minHeight: "200px",
                resize: "vertical",
                fontFamily: "monospace",
                fontSize: "13px",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "#f9fafb",
                color: "#374151",
              }}
            />
          </div>

          {/* Validation Results */}
          {validation && (
            <div className="space-y-2">
              {/* {validation.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <h5 className="text-sm font-medium text-red-800 mb-2">
                    Validation Errors:
                  </h5>
                  <ul className="text-xs text-red-700 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )} */}

              {validation.warnings.length > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">
                    Warnings:
                  </h5>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.isValid && validation.errors.length === 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="text-xs text-green-700 space-y-1">
                    <p>✅ All tags are closed</p>
                    <p>✅ No disallowed tags are used</p>
                    <p>✅ Void elements are self-closed</p>
                    <p>✅ Heading structure is logical</p>
                    <p>✅ Ampersands are escaped correctly</p>
                    <p>✅ ASCII-compliant content</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
        <p className="font-medium mb-1">💡 EPUB Prompt Architect Features:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Generates EPUB3 recipes and storyboarded tutorials</li>
          <li>Strict Native Blocks format with ASCII compliance</li>
          <li>WordToWallet platform integration templates</li>
          <li>Real-time validation and EPUB3 compatibility checks</li>
          <li>
            Supports promotional, educational, and platform-specific content
          </li>
          <li>Links to open-source video tools for visual walkthroughs</li>
        </ul>
      </div>

      {/* Custom GPT Interface */}
      {showCustomGPT && (
        <div className="border-t pt-4">
          <CustomGPTInterface
            chapterTitle={chapterTitle}
            chapterDescription={chapterDescription}
            onPromptGenerated={onPromptGenerated}
          />
        </div>
      )}

      {/* Video Tutorial Generator */}
      {showVideoGenerator && (
        <div className="border-t pt-4">
          <VideoTutorialGenerator
            chapterTitle={chapterTitle}
            chapterDescription={chapterDescription}
            contentType={contentType}
          />
        </div>
      )}
    </div>
  );
};

export default AIPromptGenerator;
