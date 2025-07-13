import React from 'react';
import { Link } from 'react-router';

const Login = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sign in to Earnzy</h2>
                <form className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-slate-50"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-sm text-slate-600">Don&apos;t have an account? </span>
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;