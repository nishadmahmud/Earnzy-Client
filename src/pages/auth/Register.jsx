import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../../auth/AuthProvider';

const roles = [
  { value: '', label: 'Select role' },
  { value: 'worker', label: 'Worker' },
  { value: 'buyer', label: 'Buyer' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: 'Weak', color: 'text-red-500' };
  if (score === 3) return { label: 'Medium', color: 'text-yellow-500' };
  if (score >= 4) return { label: 'Strong', color: 'text-green-600' };
  return { label: '', color: '' };
}

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    profilePic: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!emailRegex.test(form.email)) newErrors.email = 'Enter a valid email address.';
    if (form.profilePic && !/^https?:\/\/.+\..+/.test(form.profilePic)) newErrors.profilePic = 'Enter a valid URL.';
    if (!strongPassword.test(form.password)) newErrors.password = 'Password must be at least 8 characters and include a number.';
    if (!form.role) newErrors.role = 'Please select a role.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
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
        setForm(f => ({ ...f, profilePic: data.imageUrl }));
        setSuccess('Profile image uploaded successfully!');
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
    setForm(f => ({ ...f, profilePic: '' }));
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      await createUser(form.email, form.password);
      await updateUserProfile(form.name, form.profilePic);
      // Save user to MongoDB
      await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          profilePic: form.profilePic,
          role: form.role,
        }),
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);
  const emailValid = form.email.length === 0 ? null : emailRegex.test(form.email);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 font-sans pt-12">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Create your Earnzy account</h2>
        
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="text-green-600 text-sm">{success}</div>
          </div>
        )}
        
        <form className="space-y-3" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50 ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
            />
            {form.email && !emailValid && (
              <div className="mt-1 text-xs text-red-500">
                Invalid email
              </div>
            )}
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture <span className="text-slate-400">(optional)</span></label>
            <div className="space-y-3">
              {/* URL Input */}
              <input
                type="url"
                id="profilePic"
                name="profilePic"
                value={form.profilePic}
                onChange={handleChange}
                className={`w-full px-4 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50 ${errors.profilePic ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="Paste image URL or upload from device"
              />
              
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-3">
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="profile-image-upload"
                    disabled={imageUploading}
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Image
                  </label>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-20 h-20 object-cover rounded-full border-2 border-slate-200 mx-auto"
                      />
                      {!imageUploading && (
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Upload Progress Overlay */}
                      {imageUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                          <div className="text-white text-center">
                            <svg className="animate-spin h-4 w-4 mx-auto" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Display uploaded image from URL */}
              {form.profilePic && !imagePreview && (
                <div className="text-center">
                  <img
                    src={form.profilePic}
                    alt="Profile"
                    className="w-20 h-20 object-cover rounded-full border-2 border-slate-200 mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, profilePic: '' }))}
                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              )}
              
              {errors.profilePic && <p className="text-xs text-red-500 mt-1">{errors.profilePic}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50 pr-10 ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-blue-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {form.password && (
              <div className={`mt-1 text-xs ${passwordStrength.color}`}>
                Password strength: {passwordStrength.label}
              </div>
            )}
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            <p className="text-xs text-slate-500 mt-1">Password must be at least 8 characters and include a number.</p>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className={`w-full px-4 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50 ${errors.role ? 'border-red-400' : 'border-slate-200'}`}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value} disabled={role.value === ''}>{role.label}</option>
              ))}
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2 disabled:opacity-60"
            disabled={loading || imageUploading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-slate-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;