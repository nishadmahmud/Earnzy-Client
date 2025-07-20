import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useUserCoins, useRefreshUserCoins } from '../../../hooks/useUserData';
import { useWorkerWithdrawals } from '../../../hooks/useTaskData';
import { FiDollarSign, FiCreditCard, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle, FiTarget, FiSend, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const WorkerWithdrawals = () => {
  const { user } = useContext(AuthContext);
  const { coins: userCoins = 0 } = useUserCoins();
  const refreshUserCoins = useRefreshUserCoins();
  const { data: withdrawals = [], refetch: refetchWithdrawals } = useWorkerWithdrawals(user?.email);
  const [currentPage, setCurrentPage] = useState(1);
  const withdrawalsPerPage = 5;

  useDocumentTitle('Withdrawals');

  const [formData, setFormData] = useState({
    coinToWithdraw: '',
    paymentSystem: '',
    accountNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const COIN_TO_DOLLAR_RATE = 20; // 20 coins = 1 dollar
  const MIN_WITHDRAWAL_COINS = 200; // 200 coins = 10 dollars minimum

  const withdrawalAmount = formData.coinToWithdraw ? (formData.coinToWithdraw / COIN_TO_DOLLAR_RATE).toFixed(2) : '0.00';
  const totalWithdrawalAmount = (userCoins / COIN_TO_DOLLAR_RATE).toFixed(2);

  // Pagination logic
  const totalPages = Math.ceil(withdrawals.length / withdrawalsPerPage);
  const startIndex = (currentPage - 1) * withdrawalsPerPage;
  const endIndex = startIndex + withdrawalsPerPage;
  const currentWithdrawals = withdrawals.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paymentSystems = [
    { value: 'bkash', label: 'Bkash' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'coinToWithdraw') {
      const numValue = parseInt(value) || 0;
      if (numValue > userCoins) {
        toast.error('Cannot exceed your total coins');
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const coinAmount = parseInt(formData.coinToWithdraw);
    
    if (!coinAmount || coinAmount < MIN_WITHDRAWAL_COINS) {
      toast.error(`Minimum withdrawal is ${MIN_WITHDRAWAL_COINS} coins ($${(MIN_WITHDRAWAL_COINS / COIN_TO_DOLLAR_RATE).toFixed(2)})`);
      return;
    }
    
    if (coinAmount > userCoins) {
      toast.error('Insufficient coins');
      return;
    }
    
    if (!formData.paymentSystem || !formData.accountNumber.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerEmail: user.email,
          coinAmount: coinAmount,
          dollarAmount: parseFloat(withdrawalAmount),
          paymentSystem: formData.paymentSystem,
          accountNumber: formData.accountNumber.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Withdrawal request submitted successfully!');
        setFormData({
          coinToWithdraw: '',
          paymentSystem: '',
          accountNumber: ''
        });
        await refreshUserCoins();
        await refetchWithdrawals();
      } else {
        toast.error(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Error submitting withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

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
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
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

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const approvedWithdrawals = withdrawals.filter(w => w.status === 'approved');
  const totalWithdrawn = approvedWithdrawals.reduce((sum, w) => sum + (w.dollarAmount || w.withdrawalAmount || 0), 0);

  const statsCards = [
    {
      title: 'Available Coins',
      value: userCoins,
      subValue: `$${totalWithdrawalAmount}`,
      icon: <FiDollarSign className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Requests',
      value: pendingWithdrawals.length,
      subValue: `$${pendingWithdrawals.reduce((sum, w) => sum + (w.dollarAmount || w.withdrawalAmount || 0), 0).toFixed(2)}`,
      icon: <FiClock className="h-4 w-4" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Total Withdrawn',
      value: approvedWithdrawals.length,
      subValue: `$${totalWithdrawn.toFixed(2)}`,
      icon: <FiCheckCircle className="h-4 w-4" />,
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
      {/* Header with Stats */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm"
          >
            <FiDollarSign className="h-4 w-4 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Withdrawals</h1>
            <p className="text-sm text-slate-600">Request withdrawals and track your earnings</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
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
                  <p className="text-xs font-medium text-slate-500">
                    {stat.subValue}
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

      {/* Withdrawal Request Form */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
          >
            <FiSend className="h-3 w-3 text-white" />
          </motion.div>
          <h2 className="text-lg font-semibold text-slate-800">New Withdrawal Request</h2>
        </div>

        {userCoins < MIN_WITHDRAWAL_COINS && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-amber-50/80 border border-amber-200/50 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <FiAlertCircle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-700">
                Minimum withdrawal is {MIN_WITHDRAWAL_COINS} coins (${(MIN_WITHDRAWAL_COINS / COIN_TO_DOLLAR_RATE).toFixed(2)}). 
                You need {MIN_WITHDRAWAL_COINS - userCoins} more coins.
              </p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Coins to Withdraw *
              </label>
              <input
                type="number"
                name="coinToWithdraw"
                value={formData.coinToWithdraw}
                onChange={handleInputChange}
                min={MIN_WITHDRAWAL_COINS}
                max={userCoins}
                placeholder={`Min ${MIN_WITHDRAWAL_COINS} coins`}
                className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all duration-200"
                required
                disabled={submitting}
              />
              <p className="text-xs text-slate-500 mt-1">
                Available: {userCoins} coins | Amount: ${withdrawalAmount}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Payment Method *
              </label>
              <select
                name="paymentSystem"
                value={formData.paymentSystem}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all duration-200"
                required
                disabled={submitting}
              >
                <option value="">Select payment method</option>
                {paymentSystems.map(system => (
                  <option key={system.value} value={system.value}>
                    {system.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Account Number *
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              placeholder="Enter your account number"
              className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all duration-200"
              required
              disabled={submitting}
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center space-x-2">
              <HiSparkles className="h-4 w-4 text-emerald-600" />
              <div className="text-sm">
                <span className="text-slate-600">Withdrawal Amount:</span>
                <span className="ml-2 text-emerald-600 font-bold">${withdrawalAmount}</span>
              </div>
            </div>
            
            <motion.button
              type="submit"
              disabled={submitting || userCoins < MIN_WITHDRAWAL_COINS || !formData.coinToWithdraw || !formData.paymentSystem || !formData.accountNumber.trim()}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="h-3 w-3 mr-2" />
                  Request Withdrawal
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Withdrawals History */}
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
                <FiCreditCard className="h-3 w-3 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-slate-800">Withdrawal History</h3>
            </div>
            {withdrawals.length > 0 && (
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1}-{Math.min(endIndex, withdrawals.length)} of {withdrawals.length}
              </div>
            )}
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="p-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FiCreditCard className="h-6 w-6 text-slate-400" />
            </motion.div>
            <h3 className="text-base font-semibold text-slate-600 mb-1">No Withdrawals Yet</h3>
            <p className="text-sm text-slate-500">Your withdrawal requests will appear here.</p>
          </motion.div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-white/20">
              {currentWithdrawals.map((withdrawal, index) => {
                const statusConfig = getStatusConfig(withdrawal.status);
                return (
                  <motion.div
                    key={withdrawal._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-white/20 transition-all duration-200"
                  >
                    <div className="space-y-3">
                      {/* Amount and Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <FiDollarSign className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-lg font-bold text-emerald-600">
                              ${(withdrawal.dollarAmount || withdrawal.withdrawalAmount || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {withdrawal.coinAmount || withdrawal.withdrawalCoin || 0} coins
                            </p>
                          </div>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.02 }}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border shadow-sm ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </motion.span>
                      </div>

                      {/* Payment Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <FiCreditCard className="h-3 w-3 text-slate-400" />
                            <span className="text-xs font-medium text-slate-600">Payment Method</span>
                          </div>
                          <p className="text-sm font-medium text-slate-900 capitalize">{withdrawal.paymentSystem}</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <FiTarget className="h-3 w-3 text-slate-400" />
                            <span className="text-xs font-medium text-slate-600">Account</span>
                          </div>
                          <p className="text-sm text-slate-900">{withdrawal.accountNumber}</p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center space-x-1">
                        <FiClock className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-slate-600">
                          Requested on {formatDate(withdrawal.requestedAt)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {currentWithdrawals.map((withdrawal, index) => {
                    const statusConfig = getStatusConfig(withdrawal.status);
                    return (
                      <motion.tr
                        key={withdrawal._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-white/40 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <FiDollarSign className="h-3 w-3 text-emerald-600" />
                            <div>
                              <p className="text-sm font-bold text-emerald-600">
                                ${(withdrawal.dollarAmount || withdrawal.withdrawalAmount || 0).toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {withdrawal.coinAmount || withdrawal.withdrawalCoin || 0} coins
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-slate-800 capitalize">
                            {withdrawal.paymentSystem}
                          </p>
                        </td>
                        
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-600">
                            {withdrawal.accountNumber}
                          </p>
                        </td>
                        
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-600">
                            {formatDate(withdrawal.requestedAt)}
                          </p>
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
      {withdrawals.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 p-3 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <FiTarget className="h-3 w-3 text-slate-600" />
              <span className="text-slate-600">
                Total Requests: <span className="font-bold text-slate-800">{withdrawals.length}</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <HiSparkles className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">
                  ${totalWithdrawn.toFixed(2)} withdrawn
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkerWithdrawals; 