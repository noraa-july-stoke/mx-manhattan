import React from "react";
import "./about_page.css";

// import artistImage from "../../assets/images/artist-image.jpg";
// const AboutPage = () => {
//   // Hardcoded content
//   const content = {
//     bio: "Mx Manhattan is the project of musician Noraa Stoke, a singer-songwriter, producer, multi instrumentalist, and visual artist. Noraa blends haunting, surreal lyrics with an indie pop and emo rock sound. With each song, Mx Manhattan captures moments of intense emotion, transforming them into powerful soundscapes that resonate deeply. Acting as a musical diary of sorts, Mx Manhattan's dreamlike work explores themes of mental health, love, loss, longing, and hope through lush instrumentals and poignant, disoriented lyricism, inviting listeners to experience the same emotions that inspired each track. For those seeking music with depth and raw beauty, Mx Manhattan is a project not to miss.",
//     contactEmail: "mx.manhattan.band@gmail.com",
//     designer: "Noraa July Stoke",
//     portfolioLink: "noraa-july-stoke.github.io",
//   };

//   return (
//     <div className="about-page-container">
//       <section className="artist-bio">
//         <h2 className="text-center">About</h2>
//         <img src={artistImage} alt="Artist" className="artist-image" />
//         <p className="suse text-center">{content.bio}</p>
//       </section>
//       <section className="artist-contact">
//         <h2 className="text-center">Booking/General Inquiries</h2>
//         <div className="contact-email suse text-center">
//           {content.contactEmail}
//         </div>
//       </section>

//       <footer className="site-footer">
//         <p> Website and artwork by {content.designer}.</p>
//         <a
//           href={content.portfolioLink}
//           target="_blank"
//           rel="noopener noreferrer">
//           View my developer portfolio
//         </a>
//       </footer>
//     </div>
//   );
// };

const AboutPage = () => {
  const content = {
    bio: "Mx Manhattan is the project of musician Noraa Stoke, a singer-songwriter, producer, multi instrumentalist, and visual artist. Noraa blends haunting, surreal lyrics with an indie pop and emo rock sound. With each song, Mx Manhattan captures moments of intense emotion, transforming them into powerful soundscapes that resonate deeply. Acting as a musical diary of sorts, Mx Manhattan's dreamlike work explores themes of mental health, love, loss, longing, and hope through lush instrumentals and poignant, disoriented lyricism, inviting listeners to experience the same emotions that inspired each track. For those seeking music with depth and raw beauty, Mx Manhattan is a project not to miss.",
    contactEmail: "mx.manhattan.band@gmail.com",
    designer: "Noraa July Stoke",
    portfolioLink: "https://noraa-july-stoke.github.io",
  };

  return (
    <div className="about-page-container">
      <div className="overlay">
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
          <p>Website and artwork by {content.designer}.</p>
          <a
            href={content.portfolioLink}
            target="_blank"
            rel="noopener noreferrer">
            View my developer portfolio
          </a>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
