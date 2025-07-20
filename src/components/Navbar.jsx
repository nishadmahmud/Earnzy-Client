import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FiMenu, FiX, FiGithub, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { HiOutlineCurrencyDollar, HiSparkles } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../auth/AuthProvider';
import { useUserData, useUserCoins, useUserProfile } from '../hooks/useUserData';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);
    const { data: userData } = useUserData();
    const { coins } = useUserCoins();
    const userProfile = useUserProfile();
    const dropdownRef = useRef(null);

    const navItems = [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
    ];

    const isActive = (path) => location.pathname === path;
    const isHomePage = location.pathname === '/';

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
        <nav className="bg-white/70 backdrop-blur-2xl shadow-lg border-b border-white/20 sticky top-0 z-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center space-x-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                                <span className="text-white font-bold text-lg drop-shadow-sm">E</span>
                            </div>
                            <span className="text-2xl font-bold text-slate-800 tracking-tight drop-shadow-sm">
                                Earnzy
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {!user ? (
                            <>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${
                                            isActive(item.path)
                                                ? 'text-blue-600 bg-white/60 shadow-sm border border-white/30'
                                                : 'text-slate-700 hover:text-blue-600 hover:bg-white/40 hover:backdrop-blur-md'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <motion.a
                                    href="https://github.com/nishadmahmud"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/90 to-indigo-700/90 hover:from-blue-700/90 hover:to-indigo-800/90 text-white font-medium text-xs rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm border border-white/10"
                                >
                                    <FiGithub className="mr-1.5 h-3 w-3 group-hover:rotate-12 transition-transform" />
                                    Join as Dev
                                </motion.a>
                            </>
                        ) : (
                            <>
                                {/* User Info Section - Enhanced Layout */}
                                <div className="flex items-center space-x-3">
                                    {/* User Name with Role and Coin above */}
                                    {userData && (
                                        <div className="flex flex-col items-end">
                                            {/* Role and Coin on top */}
                                            <div className="flex items-center space-x-2 mb-1">
                                                {userData.role !== 'admin' && (
                                                    <div className="flex items-center space-x-1 bg-white/50 backdrop-blur-md border border-emerald-200/50 px-2 py-0.5 rounded-full shadow-sm">
                                                        <HiOutlineCurrencyDollar className="h-3 w-3 text-emerald-600" />
                                                        <span className="text-xs font-medium text-emerald-700">
                                                            {coins || 0}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-sm border border-white/20 text-white text-xs font-medium rounded-full capitalize shadow-sm">
                                                    {userData.role || 'user'}
                                                </div>
                                            </div>
                                            {/* User Name below */}
                                            <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate drop-shadow-sm">
                                                {userData?.name || user.displayName || 'User'}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* User Profile Image */}
                                    <div className="relative" ref={dropdownRef}>
                                        <motion.button
                                            onClick={() => setDropdownOpen((prev) => !prev)}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center space-x-2 p-2 rounded-2xl hover:bg-white/30 hover:backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent hover:border-white/20"
                                        >
                                            <img
                                                src={userProfile.profileImage}
                                                alt="User"
                                                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30 shadow-lg backdrop-blur-sm"
                                            />
                                            <FiChevronDown className={`ml-1 h-4 w-4 text-slate-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                        </motion.button>
                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-3 w-52 bg-white/80 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl py-3 z-50"
                                                >
                                                    <Link
                                                        to="/dashboard"
                                                        className="flex items-center px-6 py-3 text-slate-700 hover:bg-white/40 hover:backdrop-blur-md hover:text-blue-600 transition-all duration-200 text-sm font-medium group"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <div className="w-8 h-8 bg-blue-100/70 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-200/70 transition-colors border border-white/20">
                                                            <FiUser className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        Dashboard
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full px-6 py-3 text-slate-700 hover:bg-red-50/40 hover:backdrop-blur-md hover:text-red-600 transition-all duration-200 text-sm font-medium group"
                                                    >
                                                        <div className="w-8 h-8 bg-red-100/70 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 group-hover:bg-red-200/70 transition-colors border border-white/20">
                                                            <FiLogOut className="h-4 w-4 text-red-600" />
                                                        </div>
                                                        Logout
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    {/* Notifications */}
                                    <NotificationDropdown />
                                    
                                    {/* Join as Developer button - Always show on home page */}
                                    {isHomePage && (
                                        <motion.a
                                            href="https://github.com/nishadmahmud"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-600/90 to-purple-700/90 hover:from-violet-700/90 hover:to-purple-800/90 text-white font-medium text-xs rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-violet-500/25 backdrop-blur-sm border border-white/10"
                                        >
                                            <FiGithub className="mr-1.5 h-3 w-3 group-hover:rotate-12 transition-transform" />
                                            Join as Dev
                                        </motion.a>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center justify-center p-3 rounded-2xl text-slate-700 hover:text-blue-600 hover:bg-white/30 hover:backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 border border-transparent hover:border-white/20"
                        >
                            <span className="sr-only">Open main menu</span>
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiX className="block h-6 w-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiMenu className="block h-6 w-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Enhanced Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white/60 backdrop-blur-2xl border-t border-white/30"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-4">
                            {!user ? (
                                <>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-200 backdrop-blur-sm ${
                                                isActive(item.path)
                                                    ? 'text-blue-600 bg-white/60 shadow-sm border border-white/40'
                                                    : 'text-slate-700 hover:text-blue-600 hover:bg-white/40 hover:backdrop-blur-md'
                                            }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <motion.a
                                        href="https://github.com/nishadmahmud"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsOpen(false)}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center mt-4 mx-2 px-4 py-3 bg-gradient-to-r from-blue-600/90 to-indigo-700/90 text-white font-medium text-sm rounded-xl shadow-md backdrop-blur-sm border border-white/10"
                                    >
                                        <FiGithub className="mr-2 h-4 w-4" />
                                        Join as Dev
                                    </motion.a>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    {/* User Info Section - Mobile */}
                                    <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={userProfile.profileImage}
                                                alt="User"
                                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-lg backdrop-blur-sm"
                                            />
                                            <div className="flex flex-col">
                                                {userData && (
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        {userData.role !== 'admin' && (
                                                            <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30">
                                                                <HiOutlineCurrencyDollar className="h-3 w-3 text-emerald-600" />
                                                                <span className="text-xs font-medium text-emerald-700">
                                                                    {coins || 0}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-sm border border-white/20 text-white text-xs font-medium rounded-full capitalize">
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
                                        <div className="relative z-[60]">
                                            <NotificationDropdown />
                                        </div>
                                    </div>
                                    
                                    {/* Dashboard Link - Mobile */}
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center px-4 py-3 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl text-slate-700 hover:bg-white/60 hover:text-blue-600 transition-all duration-200 font-medium shadow-sm"
                                    >
                                        <div className="w-10 h-10 bg-blue-100/70 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 border border-white/20">
                                            <FiUser className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <span className="text-base">Dashboard</span>
                                    </Link>
                                    
                                    {/* Show Join as Developer button on home page even when logged in */}
                                    {isHomePage && (
                                        <motion.a
                                            href="https://github.com/nishadmahmud"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setIsOpen(false)}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-600/90 to-purple-700/90 text-white font-medium text-sm rounded-xl shadow-md backdrop-blur-sm border border-white/10"
                                        >
                                            <FiGithub className="mr-2 h-4 w-4" />
                                            Join as Dev
                                        </motion.a>
                                    )}
                                    
                                    <motion.button
                                        onClick={handleLogout}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600/90 hover:to-red-700/90 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
                                    >
                                        <FiLogOut className="mr-2 h-5 w-5" />
                                        Logout
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;