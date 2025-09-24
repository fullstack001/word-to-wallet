"use client";
import React, { useState } from "react";
import {
  translateHtml,
  translateText,
  detectLanguage,
  getSupportedLanguages,
} from "@/utils/translationApi";

const TranslationTest: React.FC = () => {
  const [testText, setTestText] = useState(
    "Hello, this is a test message for translation."
  );
  const [testHtml, setTestHtml] = useState(`
    <div class="content">
      <h1>Welcome to our course</h1>
      <p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
      </ul>
    </div>
  `);
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testTranslation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🧪 Testing Translation API...");

      // Test 1: Get supported languages
      console.log("1. Testing get supported languages...");
      const languagesResponse = await getSupportedLanguages();
      console.log(
        "✅ Supported languages:",
        languagesResponse.data.total,
        "languages"
      );

      // Test 2: Detect language
      console.log("2. Testing language detection...");
      const detectResponse = await detectLanguage({ text: testText });
      console.log(
        "✅ Detected language:",
        detectResponse.data.detectedLanguage
      );

      // Test 3: Translate text
      console.log("3. Testing text translation...");
      const translateResponse = await translateText({
        text: testText,
        targetLanguage: targetLanguage,
      });
      console.log("✅ Text translated successfully");

      // Test 4: Translate HTML content
      console.log("4. Testing HTML translation...");
      const translateHtmlResponse = await translateHtml({
        htmlContent: testHtml,
        targetLanguage: targetLanguage,
      });
      console.log("✅ HTML translated successfully");

      setResult({
        languages: languagesResponse.data,
        detectedLanguage: detectResponse.data.detectedLanguage,
        textTranslation: translateResponse.data,
        htmlTranslation: translateHtmlResponse.data,
      });

      console.log("🎉 All tests completed successfully!");
    } catch (error: any) {
      console.error("❌ Test failed:", error);
      setError(error.message || "Translation test failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Translation API Test</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Text:
          </label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test HTML:
          </label>
          <textarea
            value={testHtml}
            onChange={(e) => setTestHtml(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Language:
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <button
          onClick={testTranslation}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Translation API"}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>Success!</strong> All translation tests passed.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Text Translation</h3>
                <p>
                  <strong>Original:</strong>{" "}
                  {result.textTranslation.originalText}
                </p>
                <p>
                  <strong>Translated:</strong>{" "}
                  {result.textTranslation.translatedText}
                </p>
                <p>
                  <strong>Target Language:</strong>{" "}
                  {result.textTranslation.targetLanguage}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">HTML Translation</h3>
                <p>
                  <strong>Original HTML Length:</strong>{" "}
                  {result.htmlTranslation.originalHtml?.length} characters
                </p>
                <p>
                  <strong>Translated HTML Length:</strong>{" "}
                  {result.htmlTranslation.translatedHtml?.length} characters
                </p>
                <p>
                  <strong>Target Language:</strong>{" "}
                  {result.htmlTranslation.targetLanguage}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Language Detection</h3>
              <p>
                <strong>Detected Language:</strong> {result.detectedLanguage}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Supported Languages</h3>
              <p>
                <strong>Total Languages:</strong> {result.languages.total}
              </p>
              <div className="mt-2">
                <strong>Sample Languages:</strong>
                <ul className="list-disc list-inside mt-1">
                  {result.languages.languages.slice(0, 10).map((lang: any) => (
                    <li key={lang.code}>
                      {lang.name} ({lang.code})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationTest;
