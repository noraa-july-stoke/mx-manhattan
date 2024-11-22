import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { DashboardMenu } from "../components";
import { AboutForm, ReleaseForm } from "../forms";
import "./admin_page.css";

const AdminPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleBackToDashboard = () => {
    setSelectedOption(null);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "updateAbout":
        return (
          <>
            <AboutForm />
            <DashboardButton handleClick={handleBackToDashboard} />
          </>
        );
      case "addRelease":
        return (
          <>
            <ReleaseForm />
            <DashboardButton handleClick={handleBackToDashboard} />
          </>
        );
      case "addBlogPost":
        // return <AddBlogPostForm />; // AddBlogPostForm component should be created
        return <div>Blog Post Form Goes Here</div>;
      case "retrieveEmails":
        // return <RetrieveEmails />; // RetrieveEmails component should be created
        return <div>Retrieve Emails Component Goes Here</div>;
      // Add more cases as needed for other menu items
      default:
        return <DashboardMenu onSelect={handleSelect} />;
    }
  };

  return <div className="admin-page suse">{renderContent()}</div>;
};

const DashboardButton = ({ handleClick }) => {
  return (
    <button className="back-to-dashboard" onClick={handleClick}>
      BACK TO DASHBOARD
    </button>
  );
};

export default AdminPage;
