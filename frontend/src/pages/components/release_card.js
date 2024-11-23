import React from "react";
import "./components.css";

const ReleaseCard = ({ release, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="release-card">
      <img
        src={release.artwork}
        alt={`${release.name} cover`}
        className="release-cover"
      />
      <h3 className="release-title">{release.name}</h3>
      <p className="release-date">
        {new Date(release.release_date).toDateString()}
      </p>
      {isAdmin && (
        <div className="admin-buttons">
          <button onClick={() => onEdit(release)} className="card-button">
            Edit
          </button>
          <button
            onClick={() => onDelete(release.id)}
            className="card-button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReleaseCard;
