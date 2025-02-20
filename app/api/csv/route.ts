export async function GET(req: Request) {
  // Extract query params
  const url = new URL(req.url);
  const count = parseInt(url.searchParams.get("count") || "10", 10);

  // Sample data for SEO-related data
  const keywords = [
      { Keyword: "seo", Position: 9, PreviousPosition: 10, PositionDifference: 1, SearchVolume: 110000, CPC: 14.82, Url: "http://www.seobook.com/", TrafficPercent: 17.53, TrafficCostPercent: 44.40, Competition: 0.50, NumberOfResults: 0, Trends: "0.81,1.00,1.00,1.00,1.00,0.81,0.81,0.81,0.81,0.81,0.81,0.81" },
      { Keyword: "seobook", Position: 1, PreviousPosition: 1, PositionDifference: 0, SearchVolume: 1300, CPC: 4.54, Url: "http://www.seobook.com/", TrafficPercent: 5.52, TrafficCostPercent: 4.28, Competition: 0.32, NumberOfResults: 379000, Trends: "0.62,0.81,0.62,0.81,0.81,0.62,0.62,0.81,0.81,0.62,1.00,0.81" },
      { Keyword: "seo tools", Position: 6, PreviousPosition: 6, PositionDifference: 0, SearchVolume: 8100, CPC: 10.54, Url: "http://tools.seobook.com/", TrafficPercent: 2.15, TrafficCostPercent: 3.87, Competition: 0.54, NumberOfResults: 321000000, Trends: "0.67,0.82,0.82,1.00,0.82,0.82,0.67,0.67,0.67,0.67,0.82,0.82" },
      // Add more data here as needed
  ];

  // Ensure the count doesn't exceed available data length
  const selectedData = keywords.slice(0, count);

  let csvData = "Keyword,Position,Previous Position,Position Difference,Search Volume,CPC,Url,Traffic (%),Traffic Cost (%),Competition,Number of Results,Trends\n";

  selectedData.forEach(item => {
      csvData += `${item.Keyword},${item.Position},${item.PreviousPosition},${item.PositionDifference},${item.SearchVolume},${item.CPC},${item.Url},${item.TrafficPercent},${item.TrafficCostPercent},${item.Competition},${item.NumberOfResults},${item.Trends}\n`;
  });

  // Return CSV as response with correct headers
  return new Response(csvData, {
      headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="seo_data.csv"',
      },
  });
}
