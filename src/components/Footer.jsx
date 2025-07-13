import React from 'react';
import { Link } from 'react-router';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-100 py-8 px-2 mt-12">
      <div className="w-[90%] mx-auto rounded-2xl shadow-lg bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200">
        {/* Brand and tagline */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Earnzy</span>
          </div>
          <span className="text-slate-500 text-sm">Empowering Microtasks, Empowering You</span>
        </div>
        {/* Quick Links */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-base font-medium">
          <Link to="/about" className="text-slate-700 hover:text-blue-600 transition-colors">About</Link>
          <Link to="/contact" className="text-slate-700 hover:text-blue-600 transition-colors">Contact</Link>
          <Link to="/privacy" className="text-slate-700 hover:text-blue-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-slate-700 hover:text-blue-600 transition-colors">Terms</Link>
        </div>
        {/* Social Icons */}
        <div className="flex items-center gap-4 text-xl mt-4 md:mt-0">
          <a href="https://github.com/nishadmahmud/Earnzy-Client" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors" aria-label="GitHub"><FiGithub /></a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors" aria-label="Twitter"><FiTwitter /></a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors" aria-label="LinkedIn"><FiLinkedin /></a>
        </div>
      </div>
      {/* Copyright Section */}
      <div className="w-[90%] mx-auto text-center text-slate-500 text-sm mt-4">
        &copy; {new Date().getFullYear()} Earnzy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;