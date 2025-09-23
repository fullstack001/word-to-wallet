"use client";

import React, { useState } from "react";

export default function ApiTest() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApiEndpoints = async () => {
    setLoading(true);
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const results: any = {
      apiUrl: API_BASE_URL,
      timestamp: new Date().toISOString(),
      tests: {},
    };

    // Test subjects endpoint
    try {
      console.log("Testing subjects endpoint...");
      const subjectsResponse = await fetch(`${API_BASE_URL}/subjects/active`);
      results.tests.subjects = {
        status: subjectsResponse.status,
        ok: subjectsResponse.ok,
        data: subjectsResponse.ok ? await subjectsResponse.json() : null,
      };
    } catch (error) {
      results.tests.subjects = {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Test courses endpoint
    try {
      console.log("Testing courses endpoint...");
      const coursesResponse = await fetch(`${API_BASE_URL}/courses/published`);
      results.tests.courses = {
        status: coursesResponse.status,
        ok: coursesResponse.ok,
        data: coursesResponse.ok ? await coursesResponse.json() : null,
      };
    } catch (error) {
      results.tests.courses = {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    setResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        API Endpoint Test
      </h3>

      <button
        onClick={testApiEndpoints}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Testing..." : "Test API Endpoints"}
      </button>

      {results && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Results:</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
