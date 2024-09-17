import { Route, Routes } from "react-router-dom"
import Login from '../form/Login'
import Register from '../form/Register'
import Products from "../SidebarComp/Products"
import Consumer from '../SidebarComp/Consumer'
import Dashboard from "../pages/Dashboard"
import Resource from '../SidebarComp/Resource'
import Maincontent from "./Maincontent"
const Display = () => {
  return (
    <>
    <Maincontent/>
    <Routes>
      <Route path="/product" element={<Products/>}/>
      <Route path="/consumer" element={<Consumer/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/resource" element={<Resource/>}/>
    </Routes>
      
    </>
  )
}

export default Display
