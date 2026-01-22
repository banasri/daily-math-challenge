  import { doc, runTransaction } from "firebase/firestore";
  import { db } from "../firebase/firestore";
  import { getTodayIST, getYesterdayIST } from "../utils/date";

  export async function updatePlayedStreak(studentKey) {
    const userRef = doc(db, "users", studentKey);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists()) return;

      const data = snap.data();
      const today = getTodayIST();

      // Already played today
      if (data.lastPlayedDate === today) return;

      // Determine new streak
      let newStreak = 1;
      if (data.lastPlayedDate === getYesterdayIST()) {
        newStreak = (data.playedStreak || 0) + 1;
      }

      tx.update(userRef, {
        playedStreak: newStreak,
        maxPlayedStreak: Math.max(data.maxPlayedStreak || 0, newStreak),
        lastPlayedDate: today
      });
    });
  }
