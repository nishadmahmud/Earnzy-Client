import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiEdit, FiTrash2, FiX, FiSave } from 'react-icons/fi';

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', detail: '', submissionInfo: '' });
  const [userCoins, setUserCoins] = useState(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setUserCoins(data.coins || 0));
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    // Placeholder: Fetch tasks from server
    // const res = await fetch(`http://localhost:5000/tasks?buyer=${user.email}`);
    // const data = await res.json();
    // setTasks(data);
    setTasks([]); // TODO: Replace with real data
    setLoading(false);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setEditForm({
      title: task.title,
      detail: task.detail,
      submissionInfo: task.submissionInfo,
    });
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    // Placeholder: Update task on server
    // await fetch(`http://localhost:5000/tasks/${editTask._id}`, { method: 'PUT', ... })
    setSuccess('Task updated!');
    setEditTask(null);
    fetchTasks();
  };

  const handleDelete = async (task) => {
    // Calculate refill amount for uncompleted tasks
    const refillAmount = task.requiredWorkers * task.payableAmount; // Simplified
    // Placeholder: Delete task from server
    // await fetch(`http://localhost:5000/tasks/${task._id}`, { method: 'DELETE' })
    // Placeholder: Update user's coins
    setUserCoins(c => c + refillAmount);
    setSuccess('Task deleted and coins refunded!');
    fetchTasks();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">My Tasks</h2>
      {error && <div className="mb-3 text-red-600 text-sm text-center">{error}</div>}
      {success && <div className="mb-3 text-green-600 text-sm text-center">{success}</div>}
      {tasks.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No tasks found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Detail</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Required Workers</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Payable</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Completion Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Submission Info</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Image</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {tasks
                .sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate))
                .map(task => (
                  <tr key={task._id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-800">{task.title}</td>
                    <td className="px-4 py-2 text-slate-700">{task.detail}</td>
                    <td className="px-4 py-2 text-slate-700">{task.requiredWorkers}</td>
                    <td className="px-4 py-2 text-green-600 font-semibold">{task.payableAmount}</td>
                    <td className="px-4 py-2 text-slate-700">{task.completionDate}</td>
                    <td className="px-4 py-2 text-slate-700">{task.submissionInfo}</td>
                    <td className="px-4 py-2">
                      {task.imageUrl && <img src={task.imageUrl} alt="Task" className="h-12 rounded-md border border-slate-200" />}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="p-2 rounded bg-red-50 hover:bg-red-100 text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Update Task</h3>
              <button onClick={() => setEditTask(null)} className="text-slate-400 hover:text-slate-600"><FiX className="h-6 w-6" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Detail</label>
                <textarea
                  name="detail"
                  value={editForm.detail}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Submission Info</label>
                <input
                  type="text"
                  name="submissionInfo"
                  value={editForm.submissionInfo}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setEditTask(null)} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">Cancel</button>
              <button onClick={handleEditSave} className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"><FiSave /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks; 