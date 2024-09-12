import React from 'react';
import { useTheme } from './ThemeContext';
import '../styles/maincontent.css';

function Maincontent() {
    const { isDarkMode } = useTheme(); 

    return (
        <div className={`main-content-container ${isDarkMode ? 'main-content--dark' : 'main-content--light'}`}>
            <h1>Main Content</h1>
            <p>This is the main content area. The theme will be applied based on the current mode.</p>
        </div>
    );
}

export default Maincontent;
