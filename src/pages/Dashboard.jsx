import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../App.css';
import Maincontent from '../components/Maincontent';
import Consumer from '../SidebarComp/Consumer';

function Dashboard() {
  return (
    <div className="app">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          {/* <Maincontent /> */}
          <Consumer/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
