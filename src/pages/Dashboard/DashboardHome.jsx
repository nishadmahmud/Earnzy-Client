import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import BuyerHome from './Buyer/BuyerHome';
import WorkerHome from '../Dashboard/Wroker/WorkerHome';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setRole(data.role || 'worker'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (role === 'buyer') return <BuyerHome />;
  if (role === 'worker') return <WorkerHome />;
  if (role === 'admin') return <div className="text-center text-slate-500 py-12">Admin dashboard coming soon...</div>;
  return <div className="text-center text-slate-500 py-12">Unknown role.</div>;
};

export default DashboardHome; 