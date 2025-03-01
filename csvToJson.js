const fs = require("fs");
const path = require("path");
const csv = require("papaparse");

const csvFilePath = path.join(__dirname, "credit_limits.csv");

// Read CSV File
fs.readFile(csvFilePath, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading CSV file:", err);
        return;
    }

    // Convert CSV to JSON
    const parsedData = csv.parse(data, { header: true }).data;

    // Transform data structure to match API format
    const jsonData = parsedData.map(row => ({
        pan: row.pan,
        gst: row.gst,
        enhancerType: row.enhancerType,
        entityName: row.entityName,
        anchorEntityId: row.anchorEntityId,
        enhancerLimit: row.enhancerLimit,
        validity: row.validity.split("-").map(num => parseInt(num, 10)),
        marginDays: parseInt(row.marginDays),
        graceDays: parseInt(row.graceDays),
        creditPeriod: parseInt(row.creditPeriod),
        groupEntityName: row.groupEntityName || "",
        grossMargin: parseDouble(row.grossMargin),
        businessUnit: row.businessUnit,
        comments: row.comments
    }));

    // Save JSON to a file
    fs.writeFileSync("credit_limits.json", JSON.stringify(jsonData, null, 4));
    console.log("✅ JSON file created: credit_limits.json");
});
