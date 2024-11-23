import React from "react";
import "./home_page.css";
import mxLogo from "../../assets/images/mx-logo.png";
import instagramIcon from "../../assets/images/instagram-icon.png";
import spotifyIcon from "../../assets/images/spotify.png";
import appleMusicIcon from "../../assets/images/apple-music.png";
import youtubeIcon from "../../assets/images/youtube.png";
import lilGhost from "../../assets/images/lil-ghost.png";

const HomePage = () => {
  return (
    <div className="homepage-container rubik-mono-one">
      <section className="logo-section">
        <img classwName="artist-logo" src={mxLogo} alt="mx. manhattan's logo" />
      </section>

      <section className="social-media-section">
        <div className="social-media-links">
          <h2 className="section-heading">Follow Us On... </h2>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
          </a>
          <a
            href="https://www.spotify.com"
            target="_blank"
            rel="noopener noreferrer">
            <img src={spotifyIcon} alt="Spotify" className="social-icon" />
          </a>
          <a
            href="https://www.apple.com/music"
            target="_blank"
            rel="noopener noreferrer">
            <img
              src={appleMusicIcon}
              alt="Apple Music"
              className="social-icon"
            />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer">
            <img src={youtubeIcon} alt="YouTube" className="social-icon" />
          </a>
        </div>
      </section>
      <section className="ghost-section">
        <img className="ghost-pic" src={lilGhost} alt="mx. manhattan's logo" />
      </section>
      {/* <section className="cta-section">
        <h2 className="cta-heading">Join Our Email List</h2>
        <p className="cta-text">
          Stay updated with the latest news, releases, and more!
        </p>
        <form className="cta-form">
          <input
            type="email"
            className="cta-input rubik-mono-one"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="cta-button rubik-mono-one">
            Subscribe
          </button>
        </form>
      </section> */}

      {/* <section className="latest-release-section">
        <h2 className="section-heading">Latest Release</h2>
        <div className="latest-release-content">
          <img
            src="placeholder-image-url"
            alt="Latest Release Cover"
            className="release-cover"
          />
          <p className="release-title">Placeholder Song Name</p>
        </div>
      </section> */}

      {/* <section className="video-section">
        <h2 className="section-heading">Latest Music Video</h2>
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/your-video-id"
            title="Latest Music Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>
        </div>
      </section> */}

      {/* <section className="news-feed-section">
        <h2 className="section-heading">Latest News</h2>
        <div className="news-feed">
          <div className="news-card">
            <h3 className="news-title">Concert Announcement</h3>
            <p className="news-text">We are performing at [Venue] on [Date]!</p>
          </div>
          <div className="news-card">
            <h3 className="news-title">New Blog Post</h3>
            <p className="news-text">
              Check out our latest thoughts on [Topic]!
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;
