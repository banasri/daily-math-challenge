import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---- CONFIG ----
const COLLECTION_NAME = "questions";
const OUTPUT_FILE = `${COLLECTION_NAME}.json`;
const SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json";
// ----------------

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read service account manually
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

async function exportCollection() {
  try {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    const data = [];

    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const outputPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");

    console.log("✅ Export successful");
    console.log(`📄 File saved: ${OUTPUT_FILE}`);
    console.log(`📦 Documents exported: ${data.length}`);
  } catch (error) {
    console.error("❌ Export failed:", error);
  }
}

exportCollection();
