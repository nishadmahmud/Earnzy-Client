import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiEye, FiCheck, FiX, FiDollarSign, FiUsers, FiClipboard } from 'react-icons/fi';

const BuyerHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingWorkers: 0,
    totalPayments: 0
  });
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchBuyerData();
    }
  }, [user]);

  const fetchBuyerData = async () => {
    try {
      // Fetch buyer stats and pending submissions
      const response = await fetch(`http://localhost:5000/buyer/dashboard?email=${encodeURIComponent(user.email)}`);
      const data = await response.json();
      
      setStats(data.stats);
      setPendingSubmissions(data.pendingSubmissions);
    } catch (error) {
      console.error('Error fetching buyer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleApprove = async (submissionId) => {
    try {
      const response = await fetch(`http://localhost:5000/submissions/${submissionId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerEmail: user.email })
      });
      
      if (response.ok) {
        // Refresh data
        fetchBuyerData();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      const response = await fetch(`http://localhost:5000/submissions/${submissionId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerEmail: user.email })
      });
      
      if (response.ok) {
        // Refresh data
        fetchBuyerData();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiClipboard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Workers</p>
              <p className="text-2xl font-bold text-slate-800">{stats.pendingWorkers}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FiUsers className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Payments</p>
              <p className="text-2xl font-bold text-slate-800">${stats.totalPayments}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Task Review Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Tasks To Review</h2>
          <p className="text-sm text-slate-600">Review pending submissions for your tasks</p>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">No pending submissions to review</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Worker Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Task Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payable Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {pendingSubmissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full mr-3"
                          src={submission.worker.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(submission.worker.name)}`}
                          alt={submission.worker.name}
                        />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{submission.worker.name}</div>
                          <div className="text-sm text-slate-500">{submission.worker.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{submission.task.title}</div>
                      <div className="text-sm text-slate-500">{submission.task.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">${submission.payableAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSubmission(submission)}
                          className="inline-flex items-center px-3 py-1 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiEye className="h-3 w-3 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(submission._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiCheck className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(submission._id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FiX className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Submission Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Task Information</h4>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm"><span className="font-medium">Title:</span> {selectedSubmission.task.title}</p>
                  <p className="text-sm"><span className="font-medium">Description:</span> {selectedSubmission.task.description}</p>
                  <p className="text-sm"><span className="font-medium">Payable Amount:</span> ${selectedSubmission.payableAmount}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Worker Information</h4>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedSubmission.worker.name}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedSubmission.worker.email}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Submission Details</h4>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm"><span className="font-medium">Submission Text:</span></p>
                  <p className="text-sm mt-1">{selectedSubmission.submissionText}</p>
                  {selectedSubmission.attachments && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Attachments:</p>
                      <ul className="text-sm mt-1">
                        {selectedSubmission.attachments.map((attachment, index) => (
                          <li key={index} className="text-blue-600 hover:underline">
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                              {attachment.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => handleReject(selectedSubmission._id)}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <FiX className="h-4 w-4 inline mr-1" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedSubmission._id)}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <FiCheck className="h-4 w-4 inline mr-1" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome; 