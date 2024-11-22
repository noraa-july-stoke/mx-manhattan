import React, { useEffect, useState } from "react";
import "./about_page.css";

const AboutPage = () => {
  const [content, setContent] = useState({
    bio: "",
    contactEmail: "",
    designer: "",
    portfolioLink: "",
  });

  useEffect(() => {
    fetch("/public/about")
      .then((response) => response.json())
      .then((data) => {
        setContent(data);
      })
      .catch((error) => console.error("Error fetching about content:", error));
  }, []);

  return (
    <div className="about-page-container">
      <section className="artist-bio">
        <h2 className="text-center">About</h2>
        <p className="suse text-center">{content.bio}</p>
      </section>
      <section className="artist-contact">
        <h2 className="text-center">Booking/General Inquiries</h2>
        <div className="contact-email suse text-center">
          {content.contactEmail}
        </div>
      </section>

      <footer className="site-footer">
        <p>Website designed and built by {content.designer}.</p>
        <p>~~~~~~</p>
        <p>Site artwork by {content.designer}.</p>
        <p>~~~~~~</p>
        <a
          href={content.portfolioLink}
          target="_blank"
          rel="noopener noreferrer">
          View dev portfolio
        </a>
      </footer>
    </div>
  );
};

export default AboutPage;
