const fs = require("fs");
const path = require("path");
const csv = require("papaparse");

const csvFilePath = path.join(__dirname, "Buyer finance limits 28Feb.csv");

// Read CSV File
fs.readFile(csvFilePath, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading CSV file:", err);
        return;
    }

    // Convert CSV to JSON
    const parsedData = csv.parse(data, { header: true }).data;

    // Transform data structure
    const jsonData = parsedData.map(row => {
        // Helper function to trim and handle empty values
        const cleanValue = (value) => {
            const trimmed = value ? value.trim() : "";
            return trimmed === "" ? null : trimmed;
        };

        // Parse validity date or set null
        const validity = cleanValue(row.validity);
        const validityArray = validity
            ? validity.split("-").map(num => parseInt(num, 10))
            : null;

        return {
            pan: cleanValue(row.pan),
            gst: cleanValue(row.gst),
            enhancerType: cleanValue(row.enhancerType),
            entityName: cleanValue(row.entityName),
            anchorEntityId: cleanValue(row.anchorEntityId),
            enhancerLimit: cleanValue(row.enhancerLimit),
            validity: validityArray,
            marginDays: row.marginDays ? parseInt(row.marginDays, 10) : null,
            graceDays: row.graceDays ? parseInt(row.graceDays, 10) : null,
            creditPeriod: row.creditPeriod ? parseInt(row.creditPeriod, 10) : null,
            groupEntityName: cleanValue(row.groupEntityName),
            businessUnit: cleanValue(row.businessUnit),
                  grossMargin: parseFloat(row.grossMargin),
            comments: cleanValue(row.comments)
        };
    });

    // Save JSON to a file
    fs.writeFileSync("credit_limits.json", JSON.stringify(jsonData, null, 4));
    console.log("✅ JSON file created: credit_limits.json");
});
