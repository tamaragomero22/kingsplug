import React, { useState, useEffect } from "react";
import { Nav } from "./Nav";
import { useNavigate } from "react-router-dom";
import { Footer } from "./Footer";
import "./KYC.css";

const KYC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
  });
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/dashboard/data",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          // Format date for the input[type="date"] which expects YYYY-MM-DD
          if (user.dateOfBirth) {
            user.dateOfBirth = new Date(user.dateOfBirth)
              .toISOString()
              .split("T")[0];
          }

          setFormData((prev) => ({
            ...prev,
            ...user,
            gender: user.gender || "",
          }));
          setUserEmail(user.email);
          setFirstName(user.firstName);
        }
      } catch (error) {
        console.error("Failed to fetch user data for KYC:", error);
      } finally {
        setPageIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Create a payload with only the necessary fields to avoid sending extra data
    // (like email, _id, etc.) that might cause backend validation errors.
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      mobileNumber: formData.mobileNumber,
    };

    try {
      const response = await fetch("http://localhost:4000/api/user/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        setError(`Server returned an unexpected response format (${response.status}).`);
        return;
      }

      if (!response.ok) {
        console.error("KYC Submission Error:", data);
        setError(
          data.error || data.message || "Failed to submit KYC information."
        );
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        alert(data.message || "KYC information submitted successfully!");
        navigate("/dashboard"); // Redirect to dashboard on success
      }, 1000);
    } catch (err) {
      console.error("Error submitting KYC:", err);
      setError(`An unexpected error occurred: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (pageIsLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <>
      <Nav userEmail={userEmail} firstName={firstName} hideSignUp={true} />
      <div className="kyc-container">
        <form className="kyc-form" onSubmit={handleSubmit}>
          <h2>KYC Verification</h2>
          <p>
            Please fill out the form below to complete your KYC verification.
          </p>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="number"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              minLength="11"
              maxLength="12"
              pattern="^\d{11,12}$"
            />
          </div>



          {loading && <p className="loading-message">Submitting...</p>}
          {error && <p className="error-message">{error}</p>}
          {success && (
            <p className="success-message">KYC submitted successfully!</p>
          )}

          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit KYC"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default KYC;
