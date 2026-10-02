import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import MobileNav from '../common/MobileNav';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ activeTab, setActiveTab, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const role = user?.role || 'customer';

  // Dynamic Background Class based on user role
  let bgClass = 'bg-customer-dashboard';
  if (role === 'labour') {
    bgClass = 'bg-labour-dashboard';
  } else if (role === 'admin') {
    bgClass = 'bg-admin-dashboard';
  }

  return (
    <div className={`min-h-screen ${bgClass} text-slate-100 flex overflow-x-hidden relative`}>
      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 relative z-10">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Bottom Nav on Mobile */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DashboardLayout;
