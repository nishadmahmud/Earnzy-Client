import React, { useState } from 'react';
import { Link } from 'react-router';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const roles = [
  { value: '', label: 'Select role' },
  { value: 'worker', label: 'Worker' },
  { value: 'buyer', label: 'Buyer' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // TODO: Handle registration logic
      alert('Registration successful!');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 font-sans pt-12">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Create your Earnzy account</h2>
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
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="profilePic" className="block text-sm font-medium text-slate-700 mb-1">Profile Picture URL <span className="text-slate-400">(optional)</span></label>
            <input
              type="url"
              id="profilePic"
              name="profilePic"
              value={form.profilePic}
              onChange={handleChange}
              className={`w-full px-4 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50 ${errors.profilePic ? 'border-red-400' : 'border-slate-200'}`}
            />
            {errors.profilePic && <p className="text-xs text-red-500 mt-1">{errors.profilePic}</p>}
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
            className="w-full py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
          >
            Register
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