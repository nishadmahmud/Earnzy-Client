import React, { useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiCheckCircle, FiClock, FiDollarSign, FiFileText, FiAward, FiTarget } from 'react-icons/fi';
import { HiSparkles, HiRocketLaunch } from 'react-icons/hi2';
import { useWorkerDashboard } from '../../../hooks/useWorkerData';
import { motion } from 'framer-motion';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const WorkerHome = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading: loading, error } = useWorkerDashboard();
  
  useDocumentTitle('Worker Dashboard');
  
  const stats = data?.stats || {
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarnings: 0
  };
  
  const approvedSubmissions = data?.approvedSubmissions || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const statsCards = [
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: <FiFileText className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Submissions',
      value: stats.pendingSubmissions,
      icon: <FiClock className="h-4 w-4" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Total Earnings',
      value: `${stats.totalEarnings} coins`,
      icon: <FiDollarSign className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <FiTarget className="h-3 w-3 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-800">Error Loading Data</h3>
            <p className="text-xs text-red-600">{error.message || 'Error loading worker data'}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4"
    >
      {/* Welcome Section */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-2xl p-4 text-white shadow-lg"
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-5 right-5 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-5 left-5 w-12 h-12 bg-blue-300/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <HiRocketLaunch className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">Welcome back, {user?.displayName || 'Worker'}!</h1>
              <p className="text-blue-100 text-sm">Here's your work summary and recent achievements.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 mt-3">
            <HiSparkles className="h-3 w-3 text-yellow-300" />
            <span className="text-blue-100 text-xs">Keep up the great work!</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {statsCards.map((stat) => (
          <motion.div
            key={stat.title}
            variants={fadeInUp}
            whileHover={{ scale: 1.01, y: -2 }}
            className="group bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-600 group-hover:text-slate-700 transition-colors">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {stat.value}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-2 ${stat.bgColor} rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300`}
              >
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Approved Submissions Section */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm"
              >
                <FiCheckCircle className="h-4 w-4 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Approved Submissions</h2>
                <p className="text-xs text-slate-600">Your completed and approved work</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-lg shadow-sm"
            >
              <FiAward className="h-3 w-3 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                {approvedSubmissions.length} Approved
              </span>
            </motion.div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {approvedSubmissions.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              className="p-8 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <FiAward className="h-6 w-6 text-slate-400" />
              </motion.div>
              <h3 className="text-base font-semibold text-slate-600 mb-1">No Approved Submissions Yet</h3>
              <p className="text-sm text-slate-500">Complete tasks to start earning and see your approved submissions here.</p>
            </motion.div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-white/20">
                {approvedSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-white/20 transition-all duration-200"
                  >
                    <div className="space-y-3">
                      {/* Task Title and Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">{submission.task_title}</h4>
                          <p className="text-xs text-slate-500">by {submission.buyer_name}</p>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.02 }}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200/50 shadow-sm"
                        >
                          <FiCheckCircle className="h-2 w-2 mr-1" />
                          Approved
                        </motion.span>
                      </div>

                      {/* Payment and Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <FiDollarSign className="h-3 w-3 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-600">
                            {submission.payable_amount} coins
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {formatDate(submission.approvedAt)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Task Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Buyer Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {approvedSubmissions.map((submission, index) => (
                      <motion.tr
                        key={submission._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-white/40 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-slate-900">{submission.task_title}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-700">{submission.buyer_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <FiDollarSign className="h-3 w-3 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-600">
                              {submission.payable_amount}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <motion.span
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200/50 shadow-sm"
                          >
                            <FiCheckCircle className="h-2 w-2 mr-1" />
                            Approved
                          </motion.span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-600">
                          {formatDate(submission.approvedAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Summary Footer */}
        {approvedSubmissions.length > 0 && (
          <motion.div
            variants={fadeInUp}
            className="px-4 py-3 border-t border-white/20 bg-gradient-to-r from-slate-50/60 to-blue-50/60 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1">
                <FiTarget className="h-3 w-3 text-slate-600" />
                <span className="text-slate-600">
                  Total Approved: <span className="font-bold text-slate-800">{approvedSubmissions.length}</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <HiSparkles className="h-3 w-3 text-emerald-600" />
                <span className="text-slate-600">
                  Total Earnings: <span className="font-bold text-emerald-600">{stats.totalEarnings} coins</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WorkerHome; 