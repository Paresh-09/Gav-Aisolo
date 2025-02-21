// import { createSpreadSheet } from "@/app/utils/googleSheets";
// import { parseCSV } from "@/app/utils/parseCSV";
// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function GET(request: Request, { params }: { params: { slug: string } }) {
//   try {
//     const slug = (await params).slug;
//     const SEMRUSH_API_KEY = process.env.SEMRUSH_API_KEY;

//     if (!SEMRUSH_API_KEY) {
//       throw new Error("SEMrush API key is not configured");
//     }

//     let apiUrl = "";
//     let reportTitle = "";

//     // Base URL parameters
//     const baseParams = {
//       key: SEMRUSH_API_KEY,
//       database: "us",
//       display_limit: "10",
//       domains: "*|or|nike.com|*|or|adidas.com|*|or|reebok.com",
//     };

//     switch (slug) {
//       case "missing":
//         apiUrl = `https://api.semrush.com/?type=domain_domains&key=${baseParams.key}&database=${baseParams.database}&display_limit=${baseParams.display_limit}&domains=${encodeURIComponent(baseParams.domains)}&export_columns=Ph,P0,P1,P2,Co,Nq,Cp&display_filter=%2BP1%3C1%2BP2%3E0`;
//         reportTitle = "Missing Keywords Report";
//         break;
        
//       case "gap":
//         apiUrl = `https://api.semrush.com/?type=domain_domains&key=${baseParams.key}&database=${baseParams.database}&display_limit=${baseParams.display_limit}&domains=${encodeURIComponent(baseParams.domains)}&export_columns=Ph,P0,P1,P2,Co,Nq,Cp&display_filter=%2BP0%3E0%2BP1%3E0%2BP2%3E0`;
//         reportTitle = "Keyword Gap Analysis";
//         break;
        
//       case "untapped":
//         apiUrl = `https://api.semrush.com/?type=domain_domains&key=${baseParams.key}&database=${baseParams.database}&display_limit=${baseParams.display_limit}&domains=${encodeURIComponent(baseParams.domains)}&export_columns=Ph,P0,P1,P2,Co,Nq,Cp&display_filter=%2BP0%3C1%2BP1%3E0%2BP2%3E0`;
//         reportTitle = "Untapped Keywords Report";
//         break;

//       default:
//         return NextResponse.json({
//           success: false,
//           error: "Invalid report type. Available types: missing, gap, puntaped"
//         }, { status: 400 });
//     }

//     const response = await axios.get(apiUrl);
//     const parsedData = parseCSV(response.data);

//     if (!parsedData) {
//       throw new Error("Failed to parse SEMrush data");
//     }

//     const sheetId = await createSpreadSheet(reportTitle, parsedData);

//     return NextResponse.json({
//       success: true,
//       reportType: slug,
//       spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
//     });

//   } catch (error) {
//     console.error(`Error generating ${params.slug} report:`, error);
//     return NextResponse.json({
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error occurred"
//     }, { status: 500 });
//   }
// }




import { kwGapMockData } from "@/app/api/(semrush)/kw-gap/mock";
import { createSpreadSheet } from "@/app/utils/googleSheets";
import { parseCSV } from "@/app/utils/parseCSV";
import { NextResponse } from "next/server";




export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = (await params).slug;
    let reportTitle = "";

    // Check if the report type is valid
    if (!kwGapMockData[slug as keyof typeof kwGapMockData]) {
      return NextResponse.json({
        success: false,
        error: "Invalid report type. Available types: missing, gap, untapped"
      }, { status: 400 });
    }

    switch (slug) {
      case "missing":
        reportTitle = "Missing Keywords Report";
        break;
      case "gap":
        reportTitle = "Keyword Gap Analysis";
        break;
      case "untapped":
        reportTitle = "Untapped Keywords Report";
        break;
    }

    // Use mock data instead of API call
    const parsedData = parseCSV(kwGapMockData[slug as keyof typeof kwGapMockData]);

    if (!parsedData) {
      throw new Error("Failed to parse data");
    }

    const sheetId = await createSpreadSheet(reportTitle, parsedData);

    return NextResponse.json({
      success: true,
      reportType: slug,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
    });

  } catch (error) {
    console.error(`Error generating ${params.slug} report:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}