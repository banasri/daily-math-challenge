import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { Timestamp } from "firebase/firestore";

export async function getOrCreateUser(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);
  const now = new Date();
  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 14);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      fullName: "",
      grade: "",
      createdAt: Timestamp.fromDate(now),

      trialEndsAt: Timestamp.fromDate(trialEnds),
      subscriptionStartedAt: null,
      subscriptionEndsAt: null,
      subscriptionStatus: "trial",
      // ✅ Streak initialization
      playedStreak: 0,
      maxPlayedStreak: 0,
      lastPlayedDate: ""
    });
    return { isNew: true };
  }

  return { isNew: false, data: snap.data() };
}
