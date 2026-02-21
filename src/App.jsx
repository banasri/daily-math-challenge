import { useState } from 'react'
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import './App.css'
import Header from "./components/Header";
import Footer from "./components/Contact";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <div className="main-content">
          <AppRoutes />
        </div>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App
