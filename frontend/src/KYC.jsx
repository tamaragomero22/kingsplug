import React, { useState } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import "./KYC.css";

const KYC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    bvn: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("KYC Data Submitted:", formData);
    alert("KYC information submitted successfully!");
  };

  return (
    <>
      <Nav />
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="bvn">BVN (Bank Verification Number)</label>
            <input
              type="number"
              id="bvn"
              name="bvn"
              placeholder="Enter your 11-digit BVN"
              value={formData.bvn}
              onChange={handleChange}
              required
              minLength="11"
              maxLength="11"
            />
          </div>

          <button type="submit" className="cta-button">
            Submit KYC
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default KYC;
