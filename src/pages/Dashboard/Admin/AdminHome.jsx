import React, { useState, useEffect } from 'react';
import { FiUsers, FiClipboard, FiDollarSign, FiTrendingUp, FiShield, FiTarget, FiActivity, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalAvailableCoins: 0,
    totalPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/dashboard`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error('Failed to fetch admin statistics');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to fetch admin statistics');
    } finally {
      setLoading(false);
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

  const statsCards = [
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: <FiUsers className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Total Buyers',
      value: stats.totalBuyers,
      icon: <FiTarget className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Available Coins',
      value: `${stats.totalAvailableCoins}`,
      icon: <FiStar className="h-4 w-4" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      gradient: 'from-amber-500 to-yellow-600'
    },
    {
      title: 'Total Payments',
      value: `$${stats.totalPayments}`,
      icon: <FiDollarSign className="h-4 w-4" />,
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      gradient: 'from-violet-500 to-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: <FiUsers className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/dashboard/manage-users'
    },
    {
      title: 'Manage Tasks',
      description: 'Oversee all tasks',
      icon: <FiClipboard className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      route: '/dashboard/manage-tasks'
    },
    {
      title: 'System Activity',
      description: 'Monitor platform activity',
      icon: <FiActivity className="h-5 w-5" />,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      route: '/dashboard'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm"
          >
            <FiShield className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-slate-600">Manage and monitor the Earnzy platform</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
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
                whileHover={{ scale: 1.05, rotate: 5 }}
                className={`p-2 ${stat.bgColor} rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`}
              >
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </motion.div>
            </div>
            
            {/* Gradient bar at bottom */}
            <div className={`mt-3 h-1 bg-gradient-to-r ${stat.gradient} opacity-60 rounded-full`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm"
            >
              <FiTrendingUp className="h-3 w-3 text-white" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
              <p className="text-xs text-slate-600">Administrative tools and management</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <motion.a
                key={action.title}
                href={action.route}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer block"
              >
                <div className="flex items-start space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-2 ${action.bgColor} rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300`}
                  >
                    <div className={action.color}>
                      {action.icon}
                    </div>
                  </motion.div>
                  
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-600 group-hover:text-slate-700 transition-colors">
                      {action.description}
                    </p>
                  </div>
                  
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 2 }}
                    className="text-slate-400 group-hover:text-slate-600 transition-colors"
                  >
                    →
                  </motion.div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Platform Overview */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
            >
              <HiSparkles className="h-3 w-3 text-white" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Platform Overview</h2>
              <p className="text-xs text-slate-600">Current system status and metrics</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center">
                <FiUsers className="h-4 w-4 mr-2 text-blue-600" />
                User Statistics
              </h3>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active Workers:</span>
                    <span className="font-semibold text-slate-800">{stats.totalWorkers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active Buyers:</span>
                    <span className="font-semibold text-slate-800">{stats.totalBuyers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Users:</span>
                    <span className="font-semibold text-emerald-600">{stats.totalWorkers + stats.totalBuyers}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center">
                <FiDollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                Financial Overview
              </h3>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Available Coins:</span>
                    <span className="font-semibold text-slate-800">{stats.totalAvailableCoins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Payments:</span>
                    <span className="font-semibold text-slate-800">${stats.totalPayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Platform Health:</span>
                    <span className="font-semibold text-emerald-600">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminHome; 