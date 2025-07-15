import React, { useEffect, useState } from 'react';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all tasks
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Placeholder: Fetch all tasks
        // const tasksRes = await fetch('http://localhost:5000/admin/tasks');
        // const tasksData = await tasksRes.json();
        // setTasks(tasksData);
        setTasks([
          {
            _id: '1',
            title: 'Watch my YouTube video and comment',
            buyerName: 'John Doe',
            completionDate: '2024-07-01',
            payableAmount: 10,
            requiredWorkers: 50,
          },
          {
            _id: '2',
            title: 'Sign up and test my app',
            buyerName: 'Jane Smith',
            completionDate: '2024-07-10',
            payableAmount: 15,
            requiredWorkers: 20,
          },
          {
            _id: '3',
            title: 'Review my product on Amazon',
            buyerName: 'Bob Wilson',
            completionDate: '2024-07-05',
            payableAmount: 8,
            requiredWorkers: 30,
          },
          {
            _id: '4',
            title: 'Follow my social media accounts',
            buyerName: 'Sarah Davis',
            completionDate: '2024-06-30',
            payableAmount: 5,
            requiredWorkers: 100,
          },
        ]);
      } catch {
        setTasks([]);
        setError('Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleViewDetails = (taskId) => {
    // Placeholder: Navigate to task details or show modal
    console.log('View details for task:', taskId);
    setSuccess('Task details functionality coming soon.');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Manage Tasks</h1>
      {error && <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>}
      {success && <div className="mb-4 text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">{success}</div>}
      
      {tasks.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No tasks found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Task Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Buyer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Completion Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payable Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Required Workers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {tasks.map(task => (
                <tr key={task._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">{task.buyerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">{task.completionDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">${task.payableAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">{task.requiredWorkers}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow-sm transition-colors text-sm"
                      onClick={() => handleViewDetails(task._id)}
                    >
                      View Details
                    </button>
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

export default ManageTasks; 