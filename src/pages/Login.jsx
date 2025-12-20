import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Daily Maths Challenge</h2>
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
}