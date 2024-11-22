import React, { useState, useEffect } from "react";
import axios from "axios";
import "./releases.css"; // Styles for the Releases component
import { ReleaseCard } from "../components"; // Import ReleaseCard
import { ReleaseForm } from "../forms";

const Releases = () => {
  const [releases, setReleases] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // Simulate admin state for testing
  const [editingRelease, setEditingRelease] = useState(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await axios.get("/public/releases");
        setReleases(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchReleases();
  }, []);

  const handleEdit = (release) => {
    setEditingRelease(release); // Set the release data for editing
  };

  const handleDelete = async (releaseId) => {
    try {
      await axios.delete(`/admin/releases/${releaseId}`);
      setReleases(releases.filter((release) => release.id !== releaseId));
    } catch (error) {
      console.error("Error deleting release:", error);
    }
  };

  return (
    <div className="releases-container">
      {error ? (
        <div className="error-message">
          <p>
            There was an error fetching the releases. Please try again later.
          </p>
        </div>
      ) : (
        <>
          {editingRelease ? (
            <ReleaseForm
              release={editingRelease}
              setEditingRelease={setEditingRelease}
            />
          ) : (
            releases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Releases;
