import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import PaymentForm from '../../../components/PaymentForm';
import toast from 'react-hot-toast';
import { useUserCoins, useRefreshUserCoins } from '../../../hooks/useUserData';
import { useRefreshNotifications } from '../../../hooks/useNotifications';
import { FiDollarSign, FiCreditCard, FiTarget, FiArrowLeft, FiZap, FiStar, FiTrendingUp, FiGift } from 'react-icons/fi';
import { HiSparkles, HiCurrencyDollar } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const COIN_PACKAGES = [
  { 
    coins: 10, 
    price: 1, 
    popular: false, 
    icon: FiZap, 
    gradient: 'from-emerald-400 to-teal-500',
    name: 'Starter',
    description: 'Perfect for trying out'
  },
  { 
    coins: 150, 
    price: 10, 
    popular: true, 
    icon: FiStar, 
    gradient: 'from-blue-500 to-indigo-600',
    name: 'Popular',
    description: 'Most chosen package'
  },
  { 
    coins: 500, 
    price: 20, 
    popular: false, 
    icon: FiTrendingUp, 
    gradient: 'from-violet-500 to-purple-600',
    name: 'Professional',
    description: 'For serious projects'
  },
  { 
    coins: 1000, 
    price: 35, 
    popular: false, 
    icon: FiGift, 
    gradient: 'from-pink-500 to-rose-600',
    name: 'Enterprise',
    description: 'Maximum value'
  },
];

const PurchaseCoin = () => {
  const { user } = useContext(AuthContext);
  const { coins } = useUserCoins();
  const refreshUserCoins = useRefreshUserCoins();
  const refreshNotifications = useRefreshNotifications();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useDocumentTitle('Purchase Coins');

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (data) => {
    console.log('PurchaseCoin: Payment success data:', data);
    refreshUserCoins();
    refreshNotifications();
    setShowPaymentForm(false);
    setSelectedPackage(null);
    toast.success(`Payment successful! You purchased ${data.coinsAdded} coins.`);
  };

  const handlePaymentError = (error) => {
    toast.error(error || 'Payment failed. Please try again.');
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedPackage(null);
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
        staggerChildren: 0.1
      }
    }
  };

  if (showPaymentForm && selectedPackage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Back Button */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center space-x-3"
        >
          <motion.button
            onClick={handlePaymentCancel}
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl text-slate-600 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiArrowLeft className="h-3 w-3 mr-1" />
            <span className="text-sm font-medium">Back to Packages</span>
          </motion.button>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm"
            >
              <FiCreditCard className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Complete Payment</h2>
              <p className="text-sm text-slate-600">Purchasing {selectedPackage.coins} coins for ${selectedPackage.price}</p>
            </div>
          </div>
          
          <PaymentForm
            amount={selectedPackage.price}
            coins={selectedPackage.coins}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        </motion.div>
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
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm"
            >
              <FiDollarSign className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Purchase Coins</h1>
              <p className="text-sm text-slate-600">Buy coins to post tasks and pay workers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-50/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-emerald-200/50">
            <HiSparkles className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">{coins} coins</span>
          </div>
        </div>
      </motion.div>

      {/* Coin Packages */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4"
      >
        {COIN_PACKAGES.map((pkg) => {
          const IconComponent = pkg.icon;
          return (
            <div key={pkg.coins} className="relative">
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                  >
                    ⭐ Popular
                  </motion.div>
                </div>
              )}
              
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-blue-500/50 ring-offset-1 ring-offset-white/50 mt-3' : ''
                }`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative text-center space-y-3">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <IconComponent className="h-7 w-7 text-white" />
                  </motion.div>

                  {/* Package Info */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      {pkg.name}
                    </h3>
                    <div className="text-2xl font-black text-slate-800 group-hover:text-slate-900 transition-colors">
                      {pkg.coins}
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Coins</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-slate-900 group-hover:to-slate-700 transition-all duration-300">
                      ${pkg.price}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      ${(pkg.price / pkg.coins).toFixed(3)} per coin
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-r ${pkg.gradient} text-white py-2 px-4 rounded-xl font-bold text-xs shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    <span className="relative flex items-center justify-center space-x-1">
                      <span>Purchase</span>
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.div>

                  {/* Value indicator */}
                  {pkg.coins >= 500 && (
                    <div className="absolute top-2 right-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-md"
                      >
                        <span className="text-xs font-bold text-amber-900">💎</span>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Info Section */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm"
          >
            <FiTarget className="h-3 w-3 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-slate-800">How It Works</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 font-bold text-xs">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Choose Package</h4>
              <p className="text-slate-600">Select the coin package that fits your needs</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-xs">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Secure Payment</h4>
              <p className="text-slate-600">Complete payment using our secure payment gateway</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-violet-600 font-bold text-xs">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Start Creating</h4>
              <p className="text-slate-600">Use your coins to post tasks and hire workers</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseCoin; 