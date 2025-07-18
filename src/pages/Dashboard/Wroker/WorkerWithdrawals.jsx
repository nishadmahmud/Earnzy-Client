import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useUserCoins, useRefreshUserCoins } from '../../../hooks/useUserData';
import { useWorkerWithdrawals } from '../../../hooks/useTaskData';
import { FiDollarSign, FiCreditCard, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const WorkerWithdrawals = () => {
  const { user } = useContext(AuthContext);
  const { coins: userCoins = 0 } = useUserCoins();
  const refreshUserCoins = useRefreshUserCoins();
  const { data: withdrawals = [], refetch: refetchWithdrawals } = useWorkerWithdrawals(user?.email);

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
    

    
    if (!formData.coinToWithdraw || !formData.paymentSystem || !formData.accountNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user || !user.email) {
      toast.error('User information is missing. Please try logging in again.');
      return;
    }

    const coinAmount = parseInt(formData.coinToWithdraw);
    
    if (isNaN(coinAmount) || coinAmount <= 0) {
      toast.error('Please enter a valid number of coins');
      return;
    }
    
    if (coinAmount < MIN_WITHDRAWAL_COINS) {
      toast.error(`Minimum withdrawal is ${MIN_WITHDRAWAL_COINS} coins ($${MIN_WITHDRAWAL_COINS / COIN_TO_DOLLAR_RATE})`);
      return;
    }

    if (coinAmount > userCoins) {
      toast.error('Insufficient coins');
      return;
    }

    try {
      setSubmitting(true);
      
      const requestBody = {
        workerEmail: user.email,
        workerName: user.displayName || user.name || user.email.split('@')[0],
        withdrawalCoin: coinAmount,
        withdrawalAmount: parseFloat(withdrawalAmount),
        paymentSystem: formData.paymentSystem,
        accountNumber: formData.accountNumber
      };
      
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/worker/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        toast.error('Invalid response from server');
        return;
      }

      if (response.ok) {
        toast.success('Withdrawal request submitted successfully!');
        setFormData({
          coinToWithdraw: '',
          paymentSystem: '',
          accountNumber: ''
        });
        // Refresh user coins and withdrawals
        refreshUserCoins();
        refetchWithdrawals();
      } else {
        toast.error(data.error || `Server error: ${response.status}`);
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
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: <FiCheckCircle className="h-3 w-3" />,
          label: 'Approved'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <FiClock className="h-3 w-3" />,
          label: 'Pending'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: <FiXCircle className="h-3 w-3" />,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <FiClock className="h-3 w-3" />,
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

  return (
    <div className="space-y-6">
      {/* User Earnings Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Withdrawals</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Current Balance</p>
                <p className="text-3xl font-bold text-blue-700">{userCoins} coins</p>
                <p className="text-sm text-blue-600 mt-1">≈ ${totalWithdrawalAmount}</p>
              </div>
              <FiDollarSign className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Withdrawal Rate</p>
                <p className="text-3xl font-bold text-green-700">20:1</p>
                <p className="text-sm text-green-600 mt-1">20 coins = $1</p>
              </div>
              <FiCreditCard className="h-12 w-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Minimum Withdrawal Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-700">
              Minimum withdrawal: 200 coins ($10). You currently have {userCoins} coins.
            </p>
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Request Withdrawal</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="coinToWithdraw" className="block text-sm font-medium text-slate-700 mb-2">
                Coins to Withdraw *
              </label>
              <input
                type="number"
                id="coinToWithdraw"
                name="coinToWithdraw"
                value={formData.coinToWithdraw}
                onChange={handleInputChange}
                min={MIN_WITHDRAWAL_COINS}
                max={userCoins}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter coins to withdraw"
                disabled={submitting}
              />
              <p className="text-xs text-slate-500 mt-1">
                Min: {MIN_WITHDRAWAL_COINS} coins, Max: {userCoins} coins
              </p>
            </div>

            <div>
              <label htmlFor="withdrawAmount" className="block text-sm font-medium text-slate-700 mb-2">
                Withdrawal Amount ($)
              </label>
              <input
                type="text"
                id="withdrawAmount"
                value={`$${withdrawalAmount}`}
                readOnly
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
              />
              <p className="text-xs text-slate-500 mt-1">
                Automatically calculated (20 coins = $1)
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="paymentSystem" className="block text-sm font-medium text-slate-700 mb-2">
              Payment System *
            </label>
            <select
              id="paymentSystem"
              name="paymentSystem"
              value={formData.paymentSystem}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting}
            >
              <option value="">Select payment system</option>
              {paymentSystems.map(system => (
                <option key={system.value} value={system.value}>
                  {system.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-2">
              Account Number *
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your account number"
              disabled={submitting}
            />
          </div>

          <div className="pt-4">
            {formData.coinToWithdraw && formData.paymentSystem && formData.accountNumber ? (
              // All fields are filled, check if withdrawal is valid
              userCoins < MIN_WITHDRAWAL_COINS ? (
                <div className="w-full px-6 py-3 bg-red-100 text-red-700 text-center rounded-lg border border-red-200">
                  Insufficient coins. You need at least {MIN_WITHDRAWAL_COINS} coins to withdraw.
                </div>
              ) : parseInt(formData.coinToWithdraw) < MIN_WITHDRAWAL_COINS ? (
                <div className="w-full px-6 py-3 bg-red-100 text-red-700 text-center rounded-lg border border-red-200">
                  Minimum withdrawal is {MIN_WITHDRAWAL_COINS} coins (${MIN_WITHDRAWAL_COINS / COIN_TO_DOLLAR_RATE}). You entered {formData.coinToWithdraw} coins.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiDollarSign className="h-4 w-4 mr-2" />
                      Withdraw ${withdrawalAmount}
                    </>
                  )}
                </button>
              )
            ) : (
              <div className="w-full px-6 py-3 bg-red-100 text-red-700 text-center rounded-lg border border-red-200">
                Please fill in all fields to proceed
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Withdrawal History</h2>
        </div>
        
        {withdrawals.length === 0 ? (
          <div className="p-12 text-center">
            <FiDollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Withdrawals Yet</h3>
            <p className="text-slate-500">Your withdrawal requests will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {withdrawals.map((withdrawal) => {
                  const statusConfig = getStatusConfig(withdrawal.status);
                  return (
                    <tr key={withdrawal._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {formatDate(withdrawal.withdrawDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{withdrawal.withdrawalCoin} coins</p>
                          <p className="text-xs text-green-600">${withdrawal.withdrawalAmount}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 capitalize">
                        {withdrawal.paymentSystem}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {withdrawal.accountNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerWithdrawals; 