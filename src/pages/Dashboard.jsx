import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Products from '../SidebarComp/Products';
import Consumer from '../SidebarComp/Consumer';
import ConsumerBranch from '../SidebarComp/ConsumerBranch';
import Resource from '../SidebarComp/Resource';
import OrderList from '../SidebarComp/order/OrderList';
import '../styles/dashboard.css';
import Footer from '../components/Footer';
import MainContent from '../SidebarComp/MainContent';
import { useTheme } from '../components/ThemeContext';

function Dashboard() {
  const { isDarkMode } = useTheme(); 

  return (
    <div className={`whole-box  ${isDarkMode ? 'whole-box--dark' : 'whole-box--light'}`}>
      <div className='nav'>
        <Navbar />
      </div>

      <div className='main-div'>
        <div className='sidebarpage'>
          <Sidebar />
        </div>
        <div className='display'>
          <Routes>
            <Route path='/' element={<MainContent/>} />
            <Route path='product' element={<Products />} />
            <Route path='consumer' element={<Consumer />} />
            <Route path='resource' element={<Resource />} />
            <Route path='orderList' element={<OrderList />} />
          </Routes>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Dashboard;
