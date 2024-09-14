import React from 'react';
import { FaMoon, FaSun, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { useTheme } from './ThemeContext'; 
import logo from '../assets/fleedpanda-logo.png'
import '../styles/navbar.css';

function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme(); 

    return (
        <div className={`navbar ${isDarkMode ? 'navbar--dark' : 'navbar--light'}`}>
           <img src={logo} alt="fleetlogo" />
            <div className="navbar__search-container">
                <input
                    type="text"
                    className="navbar__search-input"
                    placeholder="Search..."
                />
                <FaSearch className="navbar__search-icon" />
            </div>
            
            <div className="navbar__right">
            <button className="navbar__theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <FaSun className="navbar__theme-icon" /> : <FaMoon className="navbar__theme-icon" />}
            </button>
                <FaBell className="navbar__notification-icon" />
                <FaUser className="navbar__user-icon" />
            </div>

        </div>
    );
}

export default Navbar;
