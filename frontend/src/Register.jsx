import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");

    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Essential for sending/receiving cookies cross-origin
      });

      const data = await res.json();

      if (!res.ok) {
        // If response is not OK, it means there are validation errors
        if (data.errors) {
          setEmailError(data.errors.email);
          setFirstNameError(data.errors.firstName);
          setLastNameError(data.errors.lastName);
          setPasswordError(data.errors.password);
          setRepeatPasswordError(data.errors.repeatPassword);
        }
        throw new Error("Registration failed"); // This should be inside the if block
      }

      // If registration is successful
      console.log("Registration successful:", data);
      // You can redirect the user or show a success message here
      // On successful registration, redirect to the email verification page.
      const userId = data.user;
      navigate(`/verify-email?userId=${userId}`);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Nav />
      <form className="registerForm" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <div className="error">{firstNameError}</div>

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <div className="error">{lastNameError}</div>

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

        <input
          type="password"
          name="repeatPassword"
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <div className="error">{repeatPasswordError}</div>

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
