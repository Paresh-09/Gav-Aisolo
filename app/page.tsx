'use client';
import { useState } from 'react';
import Link from 'next/link';

interface ApiResponse {
    success: boolean;
    data: any;
    spreadsheetUrl?: string;
    error?: string;
}

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ApiResponse | null>(null);

    const handleGenerateSheet = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch the CSV data from /api/test1 (or your CSV source)
            const response = await fetch('/api/csv');
            const csvData = await response.text();

            console.log(csvData);
            if (!response.ok) {
                throw new Error('Failed to fetch CSV data');
            }

            // Call the server-side API to generate the Google Sheet
            const createSheetResponse = await fetch('/api/create-sheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ csvData })
            });

            const result = await createSheetResponse.json();

            if (!createSheetResponse.ok) {
                throw new Error(result.error || 'Failed to generate spreadsheet');
            }

            setData({
                success: true,
                spreadsheetUrl: result.spreadsheetUrl,
                data: result.data,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Jokes to Google Sheets
                </h1>

                {/* Action Button */}
                <div className="mb-8">
                    <button
                        onClick={handleGenerateSheet}
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg 
                                 hover:bg-blue-600 disabled:bg-blue-300 
                                 transition-colors duration-200"
                    >
                        {loading ? 'Generating Sheet...' : 'Generate New Sheet'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 
                                  rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {/* Success Message & Sheet Link */}
                {data?.spreadsheetUrl && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 
                                  rounded-lg">
                        <p className="text-green-700 mb-2">
                            Spreadsheet created successfully!
                        </p>
                        <Link
                            href={data.spreadsheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline font-medium 
                                     inline-flex items-center"
                        >
                            Open Spreadsheet
                            <span className="ml-1">→</span>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
