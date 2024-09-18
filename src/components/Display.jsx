import { Route, Routes } from "react-router-dom"
import Login from '../form/Login'
import Register from '../form/Register'
import Products from "../SidebarComp/Products"
import Consumer from '../SidebarComp/Consumer'
import Dashboard from "../pages/Dashboard"
import Resource from '../SidebarComp/Resource'
import Maincontent from "./Maincontent"
import {useTheme} from './ThemeContext'
import '../styles/maincontent.css'
const Display = () => {
  const { isDarkMode } = useTheme(); 
  return (
    <div className={`main-content-container ${isDarkMode ? 'main-content--dark' : 'main-content--light'}`}>
    <Maincontent/>
    {/* <Routes>
      <Route path="/product" element={<Products/>}/>
      <Route path="/consumer" element={<Consumer/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/resource" element={<Resource/>}/>
    </Routes> */}
      
    </div>
  )
}

export default Display
