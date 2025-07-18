import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../../../auth/AuthProvider';
import { FiCalendar, FiUser, FiDollarSign, FiUsers, FiFileText, FiArrowLeft, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTaskDetails } from '../../../hooks/useTaskData';

const WorkerTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const { data: task, isLoading: loading, error } = useTaskDetails(id);
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmission = async (e) => {
    e.preventDefault();
    
    if (!submissionDetails.trim()) {
      toast.error('Please provide submission details');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: id,
          workerEmail: user.email,
          submissionDetails: submissionDetails.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Submission sent successfully!');
        setSubmissionDetails('');
        navigate('/dashboard/submissions');
      } else {
        toast.error(data.error || 'Failed to submit');
      }
         } catch (error) {
       console.error('Submission error:', error);
       toast.error('Error submitting task');
     } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error.message || 'Error fetching task details'}</p>
        <button
          onClick={() => navigate('/dashboard/tasks')}
          className="mt-2 text-blue-600 hover:text-blue-700 underline"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600">Task not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard/tasks')}
          className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <FiArrowLeft className="h-4 w-4 mr-1" />
          Back to Tasks
        </button>
      </div>

      {/* Task Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{task.title}</h1>
          <div className="flex items-center text-slate-600 mb-4">
            <FiUser className="h-4 w-4 mr-1" />
            <span>Posted by {task.buyerName}</span>
          </div>
        </div>

        {/* Task Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center text-slate-600 mb-2">
              <FiCalendar className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Completion Date</span>
            </div>
            <p className="text-slate-800 font-semibold">{formatDate(task.completionDate)}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center text-slate-600 mb-2">
              <FiDollarSign className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Payment</span>
            </div>
            <p className="text-green-600 font-semibold">{task.payableAmount} coins</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center text-slate-600 mb-2">
              <FiUsers className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Workers Needed</span>
            </div>
            <p className="text-slate-800 font-semibold">{task.requiredWorkers}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center text-slate-600 mb-2">
              <FiFileText className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Total Payment</span>
            </div>
            <p className="text-blue-600 font-semibold">{task.totalPayable} coins</p>
          </div>
        </div>

        {/* Task Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Task Description</h3>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700 leading-relaxed">{task.detail}</p>
          </div>
        </div>

        {/* Submission Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Submission Requirements</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-slate-700 leading-relaxed">{task.submissionInfo}</p>
          </div>
        </div>

        {/* Task Image */}
        {task.imageUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Task Image</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <img
                src={task.imageUrl}
                alt="Task"
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submission Form */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Submit Your Work</h2>
        
        <form onSubmit={handleSubmission} className="space-y-4">
          <div>
            <label htmlFor="submissionDetails" className="block text-sm font-medium text-slate-700 mb-2">
              Submission Details *
            </label>
            <textarea
              id="submissionDetails"
              value={submissionDetails}
              onChange={(e) => setSubmissionDetails(e.target.value)}
              placeholder="Describe your completed work, provide proof, links, or any relevant information..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
              disabled={submitting}
            />
            <p className="text-xs text-slate-500 mt-1">
              Please provide detailed information about your completed work
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium">You will earn:</span>
              <span className="ml-2 text-green-600 font-semibold">{task.payableAmount} coins</span>
            </div>
            
            <button
              type="submit"
              disabled={submitting || !submissionDetails.trim()}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="h-4 w-4 mr-2" />
                  Submit Work
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkerTaskDetails; 