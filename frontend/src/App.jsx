import { Routes, Route } from "react-router-dom";
import { Home } from "./Home.jsx";
import "./App.css";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import VerifyEmail from "./VerifyEmail.jsx";
import KYC from "./KYC.jsx";
import About from "./About.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import ChangePassword from "./ChangePassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Terms from "./Terms.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
