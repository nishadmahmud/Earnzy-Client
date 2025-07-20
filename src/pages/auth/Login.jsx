import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../../auth/AuthProvider';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Login = () => {
    useDocumentTitle('Login');
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn(formData.email, formData.password);
            // Save user to MongoDB (only if new)
            const user = result.user;
            await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    profilePic: user.photoURL || '',
                    role: 'worker',
                }),
            });
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Google sign-in logic
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await googleSignIn();
            // Save user to MongoDB (only if new)
            const user = result.user;
            await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    profilePic: user.photoURL,
                    role: 'worker',
                }),
            });
            navigate('/');
        } catch (error) {
            console.error('Google sign-in error:', error);
            setError('Google sign-in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 font-sans pt-12">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Sign in to Earnzy</h2>
                {error && <div className="mb-3 text-red-600 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                            className="w-full px-4 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50 pr-10"
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
                        <div className="text-right mt-1">
                            <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</Link>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                {/* Separator */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="mx-3 text-slate-400 text-sm">or</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>
                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-4 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 font-medium shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <FcGoogle className="h-5 w-5" />
                    {loading ? 'Signing In...' : 'Sign in with Google'}
                </button>
                <div className="mt-4 text-center">
                    <span className="text-sm text-slate-600">Don&apos;t have an account? </span>
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;