import React from 'react'
import { useTheme } from '../components/ThemeContext';
import '../styles/maincontent.css'
function MainContent() {
    const { isDarkMode } = useTheme(); 

  return (
    <div className={`main-content-container ${isDarkMode ? 'main-content--dark' : 'main-content--light'}`}>
    dashboard
    
    </div>
  )
}

export default MainContent
