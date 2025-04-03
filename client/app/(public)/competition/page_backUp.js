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

  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({
    crewName: "",
    contactName: "",
    contactNumber: "+852", // Pre-fill "+852"
    instagram: "@", // Pre-fill "@"
    category: "",
    teamMembers: "",
    videoURL: "",
    transactionSlip: null,
  });
  const [formError, setFormError] = useState(""); // Tracks form validation errors
  const [submitStatus, setSubmitStatus] = useState(""); // Feedback for submission status

  // Handle slideshow navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

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
      transactionSlip: file,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

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

    setFormError(""); // Clear existing errors
    setSubmitStatus("Submitting..."); // Set submission status

    try {
      // Prepare form data with FormData for file upload
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]); // Add each field to FormData
      });

      // Send form data to the backend API
      const response = await fetch("http://localhost:3030/competitionApply/submissions", {
        method: "GET",
        body: submissionData, // Use FormData for the request body
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus("Submission successful!"); // Display success message
        setFormData({
          crewName: "",
          contactName: "",
          contactNumber: "+852", // Reset to pre-filled default
          instagram: "@", // Reset to pre-filled default
          category: "",
          teamMembers: "",
          videoURL: "",
          transactionSlip: null,
        }); // Reset form fields
      } else {
        setSubmitStatus("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setSubmitStatus("An error occurred. Please try again later.");
    }
  };

  // Reset the form
  const handleReset = () => {
    setFormData({
      crewName: "",
      contactName: "",
      contactNumber: "+852", // Reset to pre-filled default
      instagram: "@", // Reset to pre-filled default
      category: "",
      teamMembers: "",
      videoURL: "",
      transactionSlip: null,
    });
    setFormError(""); // Clear errors
    setSubmitStatus(""); // Clear submission status
  };
  return (
    <div className="competition-container">
      {/* Slideshow Section */}
      <div className="slideshow-container">
        <div className="slide fade">
          <img src={slides[currentIndex].image} alt={`Slide ${currentIndex + 1}`} />
          {slides[currentIndex].caption && (
            <div className="caption">{slides[currentIndex].caption}</div>
          )}
        </div>
        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      {/* Slideshow navigation dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

      
        {/* Competition Details */}
        <header className="competition-details">
          <h1>XVENGERS Dance Competition</h1>
          <h2>⚖️ Judges ⚖️</h2>
          <p>
            <span>Choreography U12, U18, Open:</span> Regent, Sing Sing & Audience Votes (50%)
            <br />
            <span>K-Pop (Cover):</span> Seliny & Audience Votes (50%)
          </p>
          <h2>🕺🏽 Remarks For Dancers 💃🏾</h2>
          <p>
            2-10 members per team
            <br />
            Each member can join 2 teams at most
            <br />
            U12 members can join U18 category
            <br />
            Documents for age validation required upon entering finals
          </p>
          <h2>🚨 Finals 🚨</h2>
          <p>
            Top 5 of each category enter finals
            <br />
            Results announced: <span>Mar 28, 2025</span>
            <br />
            Ticketing info will be announced soon
          </p>
          <h2>📍 Venue & Date</h2>
          <p>
            <span>📍 Vessel 01, Kwun Tong</span>
            <br />
            <span>🗓 April 4, 2025</span>
          </p>
          <h2>🏆 Awards & Prizes 🏆</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>1st Place</th>
                <th>2nd Place</th>
                <th>3rd Place</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>U12 (Choreography)</td>
                <td>Voucher $3000 & Trophy</td>
                <td>Voucher $800 & Trophy</td>
                <td>Voucher $500 & Trophy</td>
              </tr>
              <tr>
                <td>U18 (Choreography)</td>
                <td>Voucher $4000 & Trophy</td>
                <td>Voucher $1000 & Trophy</td>
                <td>Voucher $600 & Trophy</td>
              </tr>
              <tr>
                <td>Open (Choreography)</td>
                <td>Voucher $4000 & Trophy</td>
                <td>Voucher $1000 & Trophy</td>
                <td>Voucher $600 & Trophy</td>
              </tr>
              <tr>
                <td>K-Pop (Cover)</td>
                <td>Voucher $4000 & Trophy</td>
                <td>Voucher $1000 & Trophy</td>
                <td>Voucher $600 & Trophy</td>
              </tr>
            </tbody>
          </table>
        </header>


      {/* Registration Form */}
      <form onSubmit={handleFormSubmit}>
        <h3>Hi, welcome to the competition registration</h3>
        <h5>The items marked with * must be filled out.</h5>

        {/* Crew Name */}
        <label>
          Crew Name*:
          <input
            type="text"
            name="crewName"
            placeholder="Enter your crew name"
            required
            value={formData.crewName}
            onChange={handleInputChange}
          />
        </label>
        <br />

        {/* Contact Person Name */}
        <label>
          (Contact Person) Name*:
          <input
            type="text"
            name="contactName"
            placeholder="e.g. Mike CHAN"
            required
            value={formData.contactName}
            onChange={handleInputChange}
          />
        </label>
        <br />

        {/* Contact Person Number */}
        <label>
          (Contact Person) Whatsapp/Signal Contact*:
          <input
            type="tel"
            name="contactNumber"
            placeholder="+852 12345678"
            value={formData.contactNumber}
            required
            onChange={(e) => {
              const value = e.target.value;
              const regex = /^\+852\d{0,8}$/;

              if (regex.test(value)) {
                setFormError(""); // Clear error if valid
                handleInputChange(e);
              } else {
                setFormError(
                  "Phone number must start with '+852' and be followed by up to 8 digits."
                );
              }
            }}
          />
        </label>
        {formError && (
          <span style={{ color: "red", fontSize: "0.9rem" }}>{formError}</span>
        )}
        <br />

        {/* Contact Person Instagram */}
        <label>
          (Contact Person) Instagram*:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              name="instagram"
              placeholder="Enter Instagram handle"
              required
              style={{ flex: 1, marginLeft: "5px" }}
              value={formData.instagram}
              onChange={(e) => {
                const newValue = "@" + e.target.value.replace(/^@/, ""); // Ensure "@" is always prefixed
                handleInputChange({ target: { name: "instagram", value: newValue } });
              }}
            />
          </div>
        </label>
        <br />
        <label htmlFor="CategoryTypes">Category*:</label>
        <div id="CategoryTypes">
          <label>
            <input
              type="radio"
              name="category"
              value="U12 (Choreography)"
              required
              checked={formData.category === "U12 (Choreography)"}
              onChange={handleInputChange}
            />
            U12 (Choreography)
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="category"
              value="U18 (Choreography)"
              required
              checked={formData.category === "U18 (Choreography)"}
              onChange={handleInputChange}
            />
            U18 (Choreography)
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="category"
              value="Open (Choreography)"
              required
              checked={formData.category === "Open (Choreography)"}
              onChange={handleInputChange}
            />
            Open (Choreography)
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="category"
              value="K-Pop (Cover)"
              required
              checked={formData.category === "K-Pop (Cover)"}
              onChange={handleInputChange}
            />
            K-Pop (Cover)
          </label>
        </div>
        <br />

        {/* Other form fields (Category, Team Members, etc.) */}
        <label>
          Number of Team Members*:
          <input
            type="number"
            name="teamMembers"
            placeholder="Enter number of members"
            min="2"
            max="10"
            required
            value={formData.teamMembers}
            onChange={handleInputChange}
          />
        </label>
        <br />

        
         {/* Video Submission */}
         <label>
         Video Submission (URL)*:
         <input
           type="url"
           name="videoURL"
           placeholder="Paste video URL"
           required
           onChange={handleInputChange}
         />
       </label>
       <br />

       {/* Transaction Slip */}
       <label>
          Please upload your transaction slip*:
          <input
            type="file"
            name="transactionSlip"
            accept="image/*"
            required
            onChange={handleFileChange} // Handle file separately
          />
        </label>
        <br />

       {/* Payment Information */}
       <p>Please indicate your crew name in the remark of the transaction.</p>
       <h2>💎 Registration Fee 💎</h2>
       <p>
         $150 per member [U12 (Choreography)]<br />
         $180 per member [U18 (Choreography) & K-Pop (Cover)]
       </p>

       {/* Payment Codes Section */}
       <h4>Payment Code</h4>
       <div className="payment-codes">
         <img
           src="/images/payment-code1.png"
           alt="Payment Code 1"
           className="payment-code-img"
         />
         <img
           src="/images/payment-code2.png"
           alt="Payment Code 2"
           className="payment-code-img"
         />
       </div>

        {/* Submission Status */}
        {submitStatus && (
          <p style={{ color: submitStatus.includes("successful") ? "green" : "red" }}>
            {submitStatus}
          </p>
        )}

        {/* Submit and Reset Buttons */}
        <button type="submit">Submit</button>
        <button type="reset" onClick={handleReset}>
          Reset
        </button>
      </form>
    </div>
  );
}
