"use client";

import React, { useState } from "react";
import "./competition.css";

export default function Competition() {
  // Slides data for the slideshow
  const slides = [
    {
      id: 1,
      image: "/Banner01.jpeg",
      caption: "Judges: Regent, Sing Sing, Seliny & Audience Votes (50%)",
    },
    { id: 2, image: "/AboutUs_img02.png", caption: "" },
    { id: 3, image: "/AboutUs_img03.png", caption: "" },
  ];

  // State for slideshow
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle slideshow navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // State management for form
  const [formData, setFormData] = useState({
    crewName: "",
    contactName: "",
    contactNumber: "+852",
    instagram: "@",
    category: "",
    teamMembers: "",
    videoURL: "",
    transactionSlip: null,
  });
  const [formError, setFormError] = useState(""); // Tracks form validation errors
  const [submitStatus, setSubmitStatus] = useState(""); // Feedback for submission status

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input separately for transactionSlip
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setFormData((prevData) => ({
      ...prevData,
      transactionSlip: file, // Save file to state
    }));
  };

  // Reset form fields
  const handleReset = () => {
    setFormData({
      crewName: "",
      contactName: "",
      contactNumber: "+852",
      instagram: "@",
      category: "",
      teamMembers: "",
      videoURL: "",
      transactionSlip: null,
    });
    setFormError("");
    setSubmitStatus("");
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate required fields
    if (
      !formData.crewName ||
      !formData.contactName ||
      !formData.contactNumber ||
      !formData.category ||
      !formData.teamMembers ||
      !formData.videoURL ||
      !formData.transactionSlip
    ) {
      setFormError("Please fill out all required fields correctly.");
      return;
    }

    setFormError(""); // Clear any existing errors
    setSubmitStatus("Submitting...");

    try {
      // Prepare form data for submission
      const submissionData = new FormData();
      submissionData.append("crewName", formData.crewName);
      submissionData.append("contactName", formData.contactName);
      submissionData.append("contactNumber", formData.contactNumber);
      submissionData.append("instagram", formData.instagram);
      submissionData.append("category", formData.category);
      submissionData.append("teamMembers", formData.teamMembers);
      submissionData.append("videoURL", formData.videoURL);
      submissionData.append("transactionSlip", formData.transactionSlip); // Add the file

      // Make POST request to the backend
      const response = await fetch("http://localhost:3030/competitionApply/submissions", {
        method: "POST",
        body: submissionData, // Send FormData
      });

      if (response.ok) {
        setSubmitStatus("Submission successful!");
        alert("Your submission was successful!"); // Display success alert
        handleReset(); // Reset form fields after success
      } else {
        const errorResponse = await response.json();
        setSubmitStatus(`Submission failed: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setSubmitStatus("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="CA-competition-container" id="CA-competition-container">
      {/* Slideshow */}
      <div className="CA-slideshow-container" id="CA-slideshow-container">
        <div className="CA-slide CA-fade" id="CA-slide">
          <img src={slides[currentIndex].image} alt={`Slide ${currentIndex + 1}`} />
          {slides[currentIndex].caption && (
            <div className="CA-caption" id="CA-caption">
              {slides[currentIndex].caption}
            </div>
          )}
        </div>
        <button className="CA-prev" id="CA-prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="CA-next" id="CA-next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      {/* Slideshow navigation dots */}
      <div className="CA-dots" id="CA-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`CA-dot ${currentIndex === index ? "CA-active" : ""}`}
            id={`CA-dot-${index}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>


      {/* Competition Details */}
      <header className="CA-competition-details" id="CA-competition-details">
        <h1 className="CA-heading" id="CA-heading">XVENGERS Dance Competition</h1>
        <h2 className="CA-judges-heading" id="CA-judges-heading">⚖️ Judges ⚖️</h2>
        <p className="CA-judges-info" id="CA-judges-info">
          <span>Choreography U12, U18, Open:</span> Regent, Sing Sing & Audience Votes (50%)
          <br />
          <span>K-Pop (Cover):</span> Seliny & Audience Votes (50%)
        </p>
        <h2 className="CA-remarks-heading" id="CA-remarks-heading">🕺🏽 Remarks For Dancers 💃🏾</h2>
        <p className="CA-remarks-info" id="CA-remarks-info">
          2-10 members per team
          <br />
          Each member can join 2 teams at most
          <br />
          U12 members can join U18 category
          <br />
          Documents for age validation required upon entering finals
        </p>
        <h2 className="CA-finals-heading" id="CA-finals-heading">🚨 Finals 🚨</h2>
        <p className="CA-finals-info" id="CA-finals-info">
          Top 5 of each category enter finals
          <br />
          Results announced: <span>Mar 28, 2025</span>
          <br />
          Ticketing info will be announced soon
        </p>
        <h2 className="CA-venue-heading" id="CA-venue-heading">📍 Venue & Date</h2>
        <p className="CA-venue-info" id="CA-venue-info">
          <span>📍 Vessel 01, Kwun Tong</span>
          <br />
          <span>🗓 April 4, 2025</span>
        </p>
        <h2 className="CA-awards-heading" id="CA-awards-heading">🏆 Awards & Prizes 🏆</h2>
        <table className="CA-awards-table" id="CA-awards-table">
          <thead className="CA-awards-thead" id="CA-awards-thead">
            <tr className="CA-awards-row" id="CA-awards-row">
              <th className="CA-awards-header" id="CA-awards-header-category">Category</th>
              <th className="CA-awards-header" id="CA-awards-header-1st">1st Place</th>
              <th className="CA-awards-header" id="CA-awards-header-2nd">2nd Place</th>
              <th className="CA-awards-header" id="CA-awards-header-3rd">3rd Place</th>
            </tr>
          </thead>
          <tbody className="CA-awards-tbody" id="CA-awards-tbody">
            <tr className="CA-awards-body-row" id="CA-awards-body-row">
              <td className="CA-awards-cell" id="CA-awards-cell-U12">U12 (Choreography)</td>
              <td className="CA-awards-cell">Voucher $3000 & Trophy</td>
              <td className="CA-awards-cell">Voucher $800 & Trophy</td>
              <td className="CA-awards-cell">Voucher $500 & Trophy</td>
            </tr>
            <tr className="CA-awards-body-row">
              <td className="CA-awards-cell" id="CA-awards-cell-U18">U18 (Choreography)</td>
              <td className="CA-awards-cell">Voucher $4000 & Trophy</td>
              <td className="CA-awards-cell">Voucher $1000 & Trophy</td>
              <td className="CA-awards-cell">Voucher $600 & Trophy</td>
            </tr>
            <tr className="CA-awards-body-row">
              <td className="CA-awards-cell" id="CA-awards-cell-open">Open (Choreography)</td>
              <td className="CA-awards-cell">Voucher $4000 & Trophy</td>
              <td className="CA-awards-cell">Voucher $1000 & Trophy</td>
              <td className="CA-awards-cell">Voucher $600 & Trophy</td>
            </tr>
            <tr className="CA-awards-body-row">
              <td className="CA-awards-cell" id="CA-awards-cell-kpop">K-Pop (Cover)</td>
              <td className="CA-awards-cell">Voucher $4000 & Trophy</td>
              <td className="CA-awards-cell">Voucher $1000 & Trophy</td>
              <td className="CA-awards-cell">Voucher $600 & Trophy</td>
            </tr>
          </tbody>
        </table>
      </header>

      {/* Registration Form */}
      <form className="CA-form" id="CA-form" onSubmit={handleFormSubmit}>
        <h3>Competition Registration Form</h3>
        <h5>* Required fields</h5>

        {/* Crew Name */}
        <label>
          Crew Name*:
          <input
            type="text"
            name="crewName"
            className="CA-input"
            id="CA-input-crewName"
            value={formData.crewName}
            onChange={handleInputChange}
            required
            placeholder="Enter your crew name"
          />
        </label>
        <br />

        {/* Contact Name */}
        <label>
          Contact Name*:
          <input
            type="text"
            name="contactName"
            className="CA-input"
            id="CA-input-contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
            placeholder="Enter contact name"
          />
        </label>
        <br />

        {/* Contact Number */}
        <label>
          Contact Number*:
          <input
            type="tel"
            name="contactNumber"
            className="CA-input"
            id="CA-input-contactNumber"
            value={formData.contactNumber}
            onChange={(e) => {
              const regex = /^\+852\d{0,8}$/; // Validate format
              if (regex.test(e.target.value)) {
                setFormError("");
                handleInputChange(e);
              } else {
                setFormError("Phone number must start with '+852' and contain up to 8 digits.");
              }
            }}
            required
            placeholder="+852 XXXXXXXX"
          />
        </label>
        {formError && (
          <span className="CA-error" id="CA-error" style={{ color: "red" }}>
            {formError}
          </span>
        )}
        <br />

        {/* Instagram */}
        <label>
          Instagram*:
          <input
            type="text"
            name="instagram"
            className="CA-input"
            id="CA-input-instagram"
            value={formData.instagram}
            onChange={(e) => {
              const updatedValue = "@" + e.target.value.replace(/^@/, "");
              setFormData((prevData) => ({
                ...prevData,
                instagram: updatedValue,
              }));
            }}
            required
            placeholder="Enter Instagram handle"
          />
        </label>
        <br />

        {/* Category */}
        <label>
          Category*:
          <select
            name="category"
            className="CA-select"
            id="CA-select-category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            <option value="U12 (Choreography)">U12 (Choreography)</option>
            <option value="U18 (Choreography)">U18 (Choreography)</option>
            <option value="Open (Choreography)">Open (Choreography)</option>
            <option value="K-Pop (Cover)">K-Pop (Cover)</option>
          </select>
        </label>
        <br />

        {/* Team Members */}
        <label>
          Number of Team Members*:
          <input
            type="number"
            name="teamMembers"
            className="CA-input"
            id="CA-input-teamMembers"
            value={formData.teamMembers}
            onChange={handleInputChange}
            required
            placeholder="Enter number of members"
            min="2"
            max="10"
          />
        </label>
        <br />

        {/* Video URL */}
        <label>
          Video Submission URL*:
          <input
            type="url"
            name="videoURL"
            className="CA-input"
            id="CA-input-videoURL"
            value={formData.videoURL}
            onChange={handleInputChange}
            required
            placeholder="Paste video URL"
          />
        </label>
        <br />

        {/* Transaction Slip */}
        <label>
          Upload Transaction Slip*:
          <input
            type="file"
            name="transactionSlip"
            className="CA-input"
            id="CA-input-transactionSlip"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>
        <br />
        {/* Payment Information */}
        <p className="CA-payment-info" id="CA-payment-info">
          Please indicate your crew name in the remark of the transaction.
        </p>
        <h2 className="CA-payment-heading" id="CA-payment-heading">💎 Registration Fee 💎</h2>
        <p className="CA-payment-details" id="CA-payment-details">
          $150 per member [U12 (Choreography)]<br />
          $180 per member [U18 (Choreography) & K-Pop (Cover)]
        </p>

        {/* Payment Codes Section */}
        <h4 className="CA-payment-code-heading" id="CA-payment-code-heading">Payment Code</h4>
        <div className="CA-payment-codes" id="CA-payment-codes">
          <img
            src="/payment-code1.png"
            alt="Payment Code 1"
            className="CA-payment-code-img"
            id="CA-payment-code-img1"
          />
          <img
            src="/payment-codeFPS2.png"
            alt="Payment Code 2"
            className="CA-payment-code-img"
            id="CA-payment-code-img2"
          />
        </div>


        {/* Submit Feedback */}
        {
          submitStatus && (
            <p
              className={`CA-feedback ${submitStatus.includes("successful") ? "CA-success" : "CA-failure"}`}
              id="CA-feedback"
            >
              {submitStatus}
            </p>
          )
        }

        {/* Buttons */}
        <button className="CA-button" id="CA-button-submit" type="submit">
          Submit
        </button>
        <button className="CA-button CA-button-reset" id="CA-button-reset" type="button" onClick={handleReset}>
          Reset
        </button>
      </form >
    </div >
  );

}
