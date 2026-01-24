import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { getTodayIST, getYesterdayIST } from "../utils/date";

export async function updatePlayedStreak(studentKey) {
  const userRef = doc(db, "users", studentKey);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const stats = data.stats || {};   // <-- ensure stats exists
    const today = getTodayIST();

    // Already played today
    if (stats.lastPlayedDate === today) return;

    // Determine new streak
    let newStreak = 1;
    if (stats.lastPlayedDate === getYesterdayIST()) {
      newStreak = (stats.playedStreak || 0) + 1;
    }

    tx.update(userRef, {
      stats: {
        ...stats,
        playedStreak: newStreak,
        maxPlayedStreak: Math.max(stats.maxPlayedStreak || 0, newStreak),
        lastPlayedDate: today,
      },
    });
  });
}
