import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import { Timestamp } from "firebase/firestore";

/**
 * Create user document if it does not exist
 */
export async function getOrCreateUser(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return { isNew: false, data: snap.data() };
  }

  const now = new Date();
  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 14);

  const userData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    fullName: "",
    grade: "",
    createdAt: Timestamp.fromDate(now),

    // Subscription
    trialEndsAt: Timestamp.fromDate(trialEnds),
    subscriptionStartedAt: null,
    subscriptionEndsAt: null,
    subscriptionStatus: "trial",

    // Gameplay summary stats
    stats: {
      gamesPlayed: 0,
      correctAnswers: 0,
      wrongAnswers: 0,

      totalCoinsEarned: 0,
      currentCoins: 0,

      totalScore: 0,
      todayScore: 0,

      playedStreak: 0,
      maxPlayedStreak: 0,
      lastPlayedDate: ""
    },

    updatedAt: serverTimestamp()
  };

  await setDoc(ref, userData);

  return { isNew: true, data: userData };
}

/**
 * Atomic update after daily submission
 */
export async function updateUserStatsAfterPlay({
  uid,
  isCorrect,
  coinsEarned,
  scoreEarned,
  todayDate
}) {
  const ref = doc(db, "users", uid);

  const updates = {
    "stats.gamesPlayed": increment(1),
    "stats.totalCoinsEarned": increment(coinsEarned),
    "stats.currentCoins": increment(coinsEarned),
    "stats.totalScore": increment(scoreEarned),
    "stats.todayScore": scoreEarned,
    "stats.lastPlayedDate": todayDate,
    updatedAt: serverTimestamp()
  };

  if (isCorrect) {
    updates["stats.correctAnswers"] = increment(1);
  } else {
    updates["stats.wrongAnswers"] = increment(1);
  }

  await updateDoc(ref, updates);
}
