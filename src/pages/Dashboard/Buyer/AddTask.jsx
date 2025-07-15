import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useNavigate } from 'react-router';

const AddTask = () => {
  const { user } = useContext(AuthContext);
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userCoins, setUserCoins] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch buyer's available coins
    if (user?.email) {
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setUserCoins(data.coins || 0))
        .catch(err => console.error('Error fetching user data:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImagePreview(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Automatically upload to Cloudinary
    setImageUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        setForm(f => ({ ...f, imageUrl: data.imageUrl }));
        setSuccess('Image uploaded successfully!');
      } else {
        setError(data.error || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Image upload failed.');
    } finally {
      setImageUploading(false);
    }
  };



  const clearImage = () => {
    setImagePreview(null);
    setForm(f => ({ ...f, imageUrl: '' }));
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    const totalPayable = Number(form.requiredWorkers) * Number(form.payableAmount);
    
    if (totalPayable > userCoins) {
      alert('Not available Coin. Purchase Coin');
      navigate('/dashboard/purchase-coin');
      setSubmitting(false);
      return;
    }
    
    try {
      const taskData = {
        title: form.title,
        detail: form.detail,
        requiredWorkers: form.requiredWorkers,
        payableAmount: form.payableAmount,
        completionDate: form.completionDate,
        submissionInfo: form.submissionInfo,
        imageUrl: form.imageUrl,
        buyerEmail: user.email
      };
      
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Task added successfully!');
        setUserCoins(data.remainingCoins);
        
        // Reset form
        setForm({
          title: '',
          detail: '',
          requiredWorkers: '',
          payableAmount: '',
          completionDate: '',
          submissionInfo: '',
          imageUrl: '',
        });
        
        // Clear image states
        clearImage();
        
      } else {
        setError(data.error || 'Failed to create task');
      }
    } catch (err) {
      console.error('Task creation error:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Add New Task</h2>
      
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
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
            placeholder="e.g. Watch my YouTube video and make a comment"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Task Detail</label>
          <textarea
            name="detail"
            value={form.detail}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
            placeholder="Detailed description of the task"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Required Workers</label>
            <input
              type="number"
              name="requiredWorkers"
              value={form.requiredWorkers}
              onChange={handleChange}
              required
              min={1}
              className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payable Amount (per worker)</label>
            <input
              type="number"
              name="payableAmount"
              value={form.payableAmount}
              onChange={handleChange}
              required
              min={1}
              className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
              placeholder="e.g. 10"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Completion Date</label>
          <input
            type="date"
            name="completionDate"
            value={form.completionDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Submission Info</label>
          <input
            type="text"
            name="submissionInfo"
            value={form.submissionInfo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
            placeholder="e.g. Screenshot, proof, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Task Image</label>
          <div className="space-y-3">
            {/* URL Input */}
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
              placeholder="Paste image URL or upload from device"
            />
            
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={imageUploading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Choose Image
                </label>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
              
                             {/* Image Preview */}
               {imagePreview && (
                 <div className="mt-4">
                   <div className="relative inline-block">
                     <img
                       src={imagePreview}
                       alt="Preview"
                       className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                     />
                     {!imageUploading && (
                       <button
                         type="button"
                         onClick={clearImage}
                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>
                     )}
                     
                     {/* Upload Progress Overlay */}
                     {imageUploading && (
                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                         <div className="text-white text-center">
                           <svg className="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                           </svg>
                           <p className="text-sm">Uploading...</p>
                         </div>
                       </div>
                     )}
                   </div>
                   
                   {/* Upload Status */}
                   {form.imageUrl && !imageUploading && (
                     <div className="mt-2 text-sm text-green-600 flex items-center">
                       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                       Image uploaded successfully!
                     </div>
                   )}
                 </div>
               )}
            </div>
            
            {/* Display uploaded image from URL */}
            {form.imageUrl && !imagePreview && (
              <div className="mt-3">
                <img
                  src={form.imageUrl}
                  alt="Task"
                  className="max-w-full h-48 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
          <div className="text-slate-600 text-sm">
            <div className="font-medium">Available Coins: {userCoins}</div>
            <div className="font-medium text-blue-600">
              Total Payable: {form.requiredWorkers && form.payableAmount ? Number(form.requiredWorkers) * Number(form.payableAmount) : 0} coins
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={imageUploading || submitting}
          >
            {submitting ? 'Creating Task...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask; 