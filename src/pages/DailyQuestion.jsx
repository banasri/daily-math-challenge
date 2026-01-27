import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firestore";
import { getTodayQuestion } from "../services/questionService";
import { isAccessActive } from "../utils/subscription";
import confetti from "canvas-confetti";
import { updatePlayedStreak } from "../services/submissionService";
import Lottie from "lottie-react";
import goldCoinAnim from "../lottie/coin_gold.json";
import bronzeCoinAnim from "../lottie/coin_bronze.json";
import { useRef, useLayoutEffect } from "react";
import Wallet from "../components/MyWallet";
import { updateUserStatsAfterPlay } from "../services/userService";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import MilestoneBanner from "../components/MilestoneBanner";
export default function DailyQuestion() {

  const { user, logout } = useAuth();

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [streak, setStreak] = useState(null);
  const [showRewardAnim, setShowRewardAnim] = useState(false);
  const [showMilestoneBanner, setShowMilestoneBanner] = useState(false);

  const walletRef = useRef(null);
  const [walletPulse, setWalletPulse] = useState(false);
  const [flyingCoin, setFlyingCoin] = useState(null);
  const milestoneShownRef = useRef(false);

  const navigate = useNavigate();
  // { start: {x,y}, end: {x,y} }
  const handleLogout = async () => {
    await logout(); // Firebase signOut
    navigate("/login", { replace: true });
  };
  const rewardOverlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const coinWrapperStyle = {
    position: "relative",
    width: 200,
    height: 200,
  };

  const coinTextStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 32,
    fontWeight: 800,
    color: "#7a4b00",
    textShadow: "0 2px 4px rgba(0,0,0,0.25)",
    pointerEvents: "none",
  };


  useEffect(() => {
    async function load() {
      if (!user) return;

      // 1️⃣ Fetch user profile
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const grade = userSnap.data().grade;
      const profile = userSnap.data();
      setUserProfile(profile);
      const hasAccess = isAccessActive(profile);
      setHasAccess(hasAccess);
      setStreak(profile.stats.playedStreak || 0);
      console.log("User profile streak:", streak);
      // 2️⃣ Fetch today’s question
      const q = await getTodayQuestion(grade);
      setQuestion(q);

      // 3️⃣ Check if already submitted today
      if (q) {
        const submissionId = `${user.uid}_${q.date}`;
        const subSnap = await getDoc(
          doc(db, "submissions", submissionId)
        );

        if (subSnap.exists()) {
          const data = subSnap.data();
          console.log("Previous submission data:", data);
          setSubmitted(true);
          setIsCorrect(data.isCorrect);          // ✅ restore correctness
          setSelectedOption(data.selectedOption); // ✅ restore selection
          setSelected(data.selectedOption);
        }
      }

      setLoading(false);
    }

    load();
  }, [user]);

  const submitAnswer = async () => {
    if (selected === null || submitted) return;
    if (!hasAccess) return;

    const submissionId = `${user.uid}_${question.date}`;
    const isCorrect = selected === question.correctOption;
    setSelectedOption(selected);

    // 1️⃣ Store selected option
    // 2️⃣ Check correctness
    // 3️⃣ Update state
    setIsCorrect(isCorrect);   // ✅ store result
    setSubmitted(true);

    // 🎯 Base coins for attempting
    setShowRewardAnim(true);


    // 🎯 Bonus coins if correct
    setTimeout(() => {
      // if (isCorrect) {
      //   setRewardCoins(10); // 2 + 8
      // }

      // Close animation
      setTimeout(() => {
        setShowRewardAnim(false);
      }, 900);

      setTimeout(() => {
        const walletRect = walletRef.current.getBoundingClientRect();

        setFlyingCoin({
          start: {
            x: window.innerWidth / 2 - 30,
            y: window.innerHeight / 2 - 30,
          },
          end: {
            x: walletRect.left + walletRect.width / 2 - 30,
            y: walletRect.top + walletRect.height / 2 - 30,
          },
        });
      }, 800);

    }, 700);




    // 4️⃣ Save submission
    await setDoc(doc(db, "submissions", submissionId), {
      userId: user.uid,
      fullName: userProfile.fullName,
      questionId: question.id,
      date: question.date,
      grade: question.grade,
      school: userProfile.school || null,
      selectedOption: selected,
      isCorrect,
      submittedAt: serverTimestamp(),
    });

    await updatePlayedStreak(user.uid);
    // 🔁 Re-fetch updated user data (streak just changed)
    const updatedSnap = await getDoc(doc(db, "users", user.uid));
    const updatedProfile = updatedSnap.data();

    // 5️⃣ Update user stats (coins, score, games)
    await updateUserStatsAfterPlay({
      uid: user.uid,
      isCorrect,
      coinsEarned: isCorrect ? 10 : 2,
      scoreEarned: isCorrect ? 1 : 0,
      todayDate: question.date,
    });

    const newStreak = updatedProfile.stats.playedStreak;
    console.log("Updated streak:", newStreak);
    setStreak(newStreak);
    // 🏁 10-day milestone logic (no reset)
    // 🎯 10-day milestone banner

    if (
      newStreak > 0 &&
      newStreak % 10 === 0 &&
      !milestoneShownRef.current
    ) {
      milestoneShownRef.current = true;

      setShowMilestoneBanner(true);

      // Confetti AFTER banner appears
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
        });
      }, 400);

      // Hide banner
      setTimeout(() => {
        setShowMilestoneBanner(false);
      }, 2500);

      // Milestone coins (fire-and-forget)
      updateUserStatsAfterPlay({
        uid: user.uid,
        isCorrect,
        coinsEarned: 50,
        scoreEarned: isCorrect ? 1 : 0,
        todayDate: question.date,
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  const RewardOverlay = () => {
    if (!showRewardAnim) return null;

    const coinValue = isCorrect ? 10 : 2;
    const coinAnim = isCorrect ? goldCoinAnim : bronzeCoinAnim;
    const coinSize = isCorrect ? 340 : 140;

    return (
      <div style={rewardOverlayStyle}>
        <div
          style={{
            position: "relative",
            width: coinSize,
            height: coinSize,
          }}
        >
          <Lottie
            animationData={coinAnim}
            loop={false}
            style={{ width: "100%", height: "100%" }}
          />

          {/* 🔢 Engraved Number */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: isCorrect ? 42 : 32,
              fontWeight: 900,
              fontFamily: "Cinzel, serif",
              color: isCorrect ? "#8b6508" : "#7a4b00",
              textShadow:
                "1px 1px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.3)",
              pointerEvents: "none",
            }}
          >
            {coinValue}
          </div>
        </div>
      </div>
    );
  };


  const FlyingCoin = ({ start, end, onComplete }) => {
    const [pos, setPos] = useState(start);

    useEffect(() => {
      const startTime = performance.now();
      const duration = 700;

      const animate = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = t * (2 - t);

        setPos({
          x: start.x + (end.x - start.x) * ease,
          y: start.y + (end.y - start.y) * ease,
        });

        if (t < 1) requestAnimationFrame(animate);
        else onComplete();
      };

      requestAnimationFrame(animate);
    }, []);

    return (
      <Lottie
        animationData={isCorrect ? goldCoinAnim : bronzeCoinAnim}
        loop={false}
        style={{
          width: 60,
          height: 60,
          position: "fixed",
          left: pos.x,
          top: pos.y,
          pointerEvents: "none",
          zIndex: 10000,
        }}
      />

    );
  };


  return (
    <> {/* Header */}
      <Header
        user={user}
        streak={streak}
        coins={userProfile?.stats?.currentCoins || 0}
        onProfileClick={() => navigate("/profile")}
        onLogout={handleLogout}
        onLeaderboardClick={() => navigate("/leaderboard")}
        walletRef={walletRef}
      />
      <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
        {!hasAccess ? (
          <div style={{ padding: 20 }}>
            <h3>🔒 Trial Ended</h3>
            <p>
              Your free trial has ended.
              Subscribe to continue solving daily puzzles.
            </p>
          </div>
        ) : !question ? (
          <p>No question available for today. Come back tomorrow!</p>
        ) :
          (
            <>
              {/* existing question + MCQ + submit + solution */}
              {/* Question */}
              <h4>{question.text}</h4>
              {/* 🖼️ Image (ONLY if url exists) */}
              {question.url && (
                <div style={{ margin: "16px 0", textAlign: "center" }}>
                  <img
                    src={question.url}
                    alt={question.altText || "Question Image"}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>
              )}
              {/* Options */}
              <ul style={{ listStyle: "none", padding: 0 }}>
                {question.options.map((opt, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <button
                      disabled={submitted}
                      onClick={() => setSelected(idx)}
                      style={{
                        width: "100%",
                        padding: 10,
                        cursor: submitted ? "default" : "pointer",
                        color: "#333",
                        border:
                          selected === idx
                            ? "2px solid #333"
                            : "1px solid #ccc",
                        backgroundColor:
                          submitted && idx === question.correctOption
                            ? "#17b60bff" // green for correct
                            : submitted && idx === selected
                              ? "#f56767ff" // red for wrong selected
                              : selected === idx
                                ? "#e0e0e0" // selected but not submitted
                                : "#fff",
                      }}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
              {submitted && (
                <div style={{ marginTop: 10 }}>
                  {isCorrect ? (
                    <p style={{ color: "#ceffff" }}>🎉 Congratulations! Your name appears in today’s Hall of Fame (Leaderboard).</p>
                  ) : (
                    <p style={{ color: "#ffc0ce" }}>
                      Good try! Come back tomorrow for a new challenge. The correct answer is option{" "}
                      {question.correctOption + 1}.
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              {!submitted && (
                <button
                  onClick={submitAnswer}
                  disabled={selected === null}
                  style={{ marginTop: 10 }}
                >
                  Submit Answer
                </button>
              )}

              {submitted && <p>Answer submitted ✅</p>}

              {/* ✅ SOLUTION (ADDED AT CORRECT PLACE) */}
              {submitted && question.solutions && (
                <div style={{ marginTop: 20 }}>
                  <h4>Solution</h4>
                  <ol>
                    {question.solutions
                      .sort((a, b) => a.step - b.step)
                      .map((s) => (
                        <li key={s.step}>{s.text}</li>
                      ))}
                  </ol>
                </div>
              )}
            </>
          )}

      </div>
      <RewardOverlay />

      <MilestoneBanner visible={showMilestoneBanner} />

      {flyingCoin && (
        <FlyingCoin
          start={flyingCoin.start}
          end={flyingCoin.end}
          onComplete={async () => {
            setFlyingCoin(null);
            setWalletPulse(true);

            const snap = await getDoc(doc(db, "users", user.uid));
            setUserProfile(snap.data());

            setTimeout(() => setWalletPulse(false), 300);
          }}
        />
      )}

    </>
  );
}
