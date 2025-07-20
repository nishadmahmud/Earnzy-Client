import React, { useState, useEffect } from 'react';
import { FiUsers, FiEdit, FiTrash2, FiMail, FiShield, FiTarget, FiStar, FiMoreVertical, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useDocumentTitle('Manage Users');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users`);
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (email, role) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users/${email}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        toast.success('User role updated successfully!');
        await fetchUsers();
        setEditingUser(null);
        setNewRole('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role');
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users/${email}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully!');
        await fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200/50';
      case 'buyer':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200/50';
      case 'worker':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50';
      default:
        return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200/50';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FiShield className="h-3 w-3" />;
      case 'buyer':
        return <FiTarget className="h-3 w-3" />;
      case 'worker':
        return <FiUsers className="h-3 w-3" />;
      default:
        return <FiUsers className="h-3 w-3" />;
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  const userCounts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    buyer: users.filter(u => u.role === 'buyer').length,
    worker: users.filter(u => u.role === 'worker').length
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: userCounts.all,
      icon: <FiUsers className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Admins',
      value: userCounts.admin,
      icon: <FiShield className="h-4 w-4" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Buyers',
      value: userCounts.buyer,
      icon: <FiTarget className="h-4 w-4" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Workers',
      value: userCounts.worker,
      icon: <FiStar className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4 overflow-x-hidden"
    >
      {/* Stats Section */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        {statsCards.map((stat) => (
          <motion.div
            key={stat.title}
            variants={fadeInUp}
            whileHover={{ scale: 1.01, y: -1 }}
            className="group bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-600 group-hover:text-slate-700 transition-colors">
                  {stat.title}
                </p>
                <p className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {stat.value}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-2 ${stat.bgColor} rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`}
              >
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Users Management */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <FiUsers className="h-3 w-3 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">User Management</h2>
                <p className="text-xs text-slate-600">Manage all platform users</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              {/* Search */}
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm w-full sm:w-48"
              />
              
              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="buyer">Buyer</option>
                <option value="worker">Worker</option>
              </select>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="p-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FiUsers className="h-6 w-6 text-slate-400" />
            </motion.div>
            <h3 className="text-base font-semibold text-slate-600 mb-1">No Users Found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
              {filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-3 sm:p-4 hover:bg-white/60 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {/* User Header */}
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl shadow-sm flex-shrink-0"
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=40`}
                      alt={user.name}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">{user.name}</h3>
                        <motion.span
                          whileHover={{ scale: 1.02 }}
                          className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold border shadow-sm flex-shrink-0 ${getRoleColor(user.role)}`}
                        >
                          {getRoleIcon(user.role)}
                          <span className="ml-1 capitalize">{user.role}</span>
                        </motion.span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-slate-600">
                        <FiMail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="bg-white/60 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HiSparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                      <span className="text-xs sm:text-sm font-semibold text-amber-600">{user.coins || 0} coins</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                  {editingUser === user.email ? (
                    <div className="flex items-center space-x-1 sm:space-x-2 w-full">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm"
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="buyer">Buyer</option>
                        <option value="worker">Worker</option>
                      </select>
                      
                      <motion.button
                        onClick={() => handleRoleUpdate(user.email, newRole)}
                        disabled={!newRole}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          setEditingUser(null);
                          setNewRole('');
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <FiX className="h-3 w-3 sm:h-4 sm:w-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => {
                          setEditingUser(user.email);
                          setNewRole(user.role);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        <FiEdit className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">Edit</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleDeleteUser(user.email)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <FiTrash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm font-medium">Delete</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ManageUsers; 