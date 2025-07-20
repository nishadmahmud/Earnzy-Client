import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useWorkerSubmissions } from '../../../hooks/useTaskData';
import { FiFileText, FiUser, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiXCircle, FiTarget, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const WorkerMySubmissions = () => {
  const { user } = useContext(AuthContext);
  const { data: submissions = [], isLoading: loading, error } = useWorkerSubmissions(user?.email);
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5;

  useDocumentTitle('My Submissions');

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50',
          icon: <FiCheckCircle className="h-2 w-2" />,
          label: 'Approved'
        };
      case 'pending':
        return {
          color: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200/50',
          icon: <FiClock className="h-2 w-2" />,
          label: 'Pending'
        };
      case 'rejected':
        return {
          color: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200/50',
          icon: <FiXCircle className="h-2 w-2" />,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200/50',
          icon: <FiClock className="h-2 w-2" />,
          label: 'Unknown'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
            <h3 className="text-sm font-semibold text-red-800">Error Loading Submissions</h3>
            <p className="text-xs text-red-600">{error.message || 'Error fetching submissions'}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const approvedSubmissions = submissions.filter(sub => sub.status === 'approved');
  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const rejectedSubmissions = submissions.filter(sub => sub.status === 'rejected');
  const totalEarnings = approvedSubmissions.reduce((sum, sub) => sum + sub.payableAmount, 0);

  // Pagination logic
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);
  const startIndex = (currentPage - 1) * submissionsPerPage;
  const endIndex = startIndex + submissionsPerPage;
  const currentSubmissions = submissions.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const statsCards = [
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: <FiFileText className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Approved',
      value: approvedSubmissions.length,
      icon: <FiCheckCircle className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Pending',
      value: pendingSubmissions.length,
      icon: <FiClock className="h-4 w-4" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Total Earnings',
      value: `${totalEarnings} coins`,
      icon: <FiDollarSign className="h-4 w-4" />,
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4"
    >
      {/* Header with Stats */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm"
          >
            <FiFileText className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">My Submissions</h1>
            <p className="text-sm text-slate-600">Track your submitted work and earnings</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          {statsCards.map((stat) => (
            <motion.div
              key={stat.title}
              variants={fadeInUp}
              whileHover={{ scale: 1.01, y: -1 }}
              className="group bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
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
      </motion.div>

      {/* Submissions Table/Cards */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <FiFileText className="h-3 w-3 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-slate-800">My Submissions</h3>
            </div>
            {submissions.length > 0 && (
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1}-{Math.min(endIndex, submissions.length)} of {submissions.length}
              </div>
            )}
          </div>
        </div>

        {submissions.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="p-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FiFileText className="h-6 w-6 text-slate-400" />
            </motion.div>
            <h3 className="text-base font-semibold text-slate-600 mb-1">No Submissions Yet</h3>
            <p className="text-sm text-slate-500">Start working on tasks to see your submissions here.</p>
          </motion.div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-white/20">
              {currentSubmissions.map((submission, index) => {
                const statusConfig = getStatusConfig(submission.status);
                return (
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
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">{submission.taskTitle}</h4>
                          <p className="text-xs text-slate-500">Task ID: {submission.taskId}</p>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.02 }}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </motion.span>
                      </div>

                      {/* Buyer and Payment Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <FiUser className="h-3 w-3 text-slate-400" />
                            <span className="text-xs font-medium text-slate-600">Buyer</span>
                          </div>
                          <p className="text-sm font-medium text-slate-900">{submission.buyerName}</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <FiDollarSign className="h-3 w-3 text-emerald-600" />
                            <span className="text-xs font-medium text-slate-600">Payment</span>
                          </div>
                          <p className="text-sm font-bold text-emerald-600">{submission.payableAmount} coins</p>
                        </div>
                      </div>

                      {/* Date and Details */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-slate-600">
                            {formatDate(submission.submittedAt)} at {formatTime(submission.submittedAt)}
                          </span>
                        </div>
                        <div className="bg-white/40 rounded-lg p-2">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {submission.submissionDetails.length > 100 
                              ? submission.submissionDetails.slice(0, 100) + '...' 
                              : submission.submissionDetails}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm border-b border-white/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {currentSubmissions.map((submission, index) => {
                    const statusConfig = getStatusConfig(submission.status);
                    return (
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
                          <div className="max-w-xs">
                            <p className="text-sm font-semibold text-slate-900 truncate">{submission.taskTitle}</p>
                            <p className="text-xs text-slate-500">ID: {submission.taskId}</p>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-slate-900 truncate">{submission.buyerName}</p>
                            <p className="text-xs text-slate-500 truncate">{submission.buyerEmail}</p>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm text-slate-900">{formatDate(submission.submittedAt)}</p>
                            <p className="text-xs text-slate-500">{formatTime(submission.submittedAt)}</p>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <FiDollarSign className="h-3 w-3 text-emerald-600 mr-1" />
                            <span className="text-sm font-bold text-emerald-600">
                              {submission.payableAmount}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <motion.span
                            whileHover={{ scale: 1.02 }}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusConfig.color}`}
                          >
                            {statusConfig.icon}
                            <span className="ml-1">{statusConfig.label}</span>
                          </motion.span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-white/20 bg-gradient-to-r from-white/10 to-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white/40 border border-white/50 text-slate-600 hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <FiChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                              : 'bg-white/40 border border-white/50 text-slate-600 hover:bg-white/60'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white/40 border border-white/50 text-slate-600 hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Summary Footer */}
      {submissions.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-3 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <FiTarget className="h-3 w-3 text-slate-600" />
              <span className="text-slate-600">
                Showing <span className="font-bold text-slate-800">{submissions.length}</span> submission{submissions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <HiSparkles className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">
                  {approvedSubmissions.length} approved
                </span>
              </div>
              <span className="text-amber-600 font-semibold">
                {pendingSubmissions.length} pending
              </span>
              <span className="text-red-600 font-semibold">
                {rejectedSubmissions.length} rejected
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkerMySubmissions; 