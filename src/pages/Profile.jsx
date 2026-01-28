import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    grade: "",
    school: "",
    dob: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.data();
      setProfile(data);
      setForm({
        fullName: data.fullName || "",
        grade: data.grade || "",
        school: data.school || "",
        dob: data.dob || "",
      });
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setSaving(true);
    await updateDoc(doc(db, "users", user.uid), {
      fullName: form.fullName,
      grade: form.grade,
      school: form.school,
      dob: form.dob,
      updatedAt: new Date(),
    });
    setSaving(false);
    navigate("/question", { replace: true });
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <>
      <AppHeader showLeaderboard={false} showStreaks={false} />
      <div style={{ maxWidth: 520, margin: "40px auto", padding: 20 }}>
        <h2>👤 Profile</h2>

        <div style={{ marginTop: 20 }}>
          <label>Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Class</label>
          <input
            name="grade"
            value={form.grade}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>School</label>
          <input
            name="school"
            value={form.school}
            onChange={handleChange}
            style={inputStyle}
          />

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            onClick={saveProfile}
            disabled={saving}
            style={{ marginTop: 20 }}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>

          <hr style={{ margin: "30px 0" }} />

          <button
            onClick={logout}
            style={{ background: "#ff4d4f", color: "white" }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  margin: "6px 0 14px",
};
