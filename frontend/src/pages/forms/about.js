import React, { useState, useEffect } from "react";
import "./forms.css";

const AboutForm = () => {
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [designer, setDesigner] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  // Fetch existing about content when the component mounts
  useEffect(() => {
    fetch("/public/about")
      .then((response) => response.json())
      .then((data) => {
        setBio(data.bio);
        setContactEmail(data.contactEmail);
        setDesigner(data.designer);
        setPortfolioLink(data.portfolioLink);
      })
      .catch((error) => console.error("Error fetching about content:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedContent = {
      bio,
      contactEmail,
      designer,
      portfolioLink,
    };

    fetch("/admin/about", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContent),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Success:", response);
          alert("About section updated successfully!");
        } else {
          throw new Error("Failed to update about section");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error updating the about section.");
      });
  };

  return (
    <div className="about-form-container">
      <h2 className="text-center">Update About Section</h2>
      <form onSubmit={handleSubmit} className="about-form">
        <div className="form-group">
          <label htmlFor="bio">Artist Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactEmail">Contact Email</label>
          <input
            type="email"
            id="contactEmail"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="designer">Designer</label>
          <input
            type="text"
            id="designer"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="portfolioLink">Portfolio Link</label>
          <input
            type="url"
            id="portfolioLink"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button suse">
          UPDATE
        </button>
      </form>
    </div>
  );
};

export default AboutForm;
