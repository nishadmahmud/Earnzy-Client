import React from 'react';
import { useUserData } from '../../hooks/useUserData';
import BuyerHome from './Buyer/BuyerHome';
import WorkerHome from './Wroker/WorkerHome';
import AdminHome from './Admin/AdminHome';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const DashboardHome = () => {
  const { data: userData } = useUserData();
  
  const role = userData?.role || 'worker';

  // Set appropriate title based on role
  const getTitle = () => {
    switch (role) {
      case 'buyer':
        return 'Buyer Dashboard';
      case 'worker':
        return 'Worker Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  useDocumentTitle(getTitle());

  // Render role-specific home component
  const renderRoleHome = () => {
    switch (role) {
      case 'buyer':
        return <BuyerHome />;
      case 'worker':
        return <WorkerHome />;
      case 'admin':
        return <AdminHome />;
      default:
        return <WorkerHome />;
    }
  };

  return renderRoleHome();
};

export default DashboardHome; 