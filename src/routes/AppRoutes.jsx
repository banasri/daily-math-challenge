import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import Login from "../pages/Login";
import DailyQuestion from "../pages/DailyQuestion";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import Leaderboard from "../pages/Leaderboard";
import StreaksAndStats from "../pages/StreaksAndStats";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firestore";

/* 🔐 Auth guard */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" />;
}

/* 🧠 Profile completeness guard */
function ProfileGuard({ children }) {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function checkProfile() {
      const snap = await getDoc(doc(db, "users", user.uid));
      setHasProfile(!!snap.data()?.fullName);
      setReady(true);
    }

    checkProfile();
  }, [user]);

  if (!ready) return null;

  // 🚨 Redirect to Profile instead of Onboarding
  return hasProfile ? children : <Navigate to="/profile" />;
}

/* 👇 Routes */
export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/leaderboard" element={<Leaderboard />} />

      <Route
        path="/"
        element={user ? <Navigate to="/question" /> : <Login />}
      />
      <Route path="/streaks" element={<StreaksAndStats />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/question"
        element={
          <PrivateRoute>
            <ProfileGuard>
              <DailyQuestion />
            </ProfileGuard>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}