import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CONFIG ----
const SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json";
const COLLECTION_NAME = "questions";
const INPUT_JSON = "questions.json";
// ----------------

// Load service account
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, SERVICE_ACCOUNT_PATH),
    "utf-8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadJson() {
  try {
    const rawData = fs.readFileSync(
      path.join(__dirname, INPUT_JSON),
      "utf-8"
    );

    const rows = JSON.parse(rawData);

    console.log(`📦 Rows found: ${rows.length}\n`);

    let uploadedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const grade = row.grade;
      const date = row.date;

      if (!grade || !date) {
        console.log(`⚠️ Row ${i + 1} skipped (missing grade/date)`);
        skippedCount++;
        continue;
      }

      // 🔍 Check existing
      const existingQuery = await db
        .collection(COLLECTION_NAME)
        .where("grade", "==", grade)
        .where("date", "==", date)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        console.log(
          `⏭️ Skipped Row ${i + 1} → grade=${grade}, date=${date} (already exists)`
        );
        skippedCount++;
        continue;
      }

      await db.collection(COLLECTION_NAME).add(row);

      console.log(
        `✅ Uploaded Row ${i + 1} → grade=${grade}, date=${date}`
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

uploadJson();
