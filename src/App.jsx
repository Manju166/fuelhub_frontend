import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './form/Login'
import { ThemeProvider } from './components/ThemeContext';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoutes';
import Register from './form/Register';
import Consumer from './SidebarComp/Consumer';
import Maincontent from './components/Maincontent';
import Resource from './SidebarComp/Resource';
import Products from './SidebarComp/Products';
import ConsumerBranch from './SidebarComp/ConsumerBranch';
function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route element={<PrivateRoute/>}>
        <Route path='/dashboard/*' element={<Dashboard/>} />
        <Route path='/maincontent' element={<Maincontent/>}/>
        <Route path='/product' element={<Products/>}/>
        <Route path='/consumer' element={<Consumer/>}/>
        <Route path="/consumerbranch/:consumerId" element={<ConsumerBranch />} />
        <Route path='/resource' element={<Resource/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App



