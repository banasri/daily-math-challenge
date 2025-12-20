import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { getTodayString } from "../utils/date";

export async function getTodayQuestion(grade) {
  const today = getTodayString();

  const q = query(
    collection(db, "questions"),
    where("grade", "==", grade),
    where("date", "==", today)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const docSnap = snap.docs[0];

  return {
    id: docSnap.id,        // ✅ IMPORTANT
    ...docSnap.data(),
  };
}
