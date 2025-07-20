import React from 'react';
import { Link } from 'react-router';
import { FiGithub, FiLinkedin, FiGlobe, FiHeart } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/nishadmahmud',
      icon: <FiGithub className="h-4 w-4" />,
      color: 'hover:text-slate-800 hover:bg-slate-100',
      bgColor: 'bg-slate-50'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nishadmahmud/',
      icon: <FiLinkedin className="h-4 w-4" />,
      color: 'hover:text-blue-600 hover:bg-blue-100',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Website',
      href: 'https://nishad-mahmud.me',
      icon: <FiGlobe className="h-4 w-4" />,
      color: 'hover:text-emerald-600 hover:bg-emerald-100',
      bgColor: 'bg-emerald-50'
    }
  ];

  const quickLinks = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    // { name: 'Help Center', path: '/help' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Footer Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand Section */}
              <div className="flex flex-col items-center md:items-start space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-xl font-bold text-slate-800 tracking-tight">
                    Earnzy
                  </span>
                </motion.div>

                <div className="text-center md:text-left">
                  <p className="text-slate-600 font-medium text-sm mb-1">
                    Empowering Microtasks, Empowering You
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    The premier platform connecting skilled workers with businesses worldwide.
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-emerald-50 border border-emerald-200/50 px-2 py-1 rounded-full">
                    <HiSparkles className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">50K+ Users</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-blue-50 border border-blue-200/50 px-2 py-1 rounded-full">
                    <FiHeart className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-medium text-blue-700">99% Satisfaction</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-base font-bold text-slate-800 mb-3">Quick Links</h3>
                <div className="grid grid-cols-1 gap-1 w-full">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="group flex items-center px-3 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 text-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Connect Section */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-base font-bold text-slate-800 mb-3">Connect With Developer</h3>
                
                <div className="grid grid-cols-1 gap-2 w-full mb-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      className={`group flex items-center space-x-2 p-2 ${social.bgColor} border border-slate-200/50 rounded-lg ${social.color} transition-all duration-300 shadow-sm hover:shadow-md`}
                    >
                      <div className="flex-shrink-0">
                        {social.icon}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-700 group-hover:text-current">
                          {social.name}
                        </span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-6 pt-4 border-t border-slate-200/50">
                {/* Copyright */}
                <div className="flex justify-center items-center space-x-2 text-slate-500">
                  <span className="text-xs">
                    © {currentYear} Earnzy. All rights reserved.
                  </span>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;