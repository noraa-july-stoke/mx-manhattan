import React, { useState, useEffect } from "react";
import axios from "axios";
import "./releases.css"; // Create this stylesheet for styling

const Releases = () => {
  const [releases, setReleases] = useState([]);
  const [error, setError] = useState(null); // State to hold error information

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        // Step 1: Get the Access Token
        const authResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${btoa(
                `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`
              )}`,
            },
          }
        );

        const accessToken = authResponse.data.access_token;

        // Step 2: Fetch Releases Data
        const response = await axios.get(
          "https://api.spotify.com/v1/artists/4jeYssXlnt1bHf11jogjhN/albums",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setReleases(response.data.items);
      } catch (error) {
        setError(error);
        console.error("Error fetching Spotify data:", error);
        if (error.response) {
          // The request was made, and the server responded with a status code outside the range of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made, but no response was received
          console.error("Request data:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      }
    };

    fetchReleases();
  }, []);

  return (
    <div className="spotify-releases-container">
      {error ? (
        <div className="error-message">
          <p>
            There was an error fetching the releases. Please try again later.
          </p>
        </div>
      ) : (
        releases.map((release) => (
          <div key={release.id} className="release-card">
            <img
              src={release.images[0]?.url}
              alt={`${release.name} cover`}
              className="release-cover"
            />
            <h3 className="release-title">{release.name}</h3>
            <p className="release-date">
              {new Date(release.release_date).toDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Releases;
