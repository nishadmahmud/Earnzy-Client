import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';

const COIN_PACKAGES = [
  { coins: 10, price: 1 },
  { coins: 150, price: 10 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
];

const PurchaseCoin = () => {
  const { user } = useContext(AuthContext);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCoins, setUserCoins] = useState(0);

  React.useEffect(() => {
    // Fetch buyer's available coins
    if (user?.email) {
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setUserCoins(data.coins || 0));
    }
  }, [user]);

  const handlePurchase = async (coins, price) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Placeholder: Stripe Checkout redirect
      // In real app, call your backend to create a Stripe Checkout session
      // For demo, simulate payment success after 2 seconds
      setTimeout(() => {
        setSuccess(`Payment successful! You purchased ${coins} coins.`);
        setUserCoins(c => c + coins);
        setLoading(false);
        // Placeholder: Save payment info to server
      }, 2000);
    } catch {
      setError('Payment failed.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Purchase Coin</h2>
      <div className="mb-4 text-center text-slate-600">Available Coins: <span className="font-bold text-blue-600">{userCoins}</span></div>
      {error && <div className="mb-3 text-red-600 text-sm text-center">{error}</div>}
      {success && <div className="mb-3 text-green-600 text-sm text-center">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COIN_PACKAGES.map(pkg => (
          <div
            key={pkg.coins}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer group"
            onClick={() => !loading && handlePurchase(pkg.coins, pkg.price)}
          >
            <div className="text-3xl font-bold text-blue-700 mb-2">{pkg.coins} coins</div>
            <div className="text-2xl text-slate-700 mb-2">=</div>
            <div className="text-2xl font-bold text-green-700 mb-2">${pkg.price}</div>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group-hover:scale-105"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Buy for $${pkg.price}`}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-slate-500 text-xs">* Demo only. Stripe integration and server logic required for real payments.</div>
    </div>
  );
};

export default PurchaseCoin; 