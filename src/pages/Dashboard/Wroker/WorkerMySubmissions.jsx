import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';

const statusColor = status => {
  if (status === 'approved') return 'bg-green-100 text-green-700';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
  if (status === 'rejected') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-700';
};

const WorkerMySubmissions = () => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    setLoading(true);
    // Placeholder: Fetch submissions from server
    // const res = await fetch(`http://localhost:5000/submissions?workerEmail=${user.email}`);
    // const data = await res.json();
    // setSubmissions(data);
    setSubmissions([
      {
        _id: '1',
        taskTitle: 'Watch my YouTube video and comment',
        buyerName: 'John Doe',
        submissionDate: '2024-06-20',
        payableAmount: 10,
        submissionDetails: 'I watched the video and left a comment as requested.',
        status: 'approved',
      },
      {
        _id: '2',
        taskTitle: 'Sign up and test my app',
        buyerName: 'Jane Smith',
        submissionDate: '2024-06-22',
        payableAmount: 15,
        submissionDetails: 'Signed up and tested the app. Here is my feedback...',
        status: 'pending',
      },
      {
        _id: '3',
        taskTitle: 'Try my new service',
        buyerName: 'Alice Brown',
        submissionDate: '2024-06-25',
        payableAmount: 12,
        submissionDetails: 'Tried the service, but had some issues.',
        status: 'rejected',
      },
    ]);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">My Submissions</h2>
      {submissions.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No submissions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Task Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Buyer Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Submission Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Payable</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Submission Details</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {submissions.map(sub => (
                <tr key={sub._id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-800">{sub.taskTitle}</td>
                  <td className="px-4 py-2 text-slate-700">{sub.buyerName}</td>
                  <td className="px-4 py-2 text-slate-700">{sub.submissionDate}</td>
                  <td className="px-4 py-2 text-green-600 font-semibold">${sub.payableAmount}</td>
                  <td className="px-4 py-2 text-slate-700">{sub.submissionDetails.length > 40 ? sub.submissionDetails.slice(0, 40) + '...' : sub.submissionDetails}</td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(sub.status)}`}>{sub.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkerMySubmissions; 