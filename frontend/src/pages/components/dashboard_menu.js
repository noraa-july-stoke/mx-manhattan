import React from "react";
import { useNavigate } from "react-router-dom";

import "./components.css";

const DashboardMenu = ({ onSelect }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-menu">
      <h2>ADMIN DASHBOARD</h2>
      <ul className="dashboard-menu-list">
        <li
          className="dashboard-menu-item"
          onClick={() => onSelect("updateAbout")}>
          UPDATE ABOUT SECTION
        </li>
        {/* <li
          className="dashboard-menu-item"
          onClick={() => onSelect("addBlogPost")}>
          ADD BLOG POST
        </li> */}
        <li
          className="dashboard-menu-item"
          onClick={() => onSelect("retrieveEmails")}>
          RETRIEVE & DOWNLOAD FAN EMAIL DATA
        </li>
        {/* <li
          className="dashboard-menu-item"
          onClick={() => onSelect("sendFanEmail")}>
          SEND FAN EMAIL
        </li> */}
        {/* <li
          className="dashboard-menu-item"
          onClick={() => onSelect("sendPitchEmail")}>
          PITCH RELEASE
        </li> */}
        <li
          className="dashboard-menu-item"
          onClick={() => onSelect("addNewsItem")}>
          CUSTOM NEWS ITEM
        </li>
        {/* <li
          className="dashboard-menu-item"
          onClick={() => onSelect("addPressBlurb")}>
          ADD PRESS BLURB
        </li> */}
        <li
          className="dashboard-menu-item"
          onClick={() => onSelect("addRelease")}>
          ADD NEW RELEASE
        </li>
        <li className="dashboard-menu-item" onClick={() => onSelect("addShow")}>
          ADD SHOW DATE(S)
        </li>
        {/* <li
          className="dashboard-menu-item"
          onClick={() => onSelect("addMerchItem")}>
          ADD STORE ITEM
        </li> */}
        <li
          className="dashboard-menu-item"
          onClick={() => onSelect("addVideo")}>
          ADD VIDEO
        </li>
      </ul>
      <button onClick={handleLogout} className="logout-button suse">
        LOGOUT
      </button>
    </div>
  );
};

export default DashboardMenu;
