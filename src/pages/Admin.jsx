import { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { getTodayString } from "../utils/date";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user } = useAuth();

  // 🔒 Admin-only access
  if (!user || user.email !== "banasrigupta123@gmail.com") {
    return <p>Access denied</p>;
  }
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [grade, setGrade] = useState("6");
  const [date, setDate] = useState(getTodayString());
  const [solutions, setSolutions] = useState([""]);

  const updateOption = (i, value) => {
    const copy = [...options];
    copy[i] = value;
    setOptions(copy);
  };

  const updateSolution = (i, value) => {
    const copy = [...solutions];
    copy[i] = value;
    setSolutions(copy);
  };

  const addSolutionStep = () => {
    setSolutions([...solutions, ""]);
  };

  const saveQuestion = async () => {
    if (!text || options.some(o => !o)) {
      alert("Please fill all fields");
      return;
    }

    // 🔒 Prevent duplicate question for same grade + date
    const duplicateQuery = query(
      collection(db, "questions"),
      where("grade", "==", grade),
      where("date", "==", date)
    );

    const existing = await getDocs(duplicateQuery);

    if (!existing.empty) {
      alert(
        `❌ A question already exists for Grade ${grade} on ${date}`
      );
      return;
    }

    const solutionSteps = solutions
      .filter(s => s.trim())
      .map((s, idx) => ({
        step: idx + 1,
        text: s
      }));

    await addDoc(collection(db, "questions"), {
      text,
      options,
      correctOption: Number(correctOption),
      grade,
      date,
      solutions: solutionSteps
    });

    alert("Question saved ✅");

    // Optional reset
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectOption(0);
    setSolutions([""]);
  };

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      <h2>Admin – Add Daily Question</h2>

      <label>Grade</label>
      <select value={grade} onChange={e => setGrade(e.target.value)}>
        <option value="6">Grade 6</option>
        <option value="7">Grade 7</option>
        <option value="8">Grade 8</option>
      </select>

      <br /><br />

      <label>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <br /><br />

      <label>Question</label>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        style={{ width: "100%" }}
      />

      <h4>Options</h4>
      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={e => updateOption(i, e.target.value)}
          style={{ display: "block", marginBottom: 5, width: "100%" }}
        />
      ))}

      <label>Correct Option</label>
      <select
        value={correctOption}
        onChange={e => setCorrectOption(e.target.value)}
      >
        <option value={0}>Option 1</option>
        <option value={1}>Option 2</option>
        <option value={2}>Option 3</option>
        <option value={3}>Option 4</option>
      </select>

      <h4>Solution Steps</h4>
      {solutions.map((s, i) => (
        <input
          key={i}
          placeholder={`Step ${i + 1}`}
          value={s}
          onChange={e => updateSolution(i, e.target.value)}
          style={{ display: "block", marginBottom: 5, width: "100%" }}
        />
      ))}

      <button onClick={addSolutionStep}>+ Add Step</button>

      <br /><br />

      <button onClick={saveQuestion}>Save Question</button>
    </div>
  );
}
