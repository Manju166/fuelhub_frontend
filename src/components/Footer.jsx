import React from 'react'
import '../styles/footer.css'
import { useTheme } from './ThemeContext';
 const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`footer ${isDarkMode ? 'footer--dark' : 'footer--light'}`}>
      <p>Copyright ©2024 FuelHub Pvt Ltd. All rights reserved.</p>
    </div>
  )
}
export default Footer
