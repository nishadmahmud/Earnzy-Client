import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import PaymentForm from '../../../components/PaymentForm';
import toast from 'react-hot-toast';
import { useUserCoins, useRefreshUserCoins } from '../../../hooks/useUserData';

const COIN_PACKAGES = [
  { coins: 10, price: 1 },
  { coins: 150, price: 10 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

const PurchaseCoin = () => {
  const { user } = useContext(AuthContext);
  const { coins } = useUserCoins();
  const refreshUserCoins = useRefreshUserCoins();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (data) => {
    console.log('PurchaseCoin: Payment success data:', data);
    // Invalidate and refetch user coins to update the UI
    refreshUserCoins();
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

  if (showPaymentForm && selectedPackage) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Payment</h2>
          <p className="text-slate-600">
            You're purchasing {selectedPackage.coins} coins for ${selectedPackage.price.toFixed(2)}
          </p>
        </div>
        
        <PaymentForm
          amount={selectedPackage.price}
          coins={selectedPackage.coins}
          userEmail={user?.email}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Purchase Coins</h2>
      
             <div className="mb-6 text-center">
         <div className="text-slate-600 mb-2">Available Coins:</div>
         <div className="text-3xl font-bold text-blue-600">{coins}</div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COIN_PACKAGES.map(pkg => (
          <div
            key={pkg.coins}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => handlePackageSelect(pkg)}
          >
            <div className="text-4xl font-bold text-blue-700 mb-3">{pkg.coins}</div>
            <div className="text-sm text-slate-600 mb-2">COINS</div>
            <div className="text-3xl font-bold text-green-700 mb-4">${pkg.price}</div>
            <button
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group-hover:scale-105"
            >
              Buy Now
            </button>
            <div className="text-xs text-slate-500 mt-2">
              ${(pkg.price / pkg.coins).toFixed(3)} per coin
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Secure payment processing with Stripe
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Instant coin delivery to your account
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Email confirmation for all purchases
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCoin; 