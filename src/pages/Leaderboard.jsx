import { useEffect, useState } from "react";
import { getTodayLeaderboard } from "../services/leaderboardService";

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodayLeaderboard();
        setEntries(data);
      } catch (err) {
        console.error("Leaderboard load failed", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div style={{ maxWidth: 500, padding: 20 }}>
      <h2>
        🏆 Today’s Hall of Fame
      </h2>

      {entries.length === 0 ? (
        <p >
          No correct answers yet today. Be the first to solve today’s puzzle! 🚀
        </p>
      ) : (
        <ol style={{ marginTop: 20 }}>
          {entries.map((e, idx) => (
            <li key={idx} style={{ marginBottom: 10 }}>
              <strong>{e.fullName}</strong>
              {e.grade && (
                <span style={{ color: "#d6e2db" }}>
                  {" "}— Grade {e.grade}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
