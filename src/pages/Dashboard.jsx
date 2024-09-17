import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Display from '../components/Display'
import '../styles/dashboard.css'
import { Route, Routes } from 'react-router-dom'
import Maincontent from '../components/Maincontent'
import Products from '../SidebarComp/Products'
import Consumer from '../SidebarComp/Consumer'
import CustomerBranch from '../SidebarComp/ConsumerBranch'
import Resource from '../SidebarComp/Resource'
function Dashboard() {
  return (
  <>
     <div className='whole-box'>
    <div className='nav'>
    <Navbar/>
    </div>

     <div className='main-div'>
    
    <div className='sidebar'><Sidebar/></div>
    <div className='display'><Display/></div>
     </div>
    </div>


{/* <Routes>
<Route path='/maincontent' element={<Maincontent/>}/>
        <Route path='/product' element={<Products/>}/>
        <Route path='/consumer' element={<Consumer/>}/>
        <Route path="/customerbranch/:id" element={<CustomerBranch />} />
        <Route path='/resource' element={<Resource/>}/>
</Routes> */}
  </>
    
  )
}

export default Dashboard
