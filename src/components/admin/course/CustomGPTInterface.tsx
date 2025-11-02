"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  BookOpen,
  Megaphone,
  GraduationCap,
  Gavel,
  Truck,
  DollarSign,
  Target,
  Video,
} from "lucide-react";
import { OpenAIService } from "@/services/openaiService";

// Client-only timestamp component to prevent hydration mismatch
const ClientOnlyTimestamp: React.FC<{ timestamp: Date }> = ({ timestamp }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <span className="text-xs text-gray-400">--:--:-- --</span>;
  }

  return (
    <span className="text-xs text-gray-400">
      {timestamp.toLocaleTimeString()}
    </span>
  );
};

// Component to render message content with codebox support
const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  // Check if content contains codebox HTML
  const codeboxRegex =
    /<div class="codebox"><textarea class="codearea" readonly>([\s\S]*?)<\/textarea><\/div>/g;
  const hasCodebox = codeboxRegex.test(content);

  if (!hasCodebox) {
    // Regular text content
    return (
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {content}
      </div>
    );
  }

  // Parse and render content with codeboxes
  const parts = content.split(codeboxRegex);
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      // Regular text content
      if (parts[i].trim()) {
        elements.push(
          <div
            key={i}
            className="whitespace-pre-wrap text-sm leading-relaxed mb-3"
          >
            {parts[i]}
          </div>
        );
      }
    } else if (i % 3 === 2) {
      // Code content (inside textarea)
      const codeContent = parts[i];
      elements.push(
        <div key={i} className="codebox mb-3">
          <textarea
            className="codearea"
            readOnly
            value={codeContent}
            rows={Math.min(codeContent.split("\n").length, 15)}
            style={{
              width: "100%",
              minHeight: "120px",
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
      );
    }
  }

  return <div>{elements}</div>;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  contentType?: string;
}

interface CustomGPTInterfaceProps {
  chapterTitle?: string;
  chapterDescription?: string;
  onPromptGenerated?: (prompt: string) => void;
}

const CustomGPTInterface: React.FC<CustomGPTInterfaceProps> = ({
  chapterTitle = "",
  chapterDescription = "",
  onPromptGenerated,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm the EPUB Prompt Architect. I help you create high-quality, structured prompts for EPUB3 content generation. What would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedPrompts = [
    "Create a Strict Native Blocks prompt for a product page",
    "Write a video tutorial script for an EPUB walkthrough",
    "Storyboard a tutorial for setting up a sales page",
    "Generate a prompt for a multi-section EPUB with raw HTML",
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate GPT response based on user input
      const response = await generateGPTResponse(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error while generating a response. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateGPTResponse = async (userInput: string): Promise<string> => {
    try {
      // Determine content type based on user input
      let contentType:
        | "promotional"
        | "educational"
        | "tutorial"
        | "auction"
        | "delivery"
        | "sales"
        | "marketing" = "educational";

      if (
        userInput.toLowerCase().includes("promotional") ||
        userInput.toLowerCase().includes("marketing")
      ) {
        contentType = "promotional";
      } else if (
        userInput.toLowerCase().includes("tutorial") ||
        userInput.toLowerCase().includes("guide")
      ) {
        contentType = "tutorial";
      } else if (
        userInput.toLowerCase().includes("auction") ||
        userInput.toLowerCase().includes("bidding")
      ) {
        contentType = "auction";
      } else if (
        userInput.toLowerCase().includes("delivery") ||
        userInput.toLowerCase().includes("shipping")
      ) {
        contentType = "delivery";
      } else if (
        userInput.toLowerCase().includes("sales") ||
        userInput.toLowerCase().includes("selling")
      ) {
        contentType = "sales";
      } else if (
        userInput.toLowerCase().includes("marketing") ||
        userInput.toLowerCase().includes("campaign")
      ) {
        contentType = "marketing";
      }

      // Build conversation history for context
      const conversationHistory = messages.slice(1, -1).map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Generate response using OpenAI custom GPT
      const response = await OpenAIService.generateCustomGPTResponse(
        userInput,
        conversationHistory,
        {
          chapterTitle,
          chapterDescription,
          contentType,
        }
      );

      // If the response contains a Strict Native Blocks prompt, extract it
      if (response.content.includes("CREATE SECTION") && onPromptGenerated) {
        const promptMatch = response.content.match(/```[\s\S]*?```/);
        if (promptMatch) {
          const prompt = promptMatch[0].replace(/```/g, "").trim();
          onPromptGenerated(prompt);
        }
      }

      return response.content;
    } catch (error) {
      console.error("Error generating GPT response:", error);

      // Fallback to mock response if OpenAI fails
      return `I apologize, but I'm currently unable to connect to the OpenAI service. This might be due to:

🔧 **Configuration Issues:**
- OpenAI API key not configured
- Network connectivity problems
- Service temporarily unavailable

📝 **What I can still help with:**
- General guidance on EPUB3 content creation
- Best practices for Strict Native Blocks
- Video production tips and resources
- WordToWallet platform features

Please check your OpenAI API configuration or try again later. In the meantime, I can provide general assistance with content creation strategies.`;
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              EPUB Prompt Architect
            </h3>
            <p className="text-sm text-gray-600">
              Generates EPUB3 recipes, storyboarded tutorials
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white/50 transition-colors"
            title="New conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[85%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-blue-500 ml-3"
                    : "bg-gradient-to-br from-blue-500 to-purple-600 mr-3"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 text-gray-900 border border-gray-200"
                }`}
              >
                <MessageContent content={message.content} />
                {message.role === "assistant" && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                    <ClientOnlyTimestamp timestamp={message.timestamp} />
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(message.content, message.id)
                      }
                      className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestedPrompt(prompt)}
                className="text-left p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 transition-all duration-200 hover:shadow-md hover:border-gray-300"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="leading-relaxed">{prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message EPUB Prompt Architect..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
              }}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          EPUB Prompt Architect can make mistakes. Consider checking important
          information.
        </div>
      </div>
    </div>
  );
};

export default CustomGPTInterface;
