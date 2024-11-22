import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forms.css"; // General form styles

const ReleaseForm = ({ release, setEditingRelease }) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    releaseDate: "",
    artwork: "",
    spotifyUrl: "",
    youtubeUrl: "",
    appleMusicUrl: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (release) {
      setFormData({
        id: release.id || 0,
        name: release.name || "",
        releaseDate: release.release_date || "",
        artwork: release.artwork || "",
        spotifyUrl: release.spotifyUrl || "",
        youtubeUrl: release.youtubeUrl || "",
        appleMusicUrl: release.appleMusicUrl || "",
      });
    }
  }, [release]);

  const handleSpotifyUrlChange = async (e) => {
    const spotifyUrl = e.target.value;
    setFormData({
      ...formData,
      spotifyUrl,
    });

    if (spotifyUrl) {
      try {
        const spotifyId = extractSpotifyId(spotifyUrl);
        const contentType = getSpotifyContentType(spotifyUrl);

        if (!spotifyId || !contentType) {
          setError("Invalid Spotify URL. Please check the URL.");
          return;
        }

        // Fetch the Spotify token
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

        // Make the correct API request based on content type
        const response = await axios.get(
          `https://api.spotify.com/v1/${contentType}/${spotifyId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Depending on the content type, adjust how data is retrieved
        let name, release_date, images;

        if (contentType === "albums" || contentType === "tracks") {
          name = response.data.name;
          release_date =
            response.data.release_date || response.data.album.release_date;
          images = response.data.images || response.data.album.images;
        } else if (contentType === "playlists") {
          name = response.data.name;
          release_date = "N/A"; // Playlists don't have release dates
          images = response.data.images;
        }

        setFormData({
          ...formData,
          name,
          releaseDate: release_date,
          artwork: images[0]?.url,
          spotifyUrl,
        });
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
        setError(
          "Failed to retrieve data from Spotify. Please check the URL or try again later."
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update the existing release
        const response = await axios.put(
          `/admin/releases/${formData.id}`,
          formData
        );
        console.log("Release updated successfully:", response.data);
      } else {
        // Add a new release
        const response = await axios.post("/admin/releases", formData);
        console.log("Release added successfully:", response.data);
      }
      setEditingRelease(null); // Exit editing mode after submission
    } catch (error) {
      console.error("Error saving release:", error);
      setError("There was an error saving the release. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/releases/${formData.id}`);
      console.log("Release deleted successfully");
      setEditingRelease(null); // Exit editing mode after deletion
    } catch (error) {
      console.error("Error deleting release:", error);
      setError("There was an error deleting the release.");
    }
  };

  const extractSpotifyId = (spotifyUrl) => {
    const match = spotifyUrl.match(
      /(?:album|track|playlist)\/([a-zA-Z0-9]+)(?:\?|$)/
    );
    return match ? match[1] : null;
  };

  const getSpotifyContentType = (spotifyUrl) => {
    if (spotifyUrl.includes("/album/")) return "albums";
    if (spotifyUrl.includes("/track/")) return "tracks";
    if (spotifyUrl.includes("/playlist/")) return "playlists";
    return null;
  };

  return (
    <div className="form-container">
      <h2>{formData.id ? "Edit Release" : "Add New Release"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="spotifyUrl">Spotify URL</label>
          <input
            type="text"
            id="spotifyUrl"
            name="spotifyUrl"
            value={formData.spotifyUrl}
            onChange={handleSpotifyUrlChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="youtubeUrl">YouTube URL</label>
          <input
            type="text"
            id="youtubeUrl"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="appleMusicUrl">Apple Music URL</label>
          <input
            type="text"
            id="appleMusicUrl"
            name="appleMusicUrl"
            value={formData.appleMusicUrl}
            onChange={handleChange}
          />
        </div>
        {formData.name && (
          <div className="release-preview">
            <h3>{formData.name}</h3>
            <p>{new Date(formData.releaseDate).toDateString()}</p>
            <img src={formData.artwork} alt={`${formData.name} cover`} />
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button">
          {formData.id ? "Update Release" : "Add Release"}
        </button>
        {formData.id && (
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}>
            Delete Release
          </button>
        )}
      </form>
    </div>
  );
};

export default ReleaseForm;
