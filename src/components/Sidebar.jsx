import React from 'react';
import { FaBars, FaTachometerAlt, FaUser, FaCog, FaSignOutAlt, FaBox, FaTruck, FaUserFriends } from 'react-icons/fa';
import '../styles/sidebar.css';
import { useTheme } from './ThemeContext'; 
import Logout from '../components/Logout'
import { Link } from 'react-router-dom';
function Sidebar() {
    const { isDarkMode } = useTheme(); 

    return (
        <div className={`sidebar ${isDarkMode ? 'sidebar--dark' : 'sidebar--light'}`}>
            <button className="sidebar__toggle">
                <FaBars className="sidebar__icon" />
            </button>
            <ul className="sidebar__content">
                <li className="sidebar__item">
                <Link to="/maincontent">
                    <FaTachometerAlt className="sidebar__icon" />
                    <span className="sidebar__text">Dashboard</span>
                </Link>
                </li>
                <li className="sidebar__item">
                    <FaUser className="sidebar__icon" />
                    <span className="sidebar__text">Profile</span>
                </li>
                <li className="sidebar__item">
                <Link to="/product" className='sidebar__link'>
                    <FaBox className="sidebar__icon" />
                    <span className="sidebar__text">Products</span>
                </Link>
                </li>
                <li className="sidebar__item">
                <Link to="/resource" className='sidebar__link'>
                    <FaTruck className="sidebar__icon" />
                    <span className="sidebar__text">Resources</span>
                </Link>
                </li>
                <li className="sidebar__item">
                <Link to="/consumer" className="sidebar__link">
                        <FaUserFriends className="sidebar__icon" />
                        <span className="sidebar__text">Consumers</span>
                    </Link>
                </li>
                <li className="sidebar__item">
                <Link to="/order" className="sidebar__link">
                        <FaUserFriends className="sidebar__icon" />
                        <span className="sidebar__text">Order Group</span>
                    </Link>
                </li>
                <li className="sidebar__item">
                    <FaCog className="sidebar__icon" />
                    <span className="sidebar__text">Settings</span>
                </li>
                <li className="sidebar__item sidebar__item--logout">
                    <FaSignOutAlt className="sidebar__icon" />
                    <span className="sidebar__text">
                    <Logout/>
                    </span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
