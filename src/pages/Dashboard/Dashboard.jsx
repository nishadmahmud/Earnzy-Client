import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import Footer from '../../components/Footer';
import { Link, Outlet, useNavigate } from 'react-router';
import { useUserData, useUserCoins, useUserProfile } from '../../hooks/useUserData';
import NotificationDropdown from '../../components/NotificationDropdown';
import { FiMenu, FiX, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { user, logOut } = useContext(AuthContext);
  const { data: userData } = useUserData();
  const { coins } = useUserCoins();
  const userProfile = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const role = userData?.role || 'admin';

  let navLinks = workerLinks;
  if (role === 'buyer') navLinks = buyerLinks;
  if (role === 'admin') navLinks = adminLinks;

  // Handle logout
  const handleLogout = async () => {
    await logOut();
    setDropdownOpen(false);
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar - Same as main navbar but without Join as Developer */}
      <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-semibold text-slate-800 tracking-tight">
                  Earnzy
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* User Info Section - Reorganized Layout */}
              <div className="flex items-center space-x-4">
                {/* User Name with Role and Coin above */}
                {userData && (
                  <div className="flex flex-col items-end">
                    {/* Role and Coin on top */}
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded-full">
                        <HiOutlineCurrencyDollar className="h-3 w-3 text-yellow-600" />
                        <span className="text-xs font-medium text-slate-700">
                          {coins || 0}
                        </span>
                      </div>
                      <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                        {userData.role || 'user'}
                      </div>
                    </div>
                    {/* User Name below */}
                    <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                      {userData?.name || user.displayName || 'User'}
                    </span>
                  </div>
                )}
                
                {/* User Profile Image */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <img
                      src={userProfile.profileImage}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <FiChevronDown className="ml-1" />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50"
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors text-sm"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiUser className="mr-2" /> Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors text-sm"
                        >
                          <FiLogOut className="mr-2" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Notifications */}
                <NotificationDropdown />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="px-3 py-2 space-y-3">
                  {/* User Info Section - Mobile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={userProfile.profileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex flex-col">
                        {userData && (
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded-full">
                              <HiOutlineCurrencyDollar className="h-3 w-3 text-yellow-600" />
                              <span className="text-xs font-medium text-slate-700">
                                {coins || 0}
                              </span>
                            </div>
                            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
                              {userData.role || 'user'}
                            </div>
                          </div>
                        )}
                        <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                          {userData?.name || user.displayName || 'User'}
                        </span>
                      </div>
                    </div>
                    {/* Notifications in mobile */}
                    <NotificationDropdown />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 px-3 py-2 rounded bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center"
                  >
                    <FiLogOut className="inline mr-1" /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
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