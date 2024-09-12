import React from 'react';
import { FaMoon, FaSun, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import '../styles/navbar.css';
import { useTheme } from './ThemeContext'; // Use the hook to access theme

function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme(); // Use the hook here

    return (
        <div className={`navbar ${isDarkMode ? 'navbar--dark' : 'navbar--light'}`}>
            <button className="navbar__theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun className="navbar__theme-icon" /> : <FaMoon className="navbar__theme-icon" />}
            </button>
            <div className="navbar__search-container">
                <input
                    type="text"
                    className="navbar__search-input"
                    placeholder="Search..."
                />
                <FaSearch className="navbar__search-icon" />
            </div>
            <div className="navbar__right">
                <FaBell className="navbar__notification-icon" />
                <FaUser className="navbar__user-icon" />
            </div>
        </div>
    );
}

export default Navbar;
