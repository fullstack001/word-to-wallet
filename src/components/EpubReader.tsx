"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ReactReader } from "react-reader";
import { debounce } from "lodash";
import { languageData } from "@/data/languageData";
import { translateHtml } from "@/utils/translationApi";

interface MultimediaItem {
  _id: string;
  title: string;
  fileUrl: string;
}

interface YouTubeItem {
  _id: string;
  title: string;
  link: string;
}

interface BookContent {
  content: string;
}

interface EpubReaderProps {
  epubUrl: string;
  title?: string;
  author?: string;
  audioItems?: MultimediaItem[];
  videoItems?: MultimediaItem[];
  youtubeItems?: YouTubeItem[];
  bookContents?: BookContent[];
  bookType?: string;
  onBack?: () => void;
}

const EpubReader: React.FC<EpubReaderProps> = ({
  epubUrl,
  title = "EPUB Reader",
  author = "",
  audioItems = [],
  videoItems = [],
  youtubeItems = [],
  bookContents = [],
  bookType = "",
  onBack,
}) => {
  const router = useRouter();
  const [location, setLocation] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Translation states
  const [translatedText, setTranslatedText] = useState("");
  const [language, setLanguage] = useState("en");
  const [originalContent, setOriginalContent] = useState("");
  const [translating, setTranslating] = useState(false);

  const renditionRef = useRef<any>(null);

  const tabs = [
    { id: 0, label: "Ebook" },
    { id: 1, label: "Audio" },
    { id: 2, label: "Video" },
    { id: 3, label: "YouTube" },
  ];

  useEffect(() => {
    const resizeObserverError = (event: ErrorEvent) => {
      if (
        event.message ===
        "ResizeObserver loop completed with undelivered notifications."
      ) {
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener("error", resizeObserverError);
    return () => {
      window.removeEventListener("error", resizeObserverError);
    };

    const handleResize = debounce(() => {
      if (renditionRef.current) {
        requestAnimationFrame(() => {
          try {
            renditionRef.current.resize();
          } catch (error) {
            console.warn("Resize error caught:", error);
          }
        });
      }
    }, 200);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set initial content when bookContents are available
  useEffect(() => {
    if (bookContents.length > 0 && !originalContent) {
      // Set the first chapter content as initial content
      setOriginalContent(bookContents[0]?.content || "");
    }
  }, [bookContents, originalContent]);

  const injectCustomStyles = () => {
    if (renditionRef.current) {
      renditionRef.current.themes.default({
        iframe: {
          width: "100% !important",
          height: "auto !important",
          "min-height": "300px !important",
        },
      });
    }
  };

  const translateContent = async (content: string) => {
    console.log("Translating content:", content);
    setTranslating(true);
    try {
      const response = await translateHtml({
        htmlContent: content,
        targetLanguage: language,
      });

      let translatedHtml =
        response.data.translatedHtml || "Translation failed. Please try again.";

      // Remove markdown code block wrappers if present
      translatedHtml = translatedHtml
        .replace(/^```html\s*/g, "")
        .replace(/^```\s*/g, "")
        .replace(/\s*```$/g, "")
        .replace(/^`/g, "")
        .replace(/`$/g, "")
        .trim();

      setTranslatedText(translatedHtml);
    } catch (error: any) {
      console.error("Error translating content:", error);

      // Handle specific error types
      if (error.response?.status === 408) {
        setTranslatedText(
          "Translation timed out. The content might be too large. Please try with smaller content."
        );
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("too large")
      ) {
        setTranslatedText(
          "Content too large. Please reduce the content size and try again."
        );
      } else if (error.response?.status === 429) {
        setTranslatedText(
          "Translation service is busy. Please try again in a few moments."
        );
      } else {
        setTranslatedText("Translation failed. Please try again.");
      }
    } finally {
      setTranslating(false);
    }
  };

  const getCurrentPageContent = async () => {
    if (renditionRef.current && bookContents.length > 0) {
      try {
        const currentLocation = renditionRef.current.location?.start?.cfi;
        if (currentLocation) {
          const range = await renditionRef.current.getRange(currentLocation);
          if (range && range.commonAncestorContainer) {
            const uri = range.commonAncestorContainer.baseURI;
            const match = uri.match(/chapter(\d+)\.xhtml/);
            if (match) {
              const pageNumber = parseInt(match[1], 10);
              const pageContent = bookContents[pageNumber];
              if (pageContent) {
                return pageContent.content;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error getting current page content:", error);
      }
    }
    return null;
  };

  const handleTranslate = async () => {
    setTranslatedText("Please be patient. Translations take time.");
    console.log("Original content:", originalContent);

    let contentToTranslate = originalContent;

    // If no original content is set, try to get it from the current location
    if (!contentToTranslate) {
      const currentContent = await getCurrentPageContent();
      if (currentContent) {
        contentToTranslate = currentContent;
        setOriginalContent(currentContent);
      }
    }

    if (contentToTranslate) {
      translateContent(contentToTranslate);
    } else {
      setTranslatedText(
        "No content available to translate. Please navigate through the book first or use the 'Reset Content' button."
      );
    }
  };

  const handleLocationChanged = useCallback(
    debounce(async (epubcfi: string) => {
      setLocation(epubcfi);
      if (renditionRef.current && bookContents.length > 0) {
        try {
          const range = await renditionRef.current.getRange(epubcfi);
          if (!range || !range.commonAncestorContainer) return;

          const uri = range.commonAncestorContainer.baseURI;
          const match = uri.match(/chapter(\d+)\.xhtml/);
          if (!match) return;

          const pageNumber = parseInt(match[1], 10);
          const pageContent = bookContents[pageNumber];
          if (pageContent) {
            setOriginalContent(pageContent.content);
          }
        } catch (error) {
          console.error("Error fetching content for current location:", error);
        }
      }
    }, 500),
    [bookContents]
  );

  const returnBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (!epubUrl) return <p>Loading ebook...</p>;

  return (
    <div className="p-8 bg-gray-800 min-h-screen text-white">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Content Viewer</h2>
        <div className="mb-4">
          <h2 className="text-xl mb-2">Title: {title}</h2>
          <h2 className="mb-2">Author: {author}</h2>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 py-3 px-6 rounded-lg transition-all duration-300 font-medium ${
                selectedTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {/* Ebook Tab */}
        {selectedTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="lg:col-span-1">
              <div
                style={{ height: "600px", border: "1px solid #ddd" }}
                className="rounded-lg mb-4"
              >
                <ReactReader
                  url={epubUrl}
                  location={location}
                  locationChanged={handleLocationChanged}
                  getRendition={(rendition) => {
                    if (rendition) {
                      renditionRef.current = rendition;
                      injectCustomStyles();
                    }
                  }}
                  epubOptions={{
                    allowPopups: true,
                    allowScriptedContent: true,
                  }}
                  epubInitOptions={{ openAs: "epub" }}
                  showToc={true}
                />
              </div>

              {epubUrl && (
                <a
                  href={epubUrl}
                  download
                  className="text-blue-300 text-sm underline mt-2 inline-block"
                >
                  Download EPUB
                </a>
              )}
            </div>

            {/* Translation Panel */}
            {bookType === "created" && (
              <div className="lg:col-span-1">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Translation</h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <select
                      className="bg-gray-600 text-white py-2 px-4 rounded-lg"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {languageData.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleTranslate}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Translate
                    </button>
                    <button
                      onClick={() => {
                        if (bookContents.length > 0) {
                          setOriginalContent(bookContents[0]?.content || "");
                          setTranslatedText("");
                        }
                      }}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Reset Content
                    </button>
                  </div>
                  <div className="text-sm text-gray-300 mb-4">
                    Content Status:{" "}
                    {originalContent
                      ? `Loaded (${originalContent.length} chars)`
                      : "No content loaded"}
                    {originalContent && originalContent.length > 30000 && (
                      <span className="text-yellow-400 ml-2 block mt-1">
                        ⚠️ Large content - translation may take longer
                      </span>
                    )}
                    {originalContent && originalContent.length > 50000 && (
                      <span className="text-red-400 ml-2 block mt-1">
                        ❌ Content too large for translation
                      </span>
                    )}
                  </div>
                  <div className="bg-gray-600 p-4 rounded-lg min-h-[300px] max-h-[500px] overflow-y-auto">
                    {translating && (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                        <span>Translating...</span>
                      </div>
                    )}

                    {translatedText && !translating && (
                      <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: translatedText,
                        }}
                      />
                    )}

                    {!translatedText && !translating && (
                      <div className="text-gray-400 text-center">
                        No translation available. Click "Translate" to translate
                        the content.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audio Tab */}
        {selectedTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audioItems.length > 0 ? (
              audioItems.map((item) => (
                <div key={item._id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-center">
                    {item.title}
                  </h3>
                  <audio className="w-full rounded-lg" controls>
                    <source src={item.fileUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <p className="text-lg">No audio content available</p>
              </div>
            )}
          </div>
        )}

        {/* Video Tab */}
        {selectedTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoItems.length > 0 ? (
              videoItems.map((item) => (
                <div key={item._id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-center">
                    {item.title}
                  </h3>
                  <video className="w-full rounded-lg shadow-lg" controls>
                    <source src={item.fileUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg">No video content available</p>
              </div>
            )}
          </div>
        )}

        {/* YouTube Tab */}
        {selectedTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {youtubeItems.length > 0 ? (
              youtubeItems.map((item) => (
                <div key={item._id} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-center">
                    {item.title}
                  </h3>
                  <iframe
                    className="w-full h-64 rounded-lg"
                    src={`${item.link}?autoplay=0`}
                    title="YouTube video player"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <p className="text-lg">No YouTube content available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EpubReader;
