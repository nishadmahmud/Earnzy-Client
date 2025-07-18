import React, { useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useWorkerSubmissions } from '../../../hooks/useTaskData';
import { FiFileText, FiUser, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const WorkerMySubmissions = () => {
  const { user } = useContext(AuthContext);
  const { data: submissions = [], isLoading: loading, error } = useWorkerSubmissions(user?.email);

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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
        <p className="text-red-600">{error.message || 'Error fetching submissions'}</p>
      </div>
    );
  }

  const approvedSubmissions = submissions.filter(sub => sub.status === 'approved');
  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const rejectedSubmissions = submissions.filter(sub => sub.status === 'rejected');
  const totalEarnings = approvedSubmissions.reduce((sum, sub) => sum + sub.payableAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">My Submissions</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-700">{submissions.length}</p>
              </div>
              <FiFileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-700">{approvedSubmissions.length}</p>
              </div>
              <FiCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{pendingSubmissions.length}</p>
              </div>
              <FiClock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-700">{totalEarnings} coins</p>
              </div>
              <FiDollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Submissions Yet</h3>
            <p className="text-slate-500">Start working on tasks to see your submissions here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Task Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Submission Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {submissions.map((submission) => {
                  const statusConfig = getStatusConfig(submission.status);
                  return (
                    <tr key={submission._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiFileText className="h-4 w-4 text-slate-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{submission.taskTitle}</p>
                            <p className="text-xs text-slate-500">ID: {submission.taskId}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiUser className="h-4 w-4 text-slate-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{submission.buyerName}</p>
                            <p className="text-xs text-slate-500">{submission.buyerEmail}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiCalendar className="h-4 w-4 text-slate-400 mr-2" />
                          <div>
                            <p className="text-sm text-slate-900">{formatDate(submission.submittedAt)}</p>
                            <p className="text-xs text-slate-500">{formatTime(submission.submittedAt)}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiDollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-semibold text-green-600">
                            {submission.payableAmount} coins
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-slate-600 truncate" title={submission.submissionDetails}>
                            {submission.submissionDetails.length > 50 
                              ? submission.submissionDetails.slice(0, 50) + '...' 
                              : submission.submissionDetails}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {submissions.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-green-600 font-medium">
                {approvedSubmissions.length} approved
              </span>
              <span className="text-yellow-600 font-medium">
                {pendingSubmissions.length} pending
              </span>
              <span className="text-red-600 font-medium">
                {rejectedSubmissions.length} rejected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerMySubmissions; 