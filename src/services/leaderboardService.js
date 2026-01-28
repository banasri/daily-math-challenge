import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/firestore";

/**
 * Fetch today's correct submissions (public leaderboard)
 */
export async function getTodayLeaderboard() {
  const today = new Date().toISOString().slice(0, 10);

  const q = query(
    collection(db, "submissions"),
    where("date", "==", today),
    where("isCorrect", "==", true),
    orderBy("submittedAt", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => doc.data());
}
