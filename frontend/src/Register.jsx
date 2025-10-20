import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError("");
    setPasswordError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Essential for sending/receiving cookies cross-origin
      });

      const data = await res.json();

      if (!res.ok) {
        // If response is not OK, it means there are validation errors
        if (data.errors) {
          setEmailError(data.errors.email);
          setPasswordError(data.errors.password);
        }
        throw new Error("Registration failed"); // This should be inside the if block
      }

      // If registration is successful
      console.log("Registration successful:", data);
      // You can redirect the user or show a success message here
      // For example: window.location.href = '/login';
      // On successful registration, redirect to the services page.
      navigate("/dashboard");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Nav />
      <form className="registerForm" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="email error">{emailError}</div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="error">{passwordError}</div>

        <button type="submit">Sign up</button>

        <Link className="forgotPassword" to="/">
          Have an Account? Log in Here
        </Link>
      </form>
      <Footer />
    </>
  );
};

export default Register;
