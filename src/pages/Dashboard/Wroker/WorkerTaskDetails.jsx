import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../../auth/AuthProvider';

const WorkerTaskDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    // Placeholder: Fetch task by ID from server
    // const res = await fetch(`http://localhost:5000/tasks/${id}`);
    // const data = await res.json();
    // setTask(data);
    setTask({
      _id: id,
      title: 'Watch my YouTube video and comment',
      detail: 'Watch the full video and leave a meaningful comment.',
      buyerName: 'John Doe',
      buyerEmail: 'john@example.com',
      completionDate: '2024-07-01',
      payableAmount: 10,
      requiredWorkers: 50,
      imageUrl: '',
      submissionInfo: 'Screenshot of your comment',
    });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!submissionDetails.trim()) {
      setError('Submission details are required.');
      return;
    }
    // Placeholder: POST submission to server
    // await fetch('http://localhost:5000/submissions', { ... })
    setSuccess('Submission sent!');
    setSubmissionDetails('');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!task) {
    return <div className="text-center text-slate-500 py-12">Task not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-100 mt-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Task Details</h2>
      <div className="mb-6">
        <div className="mb-2 text-lg font-semibold text-blue-700">{task.title}</div>
        <div className="mb-2 text-slate-700"><span className="font-medium">Buyer:</span> {task.buyerName} ({task.buyerEmail})</div>
        <div className="mb-2 text-slate-700"><span className="font-medium">Completion Date:</span> {task.completionDate}</div>
        <div className="mb-2 text-green-700 font-semibold"><span className="font-medium text-slate-700">Payable:</span> ${task.payableAmount}</div>
        <div className="mb-2 text-slate-700"><span className="font-medium">Required Workers:</span> {task.requiredWorkers}</div>
        <div className="mb-2 text-slate-700"><span className="font-medium">Submission Info:</span> {task.submissionInfo}</div>
        {task.imageUrl && <img src={task.imageUrl} alt="Task" className="h-32 rounded-md border border-slate-200 mt-2" />}
        <div className="mt-4 text-slate-600">{task.detail}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Submit Your Work</h3>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Submission Details</label>
          <textarea
            name="submissionDetails"
            value={submissionDetails}
            onChange={e => setSubmissionDetails(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50"
            placeholder="Describe your work, paste links, etc."
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default WorkerTaskDetails; 