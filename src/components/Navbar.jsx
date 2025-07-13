import React, { useState, useContext, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FiMenu, FiX, FiGithub, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../auth/AuthProvider';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);
    const dropdownRef = useRef(null);

    const navItems = [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
    ];

    const isActive = (path) => location.pathname === path;

    // Handle logout
    const handleLogout = async () => {
        await logOut();
        setDropdownOpen(false);
        navigate('/');
    };

    // Close dropdown on outside click
    React.useEffect(() => {
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
                        {!user ? (
                            <>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                            isActive(item.path)
                                                ? 'text-blue-600 underline underline-offset-4'
                                                : 'text-slate-700 hover:text-blue-600 hover:underline hover:underline-offset-4'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <motion.a
                                    href="https://github.com/nishadmahmud/Earnzy-Client"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                                >
                                    <FiGithub className="mr-2 h-4 w-4" />
                                    Join as Developer
                                </motion.a>
                            </>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`}
                                        alt="User"
                                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                    />
                                    <span className="hidden md:inline font-medium max-w-[120px] truncate">{user.displayName || 'User'}</span>
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
                        )}
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
                            {!user ? (
                                <>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                                isActive(item.path)
                                                    ? 'text-blue-600 underline underline-offset-4'
                                                    : 'text-slate-700 hover:text-blue-600 hover:underline hover:underline-offset-4'
                                            }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <motion.a
                                        href="https://github.com/nishadmahmud/Earnzy-Client"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsOpen(false)}
                                        whileTap={{ scale: 0.95 }}
                                        className="block mt-4 mx-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm text-center"
                                    >
                                        <FiGithub className="inline mr-2 h-4 w-4" />
                                        Join as Developer
                                    </motion.a>
                                </>
                            ) : (
                                <div className="px-3 py-2 flex items-center gap-2">
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`}
                                        alt="User"
                                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                    />
                                    <span className="font-medium max-w-[120px] truncate">{user.displayName || 'User'}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-2 px-3 py-1 rounded bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white text-sm"
                                    >
                                        <FiLogOut className="inline mr-1" /> Logout
                                    </button>
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