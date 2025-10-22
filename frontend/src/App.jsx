import { Routes, Route } from "react-router-dom";
import { Home } from "./Home.jsx";
import "./App.css";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import VerifyEmail from "./VerifyEmail.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
