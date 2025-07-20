import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiCreditCard, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiChevronLeft, FiChevronRight, FiTarget } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  useDocumentTitle('Payment History');

  useEffect(() => {
    if (user?.email) {
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/payment-history?email=${encodeURIComponent(user.email)}`);
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      } else {
        toast.error('Failed to fetch payment history');
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(payments.length / paymentsPerPage);
  const startIndex = (currentPage - 1) * paymentsPerPage;
  const endIndex = startIndex + paymentsPerPage;
  const currentPayments = payments.slice(startIndex, endIndex);

  // Calculate stats
  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCoins = payments.reduce((sum, payment) => sum + payment.coins, 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const statsCards = [
    {
      title: 'Total Payments',
      value: payments.length,
      icon: <FiCreditCard className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: <FiDollarSign className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Coins Purchased',
      value: `${totalCoins} coins`,
      icon: <FiTarget className="h-4 w-4" />,
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

      {/* Payment History */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <FiCreditCard className="h-3 w-3 text-white" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Payment History</h2>
                <p className="text-xs text-slate-600">Your coin purchase transactions</p>
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {payments.length === 0 ? (
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
            <h3 className="text-base font-semibold text-slate-600 mb-1">No Payments Yet</h3>
            <p className="text-sm text-slate-500">Purchase coins to see your payment history</p>
          </motion.div>
        ) : (
          <>
            {/* Payment List */}
            <div className="divide-y divide-white/20">
                {currentPayments.map((payment, index) => (
                  <motion.div
                    key={`${payment.id}-${currentPage}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 hover:bg-white/40 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm"
                        >
                          <FiCheckCircle className="h-5 w-5 text-white" />
                        </motion.div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-semibold text-slate-800">
                              Coin Purchase
                            </h3>
                            <motion.span
                              whileHover={{ scale: 1.02 }}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200/50 shadow-sm"
                            >
                              Success
                            </motion.span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-slate-600">
                            <div className="flex items-center space-x-1">
                              <FiTarget className="h-3 w-3 text-violet-600" />
                              <span>{payment.coins} coins</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiCalendar className="h-3 w-3 text-blue-600" />
                              <span>{formatDate(payment.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold text-slate-800">
                          ${payment.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          ${(payment.amount / payment.coins).toFixed(3)} per coin
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-white/20 bg-gradient-to-r from-white/10 to-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, payments.length)} of {payments.length} payments
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                      whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                      className="p-2 bg-white/60 border border-white/50 rounded-lg text-slate-700 hover:bg-white/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="h-3 w-3" />
                    </motion.button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <motion.button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                              : 'bg-white/60 border border-white/50 text-slate-700 hover:bg-white/80'
                          }`}
                        >
                          {page}
                        </motion.button>
                      ))}
                    </div>
                    
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                      whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                      className="p-2 bg-white/60 border border-white/50 rounded-lg text-slate-700 hover:bg-white/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="h-3 w-3" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentHistory; 