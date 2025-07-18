import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiEdit, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { useUserCoins, useRefreshUserCoins } from '../../../hooks/useUserData';

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const { coins } = useUserCoins();
  const refreshUserCoins = useRefreshUserCoins();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    detail: '', 
    requiredWorkers: '', 
    payableAmount: '', 
    completionDate: '', 
    submissionInfo: '', 
    imageUrl: '' 
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/tasks?buyer=${encodeURIComponent(user.email)}`);
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setEditForm({
      title: task.title,
      detail: task.detail,
      requiredWorkers: task.requiredWorkers,
      payableAmount: task.payableAmount,
      completionDate: task.completionDate,
      submissionInfo: task.submissionInfo,
      imageUrl: task.imageUrl || '',
    });
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    if (!updating) {
      setEditTask(null);
    }
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && editTask) {
        closeModal();
      }
    };

    if (editTask) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [editTask, updating]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      setUpdating(true);
      setError('');
      
      // Validate form data
      if (!editForm.title || !editForm.detail || !editForm.requiredWorkers || !editForm.payableAmount || !editForm.completionDate || !editForm.submissionInfo) {
        setError('All fields are required');
        setUpdating(false);
        return;
      }

      if (Number(editForm.requiredWorkers) <= 0 || Number(editForm.payableAmount) <= 0) {
        setError('Required workers and payable amount must be positive numbers');
        setUpdating(false);
        return;
      }

      console.log('Sending update request:', {
        title: editForm.title,
        detail: editForm.detail,
        requiredWorkers: Number(editForm.requiredWorkers),
        payableAmount: Number(editForm.payableAmount),
        completionDate: editForm.completionDate,
        submissionInfo: editForm.submissionInfo,
        imageUrl: editForm.imageUrl,
        buyerEmail: user.email
      });
      
      const response = await fetch(`http://localhost:5000/tasks/${editTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          detail: editForm.detail,
          requiredWorkers: Number(editForm.requiredWorkers),
          payableAmount: Number(editForm.payableAmount),
          completionDate: editForm.completionDate,
          submissionInfo: editForm.submissionInfo,
          imageUrl: editForm.imageUrl,
          buyerEmail: user.email
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.coinDifference > 0) {
          setSuccess(`Task updated successfully! Additional ${data.coinDifference} coins deducted.`);
        } else if (data.coinDifference < 0) {
          setSuccess(`Task updated successfully! ${Math.abs(data.coinDifference)} coins refunded.`);
        } else {
          setSuccess('Task updated successfully!');
        }
        refreshUserCoins();
        setEditTask(null);
        fetchTasks();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(task._id);
      setError('');
      
      const response = await fetch(`http://localhost:5000/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerEmail: user.email
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Task deleted successfully! ${data.refundAmount > 0 ? `Refunded ${data.refundAmount} coins.` : ''}`);
        refreshUserCoins();
        fetchTasks();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    } finally {
      setDeleting(null);
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
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
        <div className="text-sm text-slate-600">
          <span className="font-medium">Available Coins: </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
            {coins}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="text-green-600 text-sm">{success}</div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center text-slate-500 py-12">
          <div className="text-lg font-medium mb-2">No tasks found</div>
          <p className="text-sm">You haven't created any tasks yet. Start by adding a new task!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detail</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Required Workers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payable Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Completion Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submission Info</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {tasks
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(task => (
                  <tr key={task._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-slate-900">{task.title}</div>
                      <div className="text-xs text-slate-500">Status: {task.status}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-700 max-w-xs truncate" title={task.detail}>
                        {task.detail}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{task.requiredWorkers}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-green-600">{task.payableAmount} coins</div>
                      <div className="text-xs text-slate-500">Total: {task.totalPayable} coins</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{task.completionDate}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-700 max-w-xs truncate" title={task.submissionInfo}>
                        {task.submissionInfo}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {task.imageUrl ? (
                        <img 
                          src={task.imageUrl} 
                          alt="Task" 
                          className="h-12 w-12 object-cover rounded-md border border-slate-200" 
                        />
                      ) : (
                        <div className="h-12 w-12 bg-slate-100 rounded-md flex items-center justify-center">
                          <span className="text-xs text-slate-400">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          title="Edit task"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          disabled={deleting === task._id}
                          className="p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 transition-colors disabled:opacity-50"
                          title="Delete task"
                        >
                          {deleting === task._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <FiTrash2 className="h-4 w-4" />
                          )}
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
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px) brightness(0.8)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
          onWheel={(e) => {
            // Allow scrolling the modal content when scrolling outside
            const modalContent = e.currentTarget.querySelector('.modal-content');
            if (modalContent && !modalContent.contains(e.target)) {
              e.preventDefault();
              modalContent.scrollTop += e.deltaY;
            }
          }}
        >
          {/* Close button positioned outside modal */}
          <button 
            onClick={closeModal} 
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl text-slate-400 hover:text-slate-600 transition-all duration-200 hover:scale-110"
            disabled={updating}
            title="Close modal"
          >
            <FiX className="h-6 w-6" />
          </button>
          
          <div 
            className="modal-content bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Update Task</h3>
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
                  disabled={updating}
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
                  disabled={updating}
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Required Workers</label>
                 <input
                   type="number"
                   name="requiredWorkers"
                   value={editForm.requiredWorkers}
                   onChange={handleEditChange}
                   min="1"
                   max="10000"
                   className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
                   disabled={updating}
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Payable Amount (per worker)</label>
                 <input
                   type="number"
                   name="payableAmount"
                   value={editForm.payableAmount}
                   onChange={handleEditChange}
                   min="1"
                   max="1000"
                   className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
                   disabled={updating}
                 />
               </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Completion Date</label>
                <input
                  type="date"
                  name="completionDate"
                  value={editForm.completionDate}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
                  disabled={updating}
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
                  disabled={updating}
                />
              </div>

                             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (optional)</label>
                 <input
                   type="url"
                   name="imageUrl"
                   value={editForm.imageUrl}
                   onChange={handleEditChange}
                   className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
                   disabled={updating}
                 />
               </div>

               {/* Total Payable Preview */}
               {editForm.requiredWorkers && editForm.payableAmount && (
                 <div className="bg-slate-50 p-3 rounded-md">
                   <div className="flex justify-between items-center text-sm">
                     <span className="font-medium text-slate-700">Total Payable:</span>
                     <span className="font-semibold text-blue-600">
                       {Number(editForm.requiredWorkers) * Number(editForm.payableAmount)} coins
                     </span>
                   </div>
                   <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                     <span>Current Available Coins:</span>
                     <span>{coins} coins</span>
                   </div>
                   {(Number(editForm.requiredWorkers) * Number(editForm.payableAmount)) > coins && (
                     <div className="text-xs text-red-600 mt-1">
                       ⚠️ Insufficient coins! You need {(Number(editForm.requiredWorkers) * Number(editForm.payableAmount)) - coins} more coins.
                     </div>
                   )}
                 </div>
               )}
             </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                             <button 
                 onClick={closeModal} 
                 className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
                 disabled={updating}
               >
                 Cancel
               </button>
              <button 
                onClick={handleEditSave} 
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks; 