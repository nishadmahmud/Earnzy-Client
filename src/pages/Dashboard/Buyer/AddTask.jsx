import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useNavigate } from 'react-router';
import { useUserCoins, useRefreshUserCoins } from '../../../hooks/useUserData';
import { FiPlus, FiImage, FiCalendar, FiUsers, FiDollarSign, FiFileText, FiUpload, FiTarget, FiInfo } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const AddTask = () => {
  const { user } = useContext(AuthContext);
  const { coins } = useUserCoins();
  const refreshUserCoins = useRefreshUserCoins();
  const [form, setForm] = useState({
    title: '',
    detail: '',
    requiredWorkers: '',
    payableAmount: '',
    completionDate: '',
    submissionInfo: '',
    imageUrl: '',
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useDocumentTitle('Add New Task');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
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
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setForm({ ...form, imageUrl: data.data.url });
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, imageUrl: '' });
    setImagePreview(null);
  };

  const validateForm = () => {
    const requiredFields = ['title', 'detail', 'requiredWorkers', 'payableAmount', 'completionDate', 'submissionInfo'];
    
    for (const field of requiredFields) {
      if (!form[field].trim()) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const workers = parseInt(form.requiredWorkers);
    const payment = parseInt(form.payableAmount);
    
    if (workers < 1 || workers > 100) {
      toast.error('Number of workers must be between 1 and 100');
      return false;
    }

    if (payment < 1) {
      toast.error('Payment amount must be at least 1 coin');
      return false;
    }

    const totalCost = workers * payment;
    if (totalCost > coins) {
      toast.error(`Insufficient coins. You need ${totalCost} coins but have ${coins}`);
      return false;
    }

    const selectedDate = new Date(form.completionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      toast.error('Completion date must be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const taskData = {
        ...form,
        buyerEmail: user.email,
        buyerName: user.displayName || user.name || user.email,
        requiredWorkers: parseInt(form.requiredWorkers),
        payableAmount: parseInt(form.payableAmount),
        totalPayable: parseInt(form.requiredWorkers) * parseInt(form.payableAmount),
        status: 'active',
        postedAt: new Date().toISOString(),
      };

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        toast.success('Task created successfully!');
        await refreshUserCoins();
        navigate('/dashboard/my-tasks');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error creating task. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  const totalCost = form.requiredWorkers && form.payableAmount ? 
    parseInt(form.requiredWorkers) * parseInt(form.payableAmount) : 0;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm"
            >
              <FiPlus className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Create New Task</h1>
              <p className="text-sm text-slate-600">Post a task for workers to complete</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-blue-200/50">
            <FiDollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">{coins} coins</span>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-800 flex items-center">
              <FiFileText className="h-4 w-4 mr-2 text-blue-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Completion Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="completionDate"
                    value={form.completionDate}
                    onChange={handleChange}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all duration-200"
                    required
                  />
                  <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Task Description *
              </label>
              <textarea
                name="detail"
                value={form.detail}
                onChange={handleChange}
                placeholder="Describe your task in detail..."
                rows={3}
                className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all duration-200 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Submission Requirements *
              </label>
              <textarea
                name="submissionInfo"
                value={form.submissionInfo}
                onChange={handleChange}
                placeholder="What should workers submit as proof of completion?"
                rows={2}
                className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition-all duration-200 resize-none"
                required
              />
            </div>
          </div>

          {/* Payment & Workers */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-800 flex items-center">
              <FiDollarSign className="h-4 w-4 mr-2 text-emerald-600" />
              Payment & Workers
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Number of Workers *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="requiredWorkers"
                    value={form.requiredWorkers}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-sm transition-all duration-200"
                    required
                  />
                  <FiUsers className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Payment per Worker *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="payableAmount"
                    value={form.payableAmount}
                    onChange={handleChange}
                    placeholder="Amount in coins"
                    min="1"
                    className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-sm transition-all duration-200"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500 pointer-events-none">coins</span>
                </div>
              </div>
            </div>

            {totalCost > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border ${
                  totalCost > coins 
                    ? 'bg-red-50/60 border-red-200/50' 
                    : 'bg-emerald-50/60 border-emerald-200/50'
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <FiInfo className={`h-4 w-4 ${totalCost > coins ? 'text-red-600' : 'text-emerald-600'}`} />
                    <span className={`font-semibold ${totalCost > coins ? 'text-red-700' : 'text-emerald-700'}`}>
                      Total Cost: {totalCost} coins
                    </span>
                  </div>
                  <span className={`text-xs ${totalCost > coins ? 'text-red-600' : 'text-emerald-600'}`}>
                    {totalCost > coins ? `Need ${totalCost - coins} more coins` : `${coins - totalCost} coins remaining`}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-800 flex items-center">
              <FiImage className="h-4 w-4 mr-2 text-violet-600" />
              Task Image (Optional)
            </h3>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-white/50 rounded-xl p-6 text-center bg-white/20 backdrop-blur-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="imageUpload"
                  disabled={imageUploading}
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center"
                  >
                    {imageUploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-violet-600/30 border-t-violet-600 rounded-full"
                      />
                    ) : (
                      <FiUpload className="h-6 w-6 text-violet-600" />
                    )}
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {imageUploading ? 'Uploading...' : 'Upload Task Image'}
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Task preview"
                  className="w-full max-w-md h-48 object-cover rounded-xl shadow-sm"
                />
                <motion.button
                  type="button"
                  onClick={removeImage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                >
                  ×
                </motion.button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <HiSparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-slate-600">Ready to post your task?</span>
            </div>
            
            <motion.button
              type="submit"
              disabled={submitting || totalCost > coins}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  Creating Task...
                </>
              ) : (
                <>
                  <FiPlus className="h-4 w-4 mr-2" />
                  Create Task
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddTask;