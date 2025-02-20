import { NextResponse } from 'next/server';
import { createSpreadSheet } from '../../utils/googleSheets'; 
import { parseCSV } from '../../utils/parseCSV';

export async function POST(req: Request) {
    try {
        // Parse incoming CSV data from the request body
        const { csvData } = await req.json();

        // Parse the CSV data into a 2D array
        const parsedData = parseCSV(csvData);

        // Call createSpreadSheet to create the Google Sheet
        const spreadsheetId = await createSpreadSheet('CSV Data Sheet', parsedData);

        // Construct the Google Sheets URL
        const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

        // Return the URL of the created sheet
        return NextResponse.json({ success: true, spreadsheetUrl });
    } catch (error:any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
