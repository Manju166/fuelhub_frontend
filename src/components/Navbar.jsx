import React from 'react';
import { FaMoon, FaSun, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { useTheme } from './ThemeContext'; 
import logo from '../assets/image.png';
import '../styles/navbar.css';

function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme(); 

    return (
        <div className={`navbar ${isDarkMode ? 'navbar--dark' : 'navbar--light'}`}>
           <img src={logo} alt="fuelhub" />
            
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
