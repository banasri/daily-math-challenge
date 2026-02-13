import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CONFIG ----
const INPUT_XLSX = "questions.xlsx";
const COLLECTION_NAME = "questions";
const SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json";
// ----------------

// Load service account
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, SERVICE_ACCOUNT_PATH),
    "utf-8"
  )
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function formatDateToISO(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseValue(value) {
  if (typeof value === "number") {
    // Excel serial date detection
    if (value > 30000 && value < 60000) {
      const excelEpoch = new Date(1899, 11, 30);
      const jsDate = new Date(excelEpoch.getTime() + value * 86400000);

      return formatDateToISO(jsDate);
    }

    return value;
  }

  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  // Handle MM/DD/YY or MM/DD/YYYY
  const usDateMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (usDateMatch) {
    let [_, month, day, year] = usDateMatch;

    month = parseInt(month) - 1;
    day = parseInt(day);
    year = parseInt(year);

    if (year < 100) year += 2000;

    const jsDate = new Date(year, month, day);
    return formatDateToISO(jsDate);
  }

  // Handle YYYY/MM/DD or YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
  if (isoMatch) {
    const [_, year, month, day] = isoMatch;
    const jsDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );

    return formatDateToISO(jsDate);
  }

  // Arrays
  if (trimmed.includes("|")) {
    return trimmed.split("|").map(v => v.trim());
  }

  // Boolean
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  return trimmed;
}

async function uploadExcel() {
  try {
    const workbook = XLSX.readFile(
      path.join(__dirname, INPUT_XLSX)
    );

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, { raw: false });

    console.log(`📦 Rows found: ${rows.length}`);

    let uploadedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const processedRow = {};
      for (const key in row) {
        processedRow[key] = parseValue(row[key]);
      }
      if (processedRow.correctOption !== undefined) {
        processedRow.correctOption = parseInt(processedRow.correctOption, 10);
      }

      if (processedRow.solutions !== undefined) {

        let raw = processedRow.solutions;

        // Case 1: If it's a string (single step)
        if (typeof raw === "string") {
          raw = [raw]; // convert to array
        }

        // Case 2: If it's already an array (multiple steps)
        if (Array.isArray(raw)) {
          raw = raw.map(item => {
            if (typeof item === "string") {
              try {
                return JSON.parse(item.trim());
              } catch (err) {
                console.log("Invalid JSON in solutions:", item);
                return null;
              }
            }
            return item;
          }).filter(Boolean);
        } else {
          raw = [];
        }

        processedRow.solutions = raw;
      }


      const grade = processedRow.grade;
      const date = processedRow.date;

      if (!grade || !date) {
        console.log(`⚠️ Row ${i + 2} skipped (missing grade/date)`);
        skippedCount++;
        continue;
      }

      // 🔍 Check if document exists
      const existingQuery = await db
        .collection(COLLECTION_NAME)
        .where("grade", "==", grade)
        .where("date", "==", date)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        console.log(
          `⏭️ Skipped Row ${i + 2} → grade=${grade}, date=${date} (already exists)`
        );
        skippedCount++;
        continue;
      }

      // ✅ Upload new document
      await db.collection(COLLECTION_NAME).add(processedRow);

      console.log(
        `✅ Uploaded Row ${i + 2} → grade=${grade}, date=${date}`
      );

      uploadedCount++;
    }

    console.log("\n🎯 Upload Summary");
    console.log(`✅ Uploaded: ${uploadedCount}`);
    console.log(`⏭️ Skipped: ${skippedCount}`);

  } catch (err) {
    console.error("❌ Upload failed:", err.message);
  }
}


uploadExcel();
