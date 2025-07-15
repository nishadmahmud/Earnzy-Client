import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    setLoading(true);
    // Placeholder: Fetch payments from server
    // const res = await fetch(`http://localhost:5000/payments?buyer=${user.email}`);
    // const data = await res.json();
    // setPayments(data);
    setPayments([]); // TODO: Replace with real data
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Payment History</h2>
      {payments.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No payments found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Payment ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Amount ($)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Coins</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {payments.map(payment => (
                <tr key={payment._id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-800">{payment._id}</td>
                  <td className="px-4 py-2 text-slate-700">{new Date(payment.date).toLocaleString()}</td>
                  <td className="px-4 py-2 text-green-600 font-semibold">{payment.amount}</td>
                  <td className="px-4 py-2 text-blue-700 font-semibold">{payment.coins}</td>
                  <td className="px-4 py-2 text-slate-700">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 