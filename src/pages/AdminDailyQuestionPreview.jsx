import { useEffect, useState } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTodayQuestionByGrDate } from "../services/getTodayQuestionByGrDate";
const ADMIN_EMAIL = "ADMIN-Email"; // 🔐 Set your admin email here

export default function AdminDailyQuestionPreview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [grade, setGrade] = useState("");
  const [date, setDate] = useState("");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Protect page
  useEffect(() => {
    if (!user) return;
    if (user.email !== ADMIN_EMAIL) {
      navigate("/");
    }
  }, [user]);

  const loadQuestion = async () => {
    if (!grade || !date) {
      setError("Select grade and date");
      return;
    }

    setLoading(true);
    setError("");
    setQuestion(null);

    try {

      const q = await getTodayQuestionByGrDate(grade, date);

      setQuestion(q);
    } catch (err) {
      console.log("Error loading question:", err);
      setError("Error loading question");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin – Daily Question Preview</h2>

      <div style={{ marginBottom: 20 }}>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">Select Grade</option>
          <option value="6">Grade 6</option>
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: 10 }}
        />

        <button onClick={loadQuestion} style={{ marginLeft: 10 }}>
          Load
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {question && (
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
                  style={{
                    width: "100%",
                    padding: 10,
                    color: "#333",
                    border: "2px solid #ccc",
                    backgroundColor: "#ffffffc4",
                  }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
          {/* ✅ Show correct answer and disable options after submission */
            <p style={{ color: "brown", marginTop: 8, fontSize: 16 }}>
              Correct Answer: {question.options[question.correctOption]}
            </p>}




          {/* ✅ SOLUTION (ADDED AT CORRECT PLACE) */}
          {question.solutions && (
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
  );
}
