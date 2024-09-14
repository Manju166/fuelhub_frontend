import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './form/Login'
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './components/ThemeContext';
import Register from './form/Register';
import Consumer from './SidebarComp/Consumer';
function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/consumer' element={<Consumer/>}/>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
