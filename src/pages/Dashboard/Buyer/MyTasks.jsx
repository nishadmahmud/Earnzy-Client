import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiEdit, FiTrash2, FiX, FiSave, FiClipboard, FiUsers, FiDollarSign, FiCalendar, FiEye, FiTarget, FiImage, FiUpload } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useRefreshUserCoins } from '../../../hooks/useUserData';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const MyTasks = () => {
  const { user } = useContext(AuthContext);
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
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useDocumentTitle('My Tasks');

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks?buyer=${encodeURIComponent(user.email)}`);
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        toast.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task._id);
    const formData = {
      title: task.title,
      detail: task.detail,
      requiredWorkers: task.requiredWorkers,
      payableAmount: task.payableAmount,
      completionDate: task.completionDate.split('T')[0],
      submissionInfo: task.submissionInfo,
      imageUrl: task.imageUrl || ''
    };
    setEditForm(formData);
    
    // Set image preview if task has an image
    if (task.imageUrl) {
      setImagePreview(task.imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleCancelEdit = () => {
    setEditTask(null);
    setEditForm({ 
      title: '', 
      detail: '', 
      requiredWorkers: '', 
      payableAmount: '', 
      completionDate: '', 
      submissionInfo: '', 
      imageUrl: '' 
    });
    setImagePreview(null);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    console.log('🔍 File selected:', file);
    if (!file) {
      setImagePreview(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('🖼️ Preview created, setting imagePreview');
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary via server
    console.log('☁️ Starting upload to Cloudinary...');
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Upload successful, URL:', data.imageUrl);
        console.log('📝 Current editForm before update:', editForm);
        setEditForm({ ...editForm, imageUrl: data.imageUrl });
        console.log('📝 EditForm updated with imageUrl');
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('❌ Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      console.log('🏁 Upload finished, setting imageUploading to false');
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setEditForm({ ...editForm, imageUrl: '' });
    setImagePreview(null);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    if (!editForm.title.trim() || !editForm.detail.trim() || !editForm.submissionInfo.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks/${editTask}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editForm,
          buyerEmail: user.email,
          requiredWorkers: parseInt(editForm.requiredWorkers),
          payableAmount: parseInt(editForm.payableAmount),
          totalPayable: parseInt(editForm.requiredWorkers) * parseInt(editForm.payableAmount),
        }),
      });

      if (response.ok) {
        toast.success('Task updated successfully!');
        await fetchTasks();
        handleCancelEdit();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error updating task');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setDeleting(taskId);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerEmail: user.email
        }),
      });

      if (response.ok) {
        toast.success('Task deleted successfully!');
        await fetchTasks();
        await refreshUserCoins();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200/50';
      case 'completed':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200/50';
      case 'paused':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200/50';
      default:
        return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200/50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  const activeTasks = tasks.filter(task => task.status === 'active');
  const totalSpent = tasks.reduce((sum, task) => sum + (task.totalPayable || 0), 0);

  const statsCards = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: <FiClipboard className="h-4 w-4" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Tasks',
      value: activeTasks.length,
      icon: <FiTarget className="h-4 w-4" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Total Spent',
      value: `${totalSpent} coins`,
      icon: <FiDollarSign className="h-4 w-4" />,
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4"
    >
      {/* Stats Section */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {statsCards.map((stat) => (
          <motion.div
            key={stat.title}
            variants={fadeInUp}
            whileHover={{ scale: 1.01, y: -1 }}
            className="group bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-600 group-hover:text-slate-700 transition-colors">
                  {stat.title}
                </p>
                <p className="text-lg font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {stat.value}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`p-2 ${stat.bgColor} rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300`}
              >
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tasks List */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm"
            >
              <FiClipboard className="h-3 w-3 text-white" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">My Tasks</h2>
              <p className="text-xs text-slate-600">Manage and track your posted tasks</p>
            </div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="p-8 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FiClipboard className="h-6 w-6 text-slate-400" />
            </motion.div>
            <h3 className="text-base font-semibold text-slate-600 mb-1">No Tasks Yet</h3>
            <p className="text-sm text-slate-500">Create your first task to get started</p>
          </motion.div>
        ) : (
          <div className="divide-y divide-white/20">
            {tasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-white/40 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                {editTask === task._id ? (
                  // Edit Form
                  <form onSubmit={handleUpdateTask} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        placeholder="Task title"
                        required
                      />
                      <input
                        type="date"
                        value={editForm.completionDate}
                        onChange={(e) => setEditForm({ ...editForm, completionDate: e.target.value })}
                        className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        required
                      />
                    </div>
                    
                    <textarea
                      value={editForm.detail}
                      onChange={(e) => setEditForm({ ...editForm, detail: e.target.value })}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                      rows={2}
                      placeholder="Task description"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={editForm.requiredWorkers}
                        onChange={(e) => setEditForm({ ...editForm, requiredWorkers: e.target.value })}
                        className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                        placeholder="Workers needed"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        value={editForm.payableAmount}
                        onChange={(e) => setEditForm({ ...editForm, payableAmount: e.target.value })}
                        className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                        placeholder="Payment per worker"
                        min="1"
                        required
                      />
                    </div>

                    <textarea
                      value={editForm.submissionInfo}
                      onChange={(e) => setEditForm({ ...editForm, submissionInfo: e.target.value })}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm resize-none"
                      rows={2}
                      placeholder="Submission requirements (e.g., Screenshot, Video, Document)"
                      required
                    />

                    {/* Image Upload Section */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Task Image (Optional)
                      </label>
                      
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-white/50 rounded-xl p-4 text-center bg-white/20 backdrop-blur-sm">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id={`imageUpload-${editTask}`}
                            disabled={imageUploading}
                          />
                          <label
                            htmlFor={`imageUpload-${editTask}`}
                            className="cursor-pointer flex flex-col items-center space-y-2"
                          >
                            <motion.div
                              whileHover={{ scale: imageUploading ? 1 : 1.05 }}
                              className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center"
                            >
                              {imageUploading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-violet-600/30 border-t-violet-600 rounded-full"
                                />
                              ) : (
                                <FiUpload className="h-4 w-4 text-violet-600" />
                              )}
                            </motion.div>
                            <div>
                              <p className="text-xs font-semibold text-slate-700">
                                {imageUploading ? 'Uploading to Cloudinary...' : 'Upload Image'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {imageUploading ? 'Please wait...' : 'PNG, JPG up to 5MB'}
                              </p>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Task preview"
                            className="w-full max-w-xs h-32 object-cover rounded-xl shadow-sm"
                          />
                          {imageUploading && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-violet-600/30 border-t-violet-600 rounded-full"
                                />
                                <span className="text-xs font-semibold text-slate-700">Uploading...</span>
                              </div>
                            </div>
                          )}
                          <motion.button
                            type="button"
                            onClick={removeImage}
                            disabled={imageUploading}
                            whileHover={{ scale: imageUploading ? 1 : 1.05 }}
                            whileTap={{ scale: imageUploading ? 1 : 0.95 }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ×
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Live Preview of Total Cost */}
                    {editForm.requiredWorkers && editForm.payableAmount && (
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-blue-700">Total Cost:</span>
                          <span className="font-bold text-blue-800">
                            {parseInt(editForm.requiredWorkers || 0) * parseInt(editForm.payableAmount || 0)} coins
                          </span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {editForm.requiredWorkers} workers × {editForm.payableAmount} coins each
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-2">
                      <motion.button
                        type="button"
                        onClick={handleCancelEdit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-1 bg-white/60 border border-white/50 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white/80 transition-all duration-200"
                      >
                        <FiX className="h-3 w-3 mr-1 inline" />
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={updating}
                        whileHover={{ scale: updating ? 1 : 1.02 }}
                        whileTap={{ scale: updating ? 1 : 0.98 }}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-green-700 text-xs font-semibold text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50"
                      >
                        {updating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full mr-1 inline-block"
                          />
                        ) : (
                          <FiSave className="h-3 w-3 mr-1 inline" />
                        )}
                        {updating ? 'Saving...' : 'Save Changes'}
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  // Task Display
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-base font-semibold text-slate-800">{task.title}</h3>
                          <motion.span
                            whileHover={{ scale: 1.02 }}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(task.status)}`}
                          >
                            {task.status}
                          </motion.span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{task.detail}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <FiUsers className="h-3 w-3 text-blue-600" />
                            <span className="text-slate-600">{task.requiredWorkers} workers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiDollarSign className="h-3 w-3 text-emerald-600" />
                            <span className="text-slate-600">{task.payableAmount} coins each</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="h-3 w-3 text-violet-600" />
                            <span className="text-slate-600">{formatDate(task.completionDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HiSparkles className="h-3 w-3 text-amber-600" />
                            <span className="font-semibold text-slate-700">{task.totalPayable || (task.requiredWorkers * task.payableAmount)} coins total</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-4">
                        <motion.button
                          onClick={() => handleEdit(task)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                        >
                          <FiEdit className="h-3 w-3" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteTask(task._id)}
                          disabled={deleting === task._id}
                          whileHover={{ scale: deleting === task._id ? 1 : 1.05 }}
                          whileTap={{ scale: deleting === task._id ? 1 : 0.95 }}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm disabled:opacity-50"
                        >
                          {deleting === task._id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border-2 border-red-600/30 border-t-red-600 rounded-full"
                            />
                          ) : (
                            <FiTrash2 className="h-3 w-3" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MyTasks; 