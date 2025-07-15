import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import Footer from '../../components/Footer';
import { FiBell } from 'react-icons/fi';
import { Link, Outlet } from 'react-router';

const workerLinks = [
  { name: 'Home', path: '/dashboard' },
  { name: 'TaskList', path: '/dashboard/tasks' },
  { name: 'My Submissions', path: '/dashboard/submissions' },
  { name: 'Withdrawals', path: '/dashboard/withdrawals' },
];
const buyerLinks = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Add new Tasks', path: '/dashboard/add-task' },
  { name: 'My Task’s', path: '/dashboard/my-tasks' },
  { name: 'Purchase Coin', path: '/dashboard/purchase-coin' },
  { name: 'Payment history', path: '/dashboard/payment-history' },
];
const adminLinks = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Manage Users', path: '/dashboard/manage-users' },
  { name: 'Manage Task', path: '/dashboard/manage-tasks' },
];

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(() => setUserData(null));
    }
  }, [user]);

  const role = userData?.role || 'worker';
  const coins = userData?.coins ?? 0;

  let navLinks = workerLinks;
  if (role === 'buyer') navLinks = buyerLinks;
  if (role === 'admin') navLinks = adminLinks;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <div className="w-full bg-white shadow flex items-center justify-between px-6 py-3 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">Earnzy</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
            <span>Coins:</span>
            <span className="font-bold text-blue-600">{coins}</span>
          </div>
          <div className="flex flex-col items-end mr-2">
            <span className="text-xs text-slate-500 capitalize">{role}</span>
            <span className="font-semibold text-slate-800 max-w-[120px] truncate">{user?.displayName || 'User'}</span>
          </div>
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}`}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <button className="ml-4 p-2 rounded-full hover:bg-slate-100 text-slate-600 relative">
            <FiBell className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-100 py-8 px-4 hidden md:block">
          <nav className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

const Dashboard = () => {
  return <DashboardLayout />;
};

export default Dashboard;