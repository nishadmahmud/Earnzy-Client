import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../auth/AuthProvider';
import { useNavigate } from 'react-router';

const IMAGEBB_API_KEY = 'YOUR_IMAGEBB_API_KEY'; // Replace with your actual key

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userCoins, setUserCoins] = useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch buyer's available coins
    if (user?.email) {
      fetch(`http://localhost:5000/users?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => setUserCoins(data.coins || 0));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm(f => ({ ...f, imageUrl: data.data.url }));
      } else {
        setError('Image upload failed.');
      }
    } catch {
      setError('Image upload failed.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const totalPayable = Number(form.requiredWorkers) * Number(form.payableAmount);
    if (totalPayable > userCoins) {
      alert('Not available Coin. Purchase Coin');
      navigate('/dashboard/purchase-coin');
      return;
    }
    // Placeholder: POST to server
    // await fetch('http://localhost:5000/tasks', { ... })
    setSuccess('Task added successfully!');
    // Optionally, reduce coins in UI
    setUserCoins(c => c - totalPayable);
    setForm({
      title: '',
      detail: '',
      requiredWorkers: '',
      payableAmount: '',
      completionDate: '',
      submissionInfo: '',
      imageUrl: '',
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Add New Task</h2>
      {error && <div className="mb-3 text-red-600 text-sm text-center">{error}</div>}
      {success && <div className="mb-3 text-green-600 text-sm text-center">{success}</div>}
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
          <div className="flex items-center gap-4">
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
              placeholder="Paste image URL or upload below"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block"
              disabled={imageUploading}
            />
          </div>
          {imageUploading && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
          {form.imageUrl && (
            <div className="mt-2">
              <img src={form.imageUrl} alt="Task" className="h-32 rounded-md border border-slate-200" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="text-slate-600 text-sm">
            <span className="font-medium">Total Payable:</span> {form.requiredWorkers && form.payableAmount ? Number(form.requiredWorkers) * Number(form.payableAmount) : 0} coins
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={imageUploading}
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask; 