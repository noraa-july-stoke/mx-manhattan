import React from "react";
import { Link } from "react-router-dom"; // Use Link for internal navigation
import "./components.css";

const Navbar = ({ token }) => {
  return (
    <nav className="navbar rubik-mono-one">
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            Home
          </Link>
        </li>
        {/* <li className="navbar-item">
          <Link to="/releases" className="navbar-link">
            Releases
          </Link>
        </li> */}
        {/* <li className="navbar-item">
          <Link to="/live" className="navbar-link">
            Live
          </Link>
        </li> */}
        <li className="navbar-item">
          <Link to="/videos" className="navbar-link">
            Videos
          </Link>
        </li>
        {/* <li className="navbar-item">
          <Link to="/press" className="navbar-link">
            Press
          </Link>
        </li> */}
        {/* <li className="navbar-item">
          <Link to="/store" className="navbar-link">
            Store
          </Link>
        </li> */}
        {/* <li className="navbar-item">
          <Link to="/blog" className="navbar-link">
            Blog
          </Link>
        </li> */}
        <li className="navbar-item">
          <Link to="/about" className="navbar-link">
            About
          </Link>
        </li>
        {/* {token && ( // Conditionally render the "Dashboard" link if the admin is logged in
          <li className="navbar-item">
            <Link to="/admin/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </li>
        )} */}
      </ul>
    </nav>
  );
};

export default Navbar;
