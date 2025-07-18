import React from 'react';
import { useAdminDashboard, usePendingWithdrawals, useApproveWithdrawal } from '../../../hooks/useAdminData';
import { FiUsers, FiShoppingCart, FiDollarSign, FiCreditCard, FiCheckCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminHome = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminDashboard();
  const { data: withdrawals = [], isLoading: withdrawalsLoading, error: withdrawalsError } = usePendingWithdrawals();
  const approveWithdrawal = useApproveWithdrawal();

  const handleApprove = async (withdrawalId) => {
    try {
      await approveWithdrawal.mutateAsync(withdrawalId);
      toast.success('Withdrawal approved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to approve withdrawal');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (statsLoading || withdrawalsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (statsError || withdrawalsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">
          {statsError?.message || withdrawalsError?.message || 'Error loading admin data'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Workers</p>
              <p className="text-3xl font-bold text-slate-800">{stats?.totalWorkers || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Buyers</p>
              <p className="text-3xl font-bold text-slate-800">{stats?.totalBuyers || 0}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FiShoppingCart className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Available Coins</p>
              <p className="text-3xl font-bold text-slate-800">{stats?.totalAvailableCoins || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Payments</p>
              <p className="text-3xl font-bold text-slate-800">${stats?.totalPayments || 0}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <FiCreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Requests Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Pending Withdrawal Requests</h2>
              <p className="text-sm text-slate-600 mt-1">
                {withdrawals.length} pending request{withdrawals.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FiClock className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-slate-600">Awaiting approval</span>
            </div>
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="p-12 text-center">
            <FiCheckCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Pending Requests</h3>
            <p className="text-slate-500">All withdrawal requests have been processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Worker Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment System
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Account Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiUsers className="h-4 w-4 text-slate-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{withdrawal.workerName}</p>
                          <p className="text-xs text-slate-500">{withdrawal.workerEmail}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{withdrawal.withdrawalCoin} coins</p>
                        <p className="text-xs text-green-600">${withdrawal.withdrawalAmount}</p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900 capitalize">{withdrawal.paymentSystem}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-mono">{withdrawal.accountNumber}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{formatDate(withdrawal.withdrawDate)}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleApprove(withdrawal._id)}
                        disabled={approveWithdrawal.isPending}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {approveWithdrawal.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="h-4 w-4 mr-2" />
                            Payment Success
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {withdrawals.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Total pending withdrawals: {withdrawals.length}
            </span>
            <span className="text-slate-600">
              Total amount: {withdrawals.reduce((sum, w) => sum + w.withdrawalCoin, 0)} coins 
              (${withdrawals.reduce((sum, w) => sum + w.withdrawalAmount, 0)})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome; 