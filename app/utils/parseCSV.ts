// Function to parse CSV data into an array of objects
export function parseCSV(csvData: string) {
    const rows = csvData.split('\n').filter(row => row.trim() !== '');
    const headers = rows.shift()?.split(';') || [];

    return rows.map(row => {
        const values = row.split(';');
        return headers.reduce((acc, header, index) => {
            acc[header] = values[index];
            return acc;
        }, {} as Record<string, string>);
    });
}

