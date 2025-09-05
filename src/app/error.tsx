"use client";
import { useEffect } from "react";
import { defaultLocale } from "@/i18n/config";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-8">
              We encountered an error while loading the application. Please try again.
            </p>
            <div className="space-y-4">
              <button
                onClick={reset}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
              <div>
                <a
                  href={`/${defaultLocale}`}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Go to home page
                </a>
              </div>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error details (development only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-4 rounded overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
} 