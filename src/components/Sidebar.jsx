import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaBox,
  FaTruck,
  FaUserFriends,
  FaListUl,
} from "react-icons/fa";
import { useTheme } from "./ThemeContext";
import Logout from "../components/Logout";
import "../styles/sidebar.css";

function Sidebar() {
  const { isDarkMode } = useTheme();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const items = [
    {
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      key: "/dashboard/",
    },

    {
      label: "Order",
      icon: <FaListUl />,
      key: "/dashboard/order",
    },
    {
      label: "Products",
      icon: <FaBox />,
      key: "/dashboard/product",
    },
    {
      label: "Resources",
      icon: <FaTruck />,
      key: "/dashboard/resource",
    },
    {
      label: "Consumers",
      icon: <FaUserFriends />,
      key: "/dashboard/consumer",
    },
    {
      label: "Settings",
      icon: <FaCog />,
      key: "/dashboard/settings",
    },
  ];

  const handleClick = (key) => {
    if (!key.isDropdown) {
      navigate(key);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className={`sidebarpage ${
        isDarkMode ? "sidebarpage--dark" : "sidebarpage--light"
      }`}
    >
      <ul className="sidebarpage__content">
        {items.map((item, index) => (
          <li className="sidebarpage__item" key={index}>
            {item.isDropdown ? (
              <>
                <div className="sidebarpage__link" onClick={toggleDropdown}>
                  {item.icon}
                  <span className="sidebarpage__text">{item.label}</span>
                  {item.dropdownIcon}
                </div>
                <ul
                  className={`sidebarpage__dropdown ${
                    isDropdownOpen ? "sidebarpage__dropdown--open" : ""
                  }`}
                >
                  {item.dropdownItems.map((dropdownItem, idx) => (
                    <li className="sidebarpage__dropdown-item" key={idx}>
                      <Link to={dropdownItem.key}>
                        <span className="sidebarpage__dropdown_text">
                          {dropdownItem.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div
                className="sidebarpage__link"
                onClick={() => handleClick(item.key)}
              >
                {item.icon}
                <span className="sidebarpage__text">{item.label}</span>
              </div>
            )}
          </li>
        ))}

        <li className="sidebarpage__item sidebarpage__item--logout">
          <FaSignOutAlt className="sidebarpage__icon" />
          <span className="sidebarpage__text">
            <Logout />
          </span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
