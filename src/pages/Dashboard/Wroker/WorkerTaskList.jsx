import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const WorkerTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    // Placeholder: Fetch tasks from server where required_workers > 0
    // const res = await fetch('http://localhost:5000/tasks/available');
    // const data = await res.json();
    // setTasks(data);
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
    ]);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Available Tasks</h2>
      {tasks.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No available tasks at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map(task => (
            <div key={task._id} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-2">{task.title}</h3>
                <div className="mb-2 text-slate-700"><span className="font-medium">Buyer:</span> {task.buyerName}</div>
                <div className="mb-2 text-slate-700"><span className="font-medium">Completion Date:</span> {task.completionDate}</div>
                <div className="mb-2 text-green-700 font-semibold"><span className="font-medium text-slate-700">Payable:</span> ${task.payableAmount}</div>
                <div className="mb-2 text-slate-700"><span className="font-medium">Required Workers:</span> {task.requiredWorkers}</div>
              </div>
              <button
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => navigate(`/dashboard/tasks/${task._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerTaskList; 