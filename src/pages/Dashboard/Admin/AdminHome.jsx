import React, { useEffect, useState } from 'react';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch stats and withdraw requests in parallel
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Placeholder: Fetch stats
        // const statsRes = await fetch('http://localhost:5000/admin/stats');
        // const statsData = await statsRes.json();
        // setStats(statsData);
        setStats({
          totalWorkers: 12,
          totalBuyers: 8,
          totalCoins: 3200,
          totalPayments: 1200,
        });
        // Placeholder: Fetch withdraw requests
        // const reqRes = await fetch('http://localhost:5000/admin/withdrawals?status=pending');
        // const reqData = await reqRes.json();
        // setRequests(reqData);
        setRequests([
          {
            _id: '1',
            user: { name: 'Alice', email: 'alice@example.com' },
            amount: 400,
            paymentSystem: 'Bkash',
            accountNumber: '017XXXXXXXX',
            requestedAt: '2024-07-01',
            status: 'pending',
          },
          {
            _id: '2',
            user: { name: 'Bob', email: 'bob@example.com' },
            amount: 250,
            paymentSystem: 'Nagad',
            accountNumber: '018XXXXXXXX',
            requestedAt: '2024-07-02',
            status: 'pending',
          },
        ]);
      } catch {
        setStats({ totalWorkers: 0, totalBuyers: 0, totalCoins: 0, totalPayments: 0 });
        setRequests([]);
        setError('Failed to fetch admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleApprove = async (requestId) => {
    setSuccess('');
    setError('');
    try {
      // Placeholder: Update withdrawal status and decrease user coins
      // await fetch(`http://localhost:5000/admin/withdrawals/${requestId}/approve`, { method: 'PUT' })
      setRequests(reqs => reqs.filter(r => r._id !== requestId));
      setSuccess('Withdrawal approved and user coins updated.');
    } catch {
      setError('Failed to approve withdrawal.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-10">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Workers</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalWorkers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <span className="text-blue-600 font-bold text-lg">W</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Buyers</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalBuyers}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <span className="text-yellow-600 font-bold text-lg">B</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Coins</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalCoins}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <span className="text-green-600 font-bold text-lg">C</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Payments</p>
              <p className="text-2xl font-bold text-slate-800">${stats.totalPayments}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <span className="text-purple-600 font-bold text-lg">$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Requests Section */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Pending Withdraw Requests</h2>
        {error && <div className="mb-3 text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="mb-3 text-green-600 text-sm text-center">{success}</div>}
        {requests.length === 0 ? (
          <div className="text-center text-slate-500 py-12">No pending withdrawal requests.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount (Coins)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment System</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Requested At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {requests.map(req => (
                  <tr key={req._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">{req.user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-700">{req.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.paymentSystem}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.accountNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{req.requestedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold shadow-sm transition-colors"
                        onClick={() => handleApprove(req._id)}
                      >
                        Payment Success
                      </button>
                    </td>
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

export default AdminHome; 