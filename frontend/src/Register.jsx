import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

const API_URL = import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'kingsplug.com' || window.location.hostname === 'www.kingsplug.com'
    ? 'https://api.kingsplug.com'
    : 'http://localhost:4000');

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
  const [isLoading, setIsLoading] = useState(false);

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

    console.log("Submitting registration...", { firstName, lastName, email });
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Essential for sending/receiving cookies cross-origin
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        console.error("Registration response not OK", res.status);
        // If response is not OK, it means there are validation errors
        if (data.errors) {
          setEmailError(data.errors.email);
          setFirstNameError(data.errors.firstName);
          setLastNameError(data.errors.lastName);
          setPasswordError(data.errors.password);
          setRepeatPasswordError(data.errors.repeatPassword);
        }
        // If there's a general warning/error but specific fields aren't set
        if (data.warning) {
          console.warn(data.warning);
          alert(data.warning); // Show the warning (about email failure) to the user
          // Proceed to verification anyway if user object exists
          if (data.user) {
            navigate(`/verify-email?userId=${data.user}`);
            return;
          }
        }
        let errorMessage = data.message || data.error || "Registration failed";

        // If we have field-specific errors, we don't necessarily need to throw a general error TO THE USER via alert,
        // unless we want to. But for now, let's include them in the thrown error message for debugging if needed,
        // or just throw the main message.
        if (data.errors) {
          // If we have errors object, the UI is already updated via setStates above.
          // We can just return here to stop execution without throwing a disruptive alert, 
          // OR we can throw a silent error.
          return;
        }

        throw new Error(errorMessage);
      }

      // If registration is successful
      console.log("Registration successful:", data);

      if (data.warning) {
        alert(data.warning);
      }

      const userId = data.user || (data.user && data.user._id); // Handle potential structure differences
      navigate(`/verify-email?userId=${userId}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Registration error:", err);
      setEmailError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign up"}
        </button>

        <Link className="forgotPassword" to="/">
          Have an Account? Log in Here
        </Link>
      </form>
      <Footer />
    </>
  );
};

export default Register;
