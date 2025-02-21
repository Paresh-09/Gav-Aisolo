"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

interface ApiResponse {
  success: boolean;
  spreadsheetUrl?: string;
  error?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedReport, setSelectedReport] = useState<string>("benchmarking");

  const handleGenerateSheet = async () => {
    console.log(selectedReport)
    if (!selectedReport) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call the respective API endpoint based on the selected report
      const response = await axios.get(`/api/${selectedReport}`);
      const result = response.data;

      if (!result) {
        throw new Error(result.error || "Failed to generate spreadsheet");
      }

      setData({ success: true, spreadsheetUrl: result.spreadsheetUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Google Sheets Report Generator</h1>

        {/* Report Selection */}
        <div className="mb-6">
          <label htmlFor="reportSelect" className="block text-lg font-medium text-gray-700">
            Select Report Type:
          </label>
          <select
            id="reportSelect"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="benchmarking">Benchmarking Report</option>
            <option value="kw-gap/missing">KW Gap Missing</option>
            <option value="kw-gap/untapped">KW Gap Untapped</option>
            <option value="kw-gap/unique">KW Gap Unique</option>
            <option value="kw-gap/all">KW Gap All</option>
            <option value="backlink-gap/best">Backlink Gap Best</option>
            <option value="backlink-gap/weak">Backlink Gap Weak</option>
            <option value="backlink-gap/strong">Backlink Gap Strong</option>
            <option value="backlink-gap/unique">Backlink Gap Unique</option>
            <option value="backlink-gap/shared">Backlink Gap Shared</option>
            <option value="backlink-gap/all">Backlink Gap All</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleGenerateSheet}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200 w-full"
          >
            {loading ? "Generating Sheet..." : "Generate Report"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Success Message & Sheet Link */}
        {data?.spreadsheetUrl && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 mb-2">Spreadsheet created successfully!</p>
            <Link
              href={data.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-medium inline-flex items-center"
            >
              Open Spreadsheet <span className="ml-1">→</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
