"use client";

import React, { useState } from "react";
import {
  Video,
  Play,
  FileText,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { OpenAIService } from "@/services/openaiService";

interface VideoTutorialGeneratorProps {
  chapterTitle?: string;
  chapterDescription?: string;
  contentType?: string;
}

const VideoTutorialGenerator: React.FC<VideoTutorialGeneratorProps> = ({
  chapterTitle = "",
  chapterDescription = "",
  contentType = "educational",
}) => {
  const [generatedScript, setGeneratedScript] = useState("");
  const [storyboard, setStoryboard] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"script" | "storyboard">("script");

  const generateVideoContent = async () => {
    try {
      // Generate script and storyboard using OpenAI
      const [script, storyboardContent] = await Promise.all([
        OpenAIService.generateVideoScript(
          chapterTitle,
          chapterDescription,
          contentType
        ),
        OpenAIService.generateVideoStoryboard(
          chapterTitle,
          chapterDescription,
          contentType
        ),
      ]);

      setGeneratedScript(script);
      setStoryboard(storyboardContent);
    } catch (error) {
      console.error("Error generating video content:", error);
      // Fallback to mock content
      const script = generateTutorialScript(
        chapterTitle,
        chapterDescription,
        contentType
      );
      const storyboardContent = generateStoryboard(
        chapterTitle,
        chapterDescription,
        contentType
      );

      setGeneratedScript(script);
      setStoryboard(storyboardContent);
    }
  };

  const generateTutorialScript = (
    title: string,
    description: string,
    type: string
  ): string => {
    return `# Video Tutorial Script: ${title}

## Introduction (0:00 - 0:30)
"Welcome to this tutorial on ${title}. ${description}"

## Main Content (0:30 - 4:00)
"Let's walk through the key concepts step by step..."

### Step 1: Overview
"First, let's understand what we're working with..."

### Step 2: Implementation
"Now, let's see how to implement this in practice..."

### Step 3: Best Practices
"Here are some important tips to remember..."

## Conclusion (4:00 - 4:30)
"That wraps up our tutorial on ${title}. Remember to..."

## Call to Action
"Ready to get started? Visit WordToWallet.com to begin your journey."

---
*Script Duration: ~4:30 minutes
*Recommended for: ${type} content
*Target Audience: WordToWallet users`;
  };

  const generateStoryboard = (
    title: string,
    description: string,
    type: string
  ): string => {
    return `# Storyboard: ${title}

## Scene 1: Introduction (0:00-0:30)
- **Visual**: WordToWallet logo animation
- **Text Overlay**: "${title}"
- **Narration**: "Welcome to this tutorial on ${title}"
- **Action**: Smooth transition to main content

## Scene 2: Problem Statement (0:30-1:00)
- **Visual**: Split screen showing before/after
- **Text Overlay**: Key benefits highlighted
- **Narration**: "${description}"
- **Action**: Zoom in on key features

## Scene 3: Step-by-Step Walkthrough (1:00-3:30)
- **Visual**: Screen recording of actual process
- **Text Overlay**: Step numbers and key points
- **Narration**: Detailed explanation of each step
- **Action**: Highlight important UI elements

## Scene 4: Results & Benefits (3:30-4:00)
- **Visual**: Success metrics and testimonials
- **Text Overlay**: Key achievements
- **Narration**: "Here's what you can achieve..."
- **Action**: Smooth transitions between results

## Scene 5: Call to Action (4:00-4:30)
- **Visual**: WordToWallet platform overview
- **Text Overlay**: "Get Started Today"
- **Narration**: "Ready to begin? Visit WordToWallet.com"
- **Action**: Fade to platform landing page

---
*Total Duration: 4:30 minutes
*Style: Professional, educational
*Format: 16:9 aspect ratio`;
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openSourceVideoTools = [
    {
      name: "Open-Sora",
      description: "Open-source text-to-video generation",
      url: "https://github.com/hpcaitech/Open-Sora",
      type: "Text-to-Video",
    },
    {
      name: "Text2Video-Zero",
      description: "Zero-shot text-to-video generation",
      url: "https://github.com/Picsart-AI-Research/Text2Video-Zero",
      type: "Text-to-Video",
    },
    {
      name: "ModelScope T2V",
      description: "Alibaba's text-to-video model",
      url: "https://modelscope.cn/models/damo/text-to-video-synthesis",
      type: "Text-to-Video",
    },
    {
      name: "RunwayML",
      description: "AI-powered video editing platform",
      url: "https://runwayml.com",
      type: "Video Editing",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Video className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Video Tutorial Generator
          </h3>
        </div>
        <button
          type="button"
          onClick={generateVideoContent}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Play className="w-4 h-4" />
          <span>Generate Video Content</span>
        </button>
      </div>

      {(generatedScript || storyboard) && (
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("script")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === "script"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Script</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("storyboard")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === "storyboard"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Storyboard</span>
            </button>
          </div>

          {/* Content Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                {activeTab === "script"
                  ? "Tutorial Script"
                  : "Video Storyboard"}
                :
              </h4>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    activeTab === "script" ? generatedScript : storyboard
                  )
                }
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <div className="codebox">
              <textarea
                className="codearea"
                readOnly
                value={activeTab === "script" ? generatedScript : storyboard}
                rows={Math.min(
                  (activeTab === "script" ? generatedScript : storyboard).split(
                    "\n"
                  ).length,
                  20
                )}
                style={{
                  width: "100%",
                  minHeight: "300px",
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
          </div>
        </div>
      )}

      {/* Open Source Video Tools */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">
          Open Source Video Tools
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {openSourceVideoTools.map((tool, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900">
                    {tool.name}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">
                    {tool.description}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {tool.type}
                  </span>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-purple-50 p-3 rounded-md">
        <p className="font-medium mb-1">🎬 Video Production Tips:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Use the generated script as a foundation for your voiceover</li>
          <li>Follow the storyboard for consistent visual flow</li>
          <li>Record in 1080p or higher for professional quality</li>
          <li>Keep each scene under 30 seconds for better engagement</li>
          <li>Add captions and text overlays for accessibility</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoTutorialGenerator;
