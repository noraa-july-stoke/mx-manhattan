import React, { useState } from "react";
import "./videos_page.css";

const VideosPage = () => {
  const [modalVideo, setModalVideo] = useState(null);

  // Add thumbnail URLs alongside video links
  const videos = [
    {
      link: "https://www.youtube.com/embed/VVuduiBXWg8?si=cAoSwtfq0kbIl9Na",
      thumbnail: "https://img.youtube.com/vi/VVuduiBXWg8/hqdefault.jpg", // YouTube API thumbnail
    },
  ];

  const closeModal = () => setModalVideo(null);

  return (
    <div className="videos-page">
      <div className="video-list">
        {videos.map((video, index) => (
          <div
            key={index}
            className="video-item"
            style={{ backgroundImage: `url(${video.thumbnail})` }} // Set background image
            onClick={() => setModalVideo(video.link)}>
            {/* Optional overlay for text */}
            <div className="video-overlay">
              <p>Video {index + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {modalVideo && (
        <div className="video-modal">
          <button className="modal-close" onClick={closeModal}>
            &times;
          </button>
          <iframe
            src={modalVideo}
            title="Video Modal"
            allowFullScreen
            className="modal-iframe"></iframe>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
