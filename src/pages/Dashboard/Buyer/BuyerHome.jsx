import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiEye, FiCheck, FiX, FiDollarSign, FiUsers, FiClipboard, FiTarget, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const BuyerHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingWorkers: 0,
    totalPayments: 0
  });
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5;

  useDocumentTitle('Buyer Dashboard');

  // Pagination logic
  const totalPages = Math.ceil(pendingSubmissions.length / submissionsPerPage);
  const startIndex = (currentPage - 1) * submissionsPerPage;
  const endIndex = startIndex + submissionsPerPage;
  const currentSubmissions = pendingSubmissions.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (user?.email) {
      fetchBuyerData();
    }
  }, [user]);

  const fetchBuyerData = async () => {
    try {
      // Fetch buyer stats and pending submissions
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/buyer/dashboard?email=${encodeURIComponent(user.email)}`);
      const data = await response.json();
      
      setStats(data.stats);
      setPendingSubmissions(data.pendingSubmissions);
    } catch (error) {
      console.error('Error fetching buyer data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleApprove = async (submissionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/submissions/${submissionId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerEmail: user.email })
      });
      
      if (response.ok) {
        toast.success('Submission approved successfully!');
        fetchBuyerData();
        setShowModal(false);
      } else {
        toast.error('Failed to approve submission');
      }
    } catch (error) {
      console.error('Error approving submission:', error);
      toast.error('Error approving submission');
    }
  };

  const handleReject = async (submissionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/submissions/${submissionId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerEmail: user.email })
      });
      
      if (response.ok) {
        toast.success('Submission rejected');
        fetchBuyerData();
        setShowModal(false);
      } else {
        toast.error('Failed to reject submission');
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error('Error rejecting submission');
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
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
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: <FiClipboard className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Workers',
      value: stats.pendingWorkers,
      icon: <FiUsers className="h-4 w-4" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Total Payments',
      value: `${stats.totalPayments} coins`,
      icon: <FiDollarSign className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4"
    >
      {/* Stats Section */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
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

      {/* Task Review Section */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <FiClipboard className="h-3 w-3 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Tasks To Review</h2>
                <p className="text-xs text-slate-600">Review pending submissions for your tasks</p>
              </div>
            </div>
            {pendingSubmissions.length > 0 && (
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1}-{Math.min(endIndex, pendingSubmissions.length)} of {pendingSubmissions.length}
              </div>
            )}
          </div>
        </div>

        {pendingSubmissions.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="p-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FiClipboard className="h-6 w-6 text-slate-400" />
            </motion.div>
            <h3 className="text-base font-semibold text-slate-600 mb-1">No Pending Submissions</h3>
            <p className="text-sm text-slate-500">All submissions have been reviewed</p>
          </motion.div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-white/20">
              {currentSubmissions.map((submission, index) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-white/20 transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Worker and Task Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <img
                          className="h-10 w-10 rounded-full border border-white/50"
                          src={submission.worker.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(submission.worker.name)}&size=40`}
                          alt={submission.worker.name}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">{submission.worker.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{submission.worker.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <FiDollarSign className="h-3 w-3 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-600">${submission.payableAmount}</span>
                      </div>
                    </div>

                    {/* Task Details */}
                    <div className="bg-white/40 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-slate-900 mb-1">{submission.task.title}</h5>
                      <p className="text-xs text-slate-600">
                        {submission.task.description.length > 50 
                          ? submission.task.description.substring(0, 50) + '...' 
                          : submission.task.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => handleViewSubmission(submission)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white/60 border border-white/50 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FiEye className="h-3 w-3 mr-1" />
                        View
                      </motion.button>
                      <motion.button
                        onClick={() => handleApprove(submission._id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-xs font-semibold text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FiCheck className="h-3 w-3 mr-1" />
                        Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleReject(submission._id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-pink-700 text-xs font-semibold text-white rounded-lg hover:from-red-700 hover:to-pink-800 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FiX className="h-3 w-3 mr-1" />
                        Reject
                      </motion.button>
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
                      Worker
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {currentSubmissions.map((submission, index) => (
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
                        <div className="flex items-center space-x-2">
                          <img
                            className="h-6 w-6 rounded-full"
                            src={submission.worker.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(submission.worker.name)}&size=24`}
                            alt={submission.worker.name}
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{submission.worker.name}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[120px]">{submission.worker.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{submission.task.title}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[150px]">{submission.task.description.substring(0, 30)}...</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <FiDollarSign className="h-3 w-3 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-600">${submission.payableAmount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <motion.button
                            onClick={() => handleViewSubmission(submission)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center px-2 py-1 bg-white/60 border border-white/50 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <FiEye className="h-3 w-3 mr-1" />
                            View
                          </motion.button>
                          <motion.button
                            onClick={() => handleApprove(submission._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-emerald-600 to-green-700 text-xs font-semibold text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <FiCheck className="h-3 w-3 mr-1" />
                            Approve
                          </motion.button>
                          <motion.button
                            onClick={() => handleReject(submission._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-600 to-pink-700 text-xs font-semibold text-white rounded-lg hover:from-red-700 hover:to-pink-800 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <FiX className="h-3 w-3 mr-1" />
                            Reject
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
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

      {/* Submission Detail Modal */}
      {showModal && selectedSubmission && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50"
            >
              <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
                    >
                      <FiEye className="h-3 w-3 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-800">Submission Details</h3>
                  </div>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/50 transition-all duration-200"
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
              
              <div className="px-4 py-3 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                    <FiClipboard className="h-4 w-4 mr-2 text-blue-600" />
                    Task Information
                  </h4>
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50">
                    <p className="text-sm"><span className="font-semibold">Title:</span> {selectedSubmission.task.title}</p>
                    <p className="text-sm"><span className="font-semibold">Description:</span> {selectedSubmission.task.description}</p>
                    <p className="text-sm flex items-center">
                      <span className="font-semibold">Amount:</span>
                      <FiDollarSign className="h-3 w-3 mx-1 text-emerald-600" />
                      <span className="font-bold text-emerald-600">${selectedSubmission.payableAmount}</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                    <FiUser className="h-4 w-4 mr-2 text-violet-600" />
                    Worker Information
                  </h4>
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/50">
                    <p className="text-sm"><span className="font-semibold">Name:</span> {selectedSubmission.worker.name}</p>
                    <p className="text-sm"><span className="font-semibold">Email:</span> {selectedSubmission.worker.email}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                    <HiSparkles className="h-4 w-4 mr-2 text-emerald-600" />
                    Submission Details
                  </h4>
                  <div className="bg-emerald-50/60 backdrop-blur-sm p-3 rounded-xl border border-emerald-200/50">
                    <p className="text-sm"><span className="font-semibold">Submission:</span></p>
                    <p className="text-sm mt-1">{selectedSubmission.submissionDetails}</p>
                    {selectedSubmission.attachments && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold">Attachments:</p>
                        <ul className="text-sm mt-1">
                          {selectedSubmission.attachments.map((attachment, index) => (
                            <li key={index} className="text-blue-600 hover:underline">
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                {attachment.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 border-t border-white/20 flex justify-end space-x-2 bg-gradient-to-r from-white/10 to-white/20">
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 bg-white/60 border border-white/50 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => handleReject(selectedSubmission._id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 bg-gradient-to-r from-red-600 to-pink-700 text-sm font-semibold text-white rounded-xl hover:from-red-700 hover:to-pink-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiX className="h-3 w-3 inline mr-1" />
                  Reject
                </motion.button>
                <motion.button
                  onClick={() => handleApprove(selectedSubmission._id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-green-700 text-sm font-semibold text-white rounded-xl hover:from-emerald-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiCheck className="h-3 w-3 inline mr-1" />
                  Approve
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default BuyerHome; 