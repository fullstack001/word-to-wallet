"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ReactReader } from "react-reader";
import { debounce } from "lodash";
import { languageData } from "@/data/languageData";

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
    { id: 0, label: "Audio" },
    { id: 1, label: "Video" },
    { id: 2, label: "YouTube" },
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
    setTranslating(true);
    try {
      const response = await axios.post("/api/translate/eBook", {
        text: content,
        targetLanguage: language,
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error("Error translating content:", error);
    } finally {
      setTranslating(false);
    }
  };

  const handleTranslate = () => {
    setTranslatedText("Please be patient. Translations take time.");
    if (originalContent) {
      translateContent(originalContent);
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
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4 mt-2">Ebook Viewer</h2>
        </div>
        <div>
          <button
            onClick={returnBack}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <h2 className="text-xl mb-2">Title: {title}</h2>
          <h2 className="mb-2">Author: {author}</h2>
        </div>
        <div className="custom-tablist flex justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-all duration-300 ${
                selectedTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-3">
          <div
            style={{ height: "600px", border: "1px solid #ddd" }}
            className="rounded-lg"
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

          {bookType === "created" && (
            <div className="mt-4">
              <select
                className="bg-gray-700 text-white py-2 px-4 rounded-lg mb-2"
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
                className="bg-blue-500 text-white py-2 px-4 ml-2 rounded-lg"
              >
                Translate
              </button>
              <div className="flex mt-4 bg-gray-700 p-4 rounded-lg">
                {translating && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                )}
                <div
                  className="items-center"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                  dangerouslySetInnerHTML={{
                    __html: translatedText || "No translation available.",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          {selectedTab === 0 &&
            (audioItems.length > 0
              ? audioItems.map((item) => (
                  <div key={item._id}>
                    <audio
                      className="w-full mb-2 rounded-lg shadow-lg"
                      controls
                    >
                      <source src={item.fileUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="mt-1 text-center mb-2">{item.title}</div>
                  </div>
                ))
              : "Audio doesn't exist")}
          {selectedTab === 1 &&
            (videoItems.length > 0
              ? videoItems.map((item) => (
                  <div key={item._id}>
                    <video
                      className="w-full mb-2 rounded-lg shadow-lg"
                      controls
                    >
                      <source src={item.fileUrl} type="video/mp4" />
                    </video>
                    <div className="mt-1 text-center mb-2">{item.title}</div>
                  </div>
                ))
              : "Video doesn't exist")}
          {selectedTab === 2 &&
            (youtubeItems.length > 0
              ? youtubeItems.map((item) => (
                  <div key={item._id}>
                    <iframe
                      className="w-full h-64 mb-2"
                      src={`${item.link}?autoplay=0`}
                      title="YouTube video player"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="mt-1 text-center mb-2">{item.title}</div>
                  </div>
                ))
              : "YouTube video doesn't exist")}
        </div>
      </div>
    </div>
  );
};

export default EpubReader;
