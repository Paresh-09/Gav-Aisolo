import { google } from 'googleapis';
import { getAllKeys, getNestedValue } from './getAllKeys';
import { parseCSV } from './parseCSV';
// Function to get Google Sheets authentication
export async function getGoogleSheetAuth() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    return new google.auth.GoogleAuth({
        credentials: {
            private_key: privateKey,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
        },
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive.file"
        ],
    });
}

// Function to create a Google Spreadsheet
export async function createSpreadSheet<T>(title: string, data: T[]) {
    try {
        if(!Array.isArray(data) || data.length === 0){
            throw new Error('Data must be an array and not empty');
        }

        const headers = getAllKeys(data[0]);

        const auth = await getGoogleSheetAuth();
        const sheets = google.sheets({version: 'v4', auth});
        const drive = google.drive({version: 'v3', auth});

        // Create the spreadsheet
        const spreadsheet = await sheets.spreadsheets.create({
            requestBody: {
                properties: {
                    title
                }
            }
        });

        const spreadsheetId = spreadsheet.data.spreadsheetId;

        if(!spreadsheetId){
            throw new Error("Failed to create spreadsheet");
        }

        // Set public access for the sheet
        await drive.permissions.create({
            fileId: spreadsheetId,
            requestBody: {
                role: 'writer',
                type: 'anyone'
            }
        });

        // Format data for Google Sheets
        const rows = data.map(item => headers.map(header => {
            const value = getNestedValue(item, header);
            // Handle different value types
            if(value === null || value === undefined) return '';
            if(value instanceof Date) return value.toISOString();
            if(typeof value === 'object') return JSON.stringify(value);
            return value.toString();
        }));

        // Write the data to the sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'A1', // Start from the first cell
            valueInputOption: 'RAW',
            requestBody: {
                values: [headers, ...rows] // First row is headers, then data
            }
        });

        return spreadsheetId;
        
    } catch (error) {
        console.error('Error in createSpreadSheet:', error);
        throw error;
    }
}

// Function to update an existing Google Spreadsheet
export async function updateSpreadSheet(spreadsheetId: string, data: any[]) {
    try {
        const auth = await getGoogleSheetAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        // Format data for Google Sheets
        const headers = getAllKeys(data[0]);
        const rows = data.map(item => headers.map(header => {
            const value = getNestedValue(item, header);
            return value === null || value === undefined ? '' : value.toString();
        }));

        // Write the data to the sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'A1', // Start from the first cell
            valueInputOption: 'RAW',
            requestBody: {
                values: [headers, ...rows] // First row is headers, then data
            }
        });
    } catch (error) {
        console.error('Error updating spreadsheet:', error);
        throw error;
    }
}

