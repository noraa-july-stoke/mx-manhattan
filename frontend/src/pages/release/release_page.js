import React from "react";
import "./release_page.css";

const ReleasePage = ({ title, artist, links, coverArt }) => {
  return (
    <div className="song-page">
      <main>
        <h1>{title}</h1>
        <div className="link-container">
          {links.map((link, index) => (
            <a
              href={link.url}
              className="link"
              key={index}
              target="_blank"
              rel="noopener noreferrer">
              <div className="link-background">
                <img src={link.icon} alt={link.name} className="icon" />
              </div>
              {link.name}
            </a>
          ))}
        </div>
      </main>
      <img src={coverArt} alt="Album Cover" id="cover_img" />
    </div>
  );
};

export default ReleasePage;




// usage for the release page
// import ReleasePage from "../release/release_page";
// import appleMusicIcon from "../../assets/images/apple-music.png";
// import spotifyIcon from "../../assets/images/spotify.png";
// import youtubeIcon from "../../assets/images/youtube.png";
// import coverArt from "../../assets/images/cover-art.png";
//   const songLinks = [
//     {
//       url: "https://music.apple.com/us/album/you-will-never-haunt-me/1741003932?i=1741003933",
//       name: "Apple Music",
//       icon: appleMusicIcon,
//     },
//     {
//       url: "https://open.spotify.com/track/49GA3xPuT9zJJXpuvB93o9?si=386db8ffec304d76",
//       name: "Spotify",
//       icon: spotifyIcon,
//     },
//     {
//       url: "https://www.youtube.com/watch?v=JO_RNLmhpAg",
//       name: "YouTube",
//       icon: youtubeIcon,
//     },
//   ];

//   const artwork = "";
//   return (
//     <ReleasePage
//       title="You Will Never Haunt Me"
//       artist="Mx. Manhattan"
//       links={songLinks}
//       coverArt={coverArt}
//     />
//   );
