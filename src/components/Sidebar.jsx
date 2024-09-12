import React from 'react';
import { FaBars, FaTachometerAlt, FaUser, FaCog, FaSignOutAlt, FaBox, FaTruck, FaUserFriends } from 'react-icons/fa';
import '../styles/sidebar.css';
import { useTheme } from './ThemeContext'; 

function Sidebar() {
    // eslint-disable-next-line no-unused-vars
    const { isDarkMode, toggleTheme } = useTheme(); 

    return (
        <div className={`sidebar ${isDarkMode ? 'sidebar--dark' : 'sidebar--light'}`}>
            <button className="sidebar__toggle">
                <FaBars className="sidebar__icon" />
            </button>
            <ul className="sidebar__content">
                <li className="sidebar__item">
                    <FaTachometerAlt className="sidebar__icon" />
                    <span className="sidebar__text">Dashboard</span>
                </li>
                <li className="sidebar__item">
                    <FaUser className="sidebar__icon" />
                    <span className="sidebar__text">Profile</span>
                </li>
                <li className="sidebar__item">
                    <FaBox className="sidebar__icon" />
                    <span className="sidebar__text">Products</span>
                </li>
                <li className="sidebar__item">
                    <FaTruck className="sidebar__icon" />
                    <span className="sidebar__text">Resources</span>
                </li>
                <li className="sidebar__item">
                    <FaUserFriends className="sidebar__icon" />
                    <span className="sidebar__text">Consumers</span>
                </li>
                <li className="sidebar__item">
                    <FaCog className="sidebar__icon" />
                    <span className="sidebar__text">Settings</span>
                </li>
                <li className="sidebar__item sidebar__item--logout">
                    <FaSignOutAlt className="sidebar__icon" />
                    <span className="sidebar__text">Sign out</span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
