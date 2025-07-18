import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useUserCoins } from '../../../hooks/useUserData';

const paymentSystems = [
  'Bkash',
  'Rocket',
  'Nagad',
  'Bank Transfer',
  'Other',
];

const COIN_TO_DOLLAR = 20;
const MIN_WITHDRAW_COIN = 200;

const WorkerWithdrawals = () => {
  const { user } = useContext(AuthContext);
  const { coins: userCoins } = useUserCoins();
  const [withdrawCoin, setWithdrawCoin] = useState(MIN_WITHDRAW_COIN);
  const [paymentSystem, setPaymentSystem] = useState(paymentSystems[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
          

  const withdrawAmount = (withdrawCoin && withdrawCoin >= MIN_WITHDRAW_COIN) ? (withdrawCoin / COIN_TO_DOLLAR) : 0;

  const handleWithdrawCoinChange = (e) => {
    let value = Number(e.target.value);
    if (value > userCoins) value = userCoins;
    if (value < MIN_WITHDRAW_COIN) value = MIN_WITHDRAW_COIN;
    setWithdrawCoin(value);
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (withdrawCoin > userCoins) {
      setError('You cannot withdraw more coins than you have.');
      return;
    }
    if (withdrawCoin < MIN_WITHDRAW_COIN) {
      setError(`Minimum withdrawal is ${MIN_WITHDRAW_COIN} coins.`);
      return;
    }
    if (!accountNumber.trim()) {
      setError('Account number is required.');
      return;
    }
    // Placeholder: Save withdrawal to server
    // await fetch('http://localhost:5000/withdrawals', { ... })
    setSuccess('Withdrawal request submitted!');
    setWithdrawCoin(MIN_WITHDRAW_COIN);
    setAccountNumber('');
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Withdrawals</h2>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-slate-700 text-lg">Current Coins: <span className="font-bold text-blue-600">{userCoins}</span></div>
        <div className="text-slate-700 text-lg">Withdrawal Amount: <span className="font-bold text-green-700">${(userCoins / COIN_TO_DOLLAR).toFixed(2)}</span></div>
      </div>
      {userCoins < MIN_WITHDRAW_COIN ? (
        <div className="text-center text-red-600 font-semibold py-8">Insufficient coin. Minimum {MIN_WITHDRAW_COIN} coins required to withdraw.</div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Coin to Withdraw</label>
            <input
              type="number"
              min={MIN_WITHDRAW_COIN}
              max={userCoins}
              value={withdrawCoin}
              onChange={handleWithdrawCoinChange}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Withdraw Amount ($)</label>
            <input
              type="number"
              value={withdrawAmount}
              readOnly
              className="w-full px-4 py-2 border border-slate-200 rounded-md bg-slate-100 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Payment System</label>
            <select
              value={paymentSystem}
              onChange={e => setPaymentSystem(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
            >
              {paymentSystems.map(system => (
                <option key={system} value={system}>{system}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Withdraw
          </button>
        </form>
      )}
      <div className="mt-6 text-slate-500 text-xs text-center">* 20 coins = $1. Minimum withdrawal is 200 coins ($10).</div>
    </div>
  );
};

export default WorkerWithdrawals; 