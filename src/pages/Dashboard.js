import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../App.css';
import Maincontent from '../components/Maincontent';

function Dashboard() {
  return (
    <div className="app">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Maincontent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
