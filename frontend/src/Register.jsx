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
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const validatePassword = (pass) => {
    const hasNumber = /\d/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    let error = "";
    if (!hasNumber && !hasSymbol) {
      error = "Password must contain at least one number and one symbol.";
    } else if (!hasNumber) {
      error = "Password must contain at least one number.";
    } else if (!hasSymbol) {
      error = "Password must contain at least one symbol.";
    }

    if (error) {
      setPasswordError(error);
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordBlur = () => {
    if (password) {
      validatePassword(password);
    }
  };

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

    // Password strength validation: at least one number and one symbol
    if (!validatePassword(password)) {
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

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>
        <div className="error">{passwordError}</div>

        <div className="password-input-wrapper">
          <input
            type={showRepeatPassword ? "text" : "password"}
            name="repeatPassword"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            tabIndex="-1"
          >
            {showRepeatPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>
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
