import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");

  const submit = async () => {
    if (!fullName || !grade) return;

    await updateDoc(doc(db, "users", user.uid), {
      fullName,
      grade,
    });

    navigate("/question", { replace: true });
    window.location.reload();

  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Student Details</h3>

      <input
        placeholder="Student Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <br /><br />

      <select value={grade} onChange={(e) => setGrade(e.target.value)}>
        <option value="">Select Grade</option>
        <option value="6">Grade 6</option>
        <option value="7">Grade 7</option>
        <option value="8">Grade 8</option>
      </select>

      <br /><br />

      <button onClick={submit}>Continue</button>
    </div>
  );
}