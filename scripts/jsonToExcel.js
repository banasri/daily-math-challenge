import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CONFIG ----
const INPUT_JSON = "questions.json";
const OUTPUT_XLSX = "questions.xlsx";
// ----------------

// Convert values so Excel can display them
function normalizeValue(value) {
  if (Array.isArray(value)) {
    // Convert array → readable string
    return value.map(v =>
      typeof v === "object" ? JSON.stringify(v) : String(v)
    ).join(" | ");
  }

  if (typeof value === "object" && value !== null) {
    // Convert object → string
    return JSON.stringify(value);
  }

  return value; // string, number, boolean, null
}

try {
  const raw = fs.readFileSync(
    path.join(__dirname, INPUT_JSON),
    "utf-8"
  );

  const jsonData = JSON.parse(raw);

  const processedData = jsonData.map(row => {
    const flatRow = {};
    for (const key in row) {
      flatRow[key] = normalizeValue(row[key]);
    }
    return flatRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(processedData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

  XLSX.writeFile(
    workbook,
    path.join(__dirname, OUTPUT_XLSX)
  );

  console.log("✅ Excel created successfully");
  console.log(`📦 Rows: ${processedData.length}`);
} catch (err) {
  console.error("❌ Error:", err.message);
}
