import React, { useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import "../styles/maincontent.css";
import { ReactTyped } from "react-typed";
import { Link } from "react-router-dom";
function MainContent() {
  const { isDarkMode } = useTheme();
  const typedRef = useRef(null);
  const handleTypingComplete = () => {
    if (typedRef.current) {
      typedRef.current.reset();
    }
  };

  return (
    <div
      className={`main-content-container ${
        isDarkMode ? "main-content--dark" : "main-content--light"
      }`}
    >
      <div className="dashboard_container">
        <div className="text-dash">
          <div className="dashboard-heading">
            <ReactTyped
              strings={["Welcome to dashboard !!!", "Welcome to FUELHUB !!!"]}
              typeSpeed={30}
              loop
              onComplete={handleTypingComplete}
            />
          </div>
          <div className="breadcrumb">
            <span>
              <Link to="/">Dashboard</Link>
            </span>{" "}
            /{" "}
            <Link to="/consumer">
              <span>Consumer List</span>{" "}
            </Link>
          </div>
          <div className="dashboard_card">
            <div className="dashboard_card-box">
              <div className="dashboard_card-box_item">
                <p>235</p>
                <p>Total Menu</p>
              </div>
              <div className="dashboard_card-box_item">
                <p>235</p>
                <p>Total Order</p>
              </div>
              <div className="dashboard_card-box_item">
                <p>235</p>
                <p>Pending Order</p>
              </div>
              <div className="dashboard_card-box_item">
                <p>235</p>
                <p>Canceled Order</p>
              </div>
              <div className="dashboard_card-box_item">
                <p>235</p>
                <p>Complete Order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
