import React, { useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiCheckCircle, FiClock, FiDollarSign, FiFileText } from 'react-icons/fi';
import { useWorkerDashboard } from '../../../hooks/useWorkerData';

const WorkerHome = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading: loading, error } = useWorkerDashboard();
  
  const stats = data?.stats || {
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarnings: 0
  };
  
  const approvedSubmissions = data?.approvedSubmissions || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error.message || 'Error loading worker data'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.displayName || 'Worker'}!</h1>
        <p className="text-blue-100">Here's your work summary and recent approved submissions.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Submissions</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalSubmissions}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiFileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Submissions</p>
              <p className="text-3xl font-bold text-slate-800">{stats.pendingSubmissions}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Earnings</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalEarnings} coins</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Approved Submissions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Approved Submissions</h2>
              <p className="text-sm text-slate-600">Your completed and approved work</p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <FiCheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{approvedSubmissions.length} Approved</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {approvedSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <FiCheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No Approved Submissions Yet</h3>
              <p className="text-slate-500">Complete tasks and get them approved to see them here.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Task Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Buyer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payable Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Approved Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {approvedSubmissions.map((submission, index) => (
                  <tr key={submission._id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{submission.task_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700">{submission.buyer_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {submission.payable_amount} coins
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatDate(submission.approvedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Footer */}
        {approvedSubmissions.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">
                Total Approved Submissions: <span className="font-medium">{approvedSubmissions.length}</span>
              </span>
              <span className="text-slate-600">
                Total Earnings: <span className="font-medium text-green-600">{stats.totalEarnings} coins</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerHome; 