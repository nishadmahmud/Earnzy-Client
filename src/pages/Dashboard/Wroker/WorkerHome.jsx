import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';

const WorkerHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalPending: 0,
    totalEarnings: 0,
  });
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchWorkerData();
    }
  }, [user]);

  const fetchWorkerData = async () => {
    setLoading(true);
    // Placeholder: Fetch stats and approved submissions from server
    // const res = await fetch(`http://localhost:5000/worker/dashboard?email=${user.email}`);
    // const data = await res.json();
    // setStats(data.stats);
    // setApprovedSubmissions(data.approvedSubmissions);
    setStats({ totalSubmissions: 0, totalPending: 0, totalEarnings: 0 });
    setApprovedSubmissions([]); // TODO: Replace with real data
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Submissions</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalSubmissions}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <span className="text-blue-600 font-bold text-lg">S</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Pending</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalPending}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">P</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-700">${stats.totalEarnings}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <span className="text-green-600 font-bold text-lg">E</span>
            </div>
          </div>
        </div>
      </div>

      {/* Approved Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Approved Submissions</h2>
          <p className="text-sm text-slate-600">All your approved submissions</p>
        </div>
        {approvedSubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">No approved submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Task Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payable Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Buyer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {approvedSubmissions.map(sub => (
                  <tr key={sub._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">{sub.taskTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">${sub.payableAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sub.buyerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-700 font-bold">{sub.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerHome; 