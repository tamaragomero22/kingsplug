import { Routes, Route } from "react-router-dom";
import { Home } from "./Home.jsx";
import "./App.css";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import VerifyEmail from "./VerifyEmail.jsx";
import KYC from "./KYC.jsx";
import About from "./About.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
