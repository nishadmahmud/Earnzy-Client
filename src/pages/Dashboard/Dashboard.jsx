import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../auth/AuthProvider';
import Footer from '../../components/Footer';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { useUserData, useUserCoins, useUserProfile } from '../../hooks/useUserData';
import NotificationDropdown from '../../components/NotificationDropdown';
import { FiMenu, FiX, FiChevronDown, FiLogOut, FiUser, FiHome, FiList, FiFileText, FiCreditCard, FiDollarSign, FiUsers, FiSettings } from 'react-icons/fi';
import { HiOutlineCurrencyDollar, HiSparkles } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

const workerLinks = [
  { name: 'Home', path: '/dashboard', icon: <FiHome className="h-4 w-4" /> },
  { name: 'TaskList', path: '/dashboard/tasks', icon: <FiList className="h-4 w-4" /> },
  { name: 'My Submissions', path: '/dashboard/submissions', icon: <FiFileText className="h-4 w-4" /> },
  { name: 'Withdrawals', path: '/dashboard/withdrawals', icon: <FiDollarSign className="h-4 w-4" /> },
];
const buyerLinks = [
  { name: 'Home', path: '/dashboard', icon: <FiHome className="h-4 w-4" /> },
  { name: 'Add new Tasks', path: '/dashboard/add-task', icon: <FiFileText className="h-4 w-4" /> },
  { name: 'My Task\'s', path: '/dashboard/my-tasks', icon: <FiList className="h-4 w-4" /> },
  { name: 'Purchase Coin', path: '/dashboard/purchase-coin', icon: <FiCreditCard className="h-4 w-4" /> },
  { name: 'Payment history', path: '/dashboard/payment-history', icon: <FiDollarSign className="h-4 w-4" /> },
];
const adminLinks = [
  { name: 'Home', path: '/dashboard', icon: <FiHome className="h-4 w-4" /> },
  { name: 'Manage Users', path: '/dashboard/manage-users', icon: <FiUsers className="h-4 w-4" /> },
  { name: 'Manage Task', path: '/dashboard/manage-tasks', icon: <FiSettings className="h-4 w-4" /> },
];

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const { data: userData } = useUserData();
  const { coins } = useUserCoins();
  const userProfile = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const role = userData?.role || 'admin';

  let navLinks = workerLinks;
  if (role === 'buyer') navLinks = buyerLinks;
  if (role === 'admin') navLinks = adminLinks;

  // Check if a link is active
  const isActiveLink = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar - Modern Glassmorphism Design */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 font-sans shadow-lg shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-2xl font-bold text-slate-800 tracking-tight">
                  Earnzy
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* User Info Section - Reorganized Layout */}
              <div className="flex items-center space-x-3">
                {/* User Name with Role and Coin above */}
                {userData && (
                  <div className="flex flex-col items-end">
                    {/* Role and Coin on top */}
                    <div className="flex items-center space-x-2 mb-1">
                      {userData.role !== 'admin' && (
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center space-x-1 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 px-2 py-1 rounded-full shadow-sm"
                        >
                          <HiOutlineCurrencyDollar className="h-3 w-3 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-700">
                            {coins || 0}
                          </span>
                        </motion.div>
                      )}
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 text-xs font-semibold rounded-full capitalize shadow-sm"
                      >
                        {userData.role || 'user'}
                      </motion.div>
                    </div>
                    {/* User Name below */}
                    <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                      {userData?.name || user.displayName || 'User'}
                    </span>
                  </div>
                )}
                
                {/* User Profile Image */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  >
                    <img
                      src={userProfile.profileImage}
                      alt="User"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200/50"
                    />
                    <motion.div
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="h-4 w-4 text-slate-600" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl py-2 z-50"
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-3 text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 transition-colors text-sm font-medium rounded-xl mx-2"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiUser className="mr-3 h-4 w-4" /> Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-slate-700 hover:bg-red-50/50 hover:text-red-600 transition-colors text-sm font-medium rounded-xl mx-2"
                        >
                          <FiLogOut className="mr-3 h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Notifications */}
                <div className="ml-2">
                  <NotificationDropdown />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 text-slate-700 hover:text-blue-600 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 shadow-lg"
              >
                <span className="sr-only">Open main menu</span>
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <FiX className="block h-5 w-5" />
                  ) : (
                    <FiMenu className="block h-5 w-5" />
                  )}
                </motion.div>
              </motion.button>
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
              className="md:hidden bg-white/80 backdrop-blur-xl border-t border-white/20"
            >
              <div className="px-4 pt-4 pb-6 space-y-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg">
                  {/* User Info Section - Mobile */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={userProfile.profileImage}
                        alt="User"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200/50"
                      />
                      <div className="flex flex-col">
                        {userData && (
                          <div className="flex items-center space-x-2 mb-1">
                            {userData.role !== 'admin' && (
                              <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 px-2 py-1 rounded-full">
                                <HiOutlineCurrencyDollar className="h-3 w-3 text-amber-600" />
                                <span className="text-xs font-semibold text-amber-700">
                                  {coins || 0}
                                </span>
                              </div>
                            )}
                            <div className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 text-xs font-semibold rounded-full capitalize">
                              {userData.role || 'user'}
                            </div>
                          </div>
                        )}
                        <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                          {userData?.name || user.displayName || 'User'}
                        </span>
                      </div>
                    </div>
                    {/* Notifications in mobile */}
                    <NotificationDropdown />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm font-semibold flex items-center justify-center shadow-lg transition-all duration-200"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" /> Logout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 relative z-10">
        {/* Sidebar - Modern Glassmorphism */}
        <aside className={`${sidebarCollapsed ? 'w-28' : 'w-65'} transition-all duration-300 p-4 hidden md:block relative z-20 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6 h-full relative ${sidebarCollapsed ? 'w-23' : 'w-full'}`}>
            {/* Toggle Button */}
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -right-3 top-8 w-6 h-6 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-all duration-200 z-10"
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown className="h-3 w-3 text-slate-600 transform rotate-90" />
              </motion.div>
            </motion.button>

            <div className="mb-6">
              <div className={`flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl transition-all duration-300 ${sidebarCollapsed ? 'justify-center px-2 py-3 w-12 mx-auto' : 'space-x-2 px-4 py-3'}`}>
                <HiSparkles className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-semibold text-blue-700 capitalize whitespace-nowrap overflow-hidden"
                    >
                      {role} Dashboard
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const isActive = isActiveLink(link.path);
                
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`group flex items-center font-medium transition-all duration-200 shadow-sm hover:shadow-md relative rounded-2xl ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-500/50 shadow-lg shadow-blue-500/25'
                          : 'bg-white/40 backdrop-blur-sm border border-white/50 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:border-blue-200/50'
                      } ${sidebarCollapsed ? 'justify-center px-4 py-3 w-12 mx-auto' : 'space-x-3 px-4 py-3'}`}
                      title={sidebarCollapsed ? link.name : ''}
                    >
                      <span className={`transition-transform duration-200 flex-shrink-0 ${
                        isActive 
                          ? 'scale-110 text-white' 
                          : 'group-hover:scale-110'
                      }`}>
                        {link.icon}
                      </span>
                      
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="whitespace-nowrap overflow-hidden"
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {isActive && !sidebarCollapsed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto flex-shrink-0"
                        >
                          <HiSparkles className="h-4 w-4 text-white/80" />
                        </motion.div>
                      )}

                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999]">
                          {link.name}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6 pb-20 md:pb-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/50 shadow-xl min-h-full p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/80 backdrop-blur-xl border-t border-white/30 px-4 py-2 shadow-2xl">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            {/* Quick Access Links (First 3 nav items) */}
            {navLinks.slice(0, 3).map((link) => {
              const isActive = isActiveLink(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/70'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-100' : ''}`}>
                    {link.icon}
                  </div>
                  <span className="text-xs font-medium mt-1 truncate max-w-[60px]">
                    {link.name.split(' ')[0]}
                  </span>
                </Link>
              );
            })}
            
            {/* More Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
            >
              <div className="p-1.5 rounded-lg">
                <FiMenu className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium mt-1">More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            
            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-2xl border-r border-white/30 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800">Dashboard</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/50 text-slate-600 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-2xl">
                  <img
                    src={userProfile.profileImage}
                    alt="User"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white/50"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {userData.role !== 'admin' && (
                        <div className="flex items-center space-x-1 bg-white/60 px-2 py-0.5 rounded-full border border-white/30">
                          <HiOutlineCurrencyDollar className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-700">{coins || 0}</span>
                        </div>
                      )}
                      <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-full capitalize">
                        {userData?.role || 'user'}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {userData?.name || user.displayName || 'User'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl mb-4">
                    <HiSparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700 capitalize">
                      {role} Menu
                    </span>
                  </div>
                </div>

                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = isActiveLink(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-white/60 hover:text-blue-600'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-white/40'
                        }`}>
                          {link.icon}
                        </div>
                        <span>{link.name}</span>
                        {isActive && (
                          <HiSparkles className="h-4 w-4 ml-auto text-white/80" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Additional Actions */}
                <div className="mt-8 pt-6 border-t border-white/30">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  >
                    <div className="p-2 rounded-xl bg-white/20">
                      <FiLogOut className="h-4 w-4" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const Dashboard = () => {
  return <DashboardLayout />;
};

export default Dashboard;