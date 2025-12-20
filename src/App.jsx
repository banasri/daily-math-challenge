import { useState } from 'react'
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import './App.css'
import Header from "./components/Header";

function App() {
  return (
    <AuthProvider>
      <Header />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
