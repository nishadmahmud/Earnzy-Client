import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { HiSparkles, HiRocketLaunch } from 'react-icons/hi2';
import { FiArrowRight, FiShield, FiCheckCircle, FiGlobe } from 'react-icons/fi';

const Hero = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 mb-6"
          >
            <HiSparkles className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Welcome to Earnzy</span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Earn Money Online with <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Microtasks
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Join thousands of workers worldwide who earn money by completing simple tasks. 
            Flexible, secure, and rewarding - start earning today!
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/register"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <HiRocketLaunch className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Get Started Free
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 font-semibold rounded-2xl border border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              Learn More
              <FiArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center space-x-8 text-sm text-slate-500"
          >
            <div className="flex items-center space-x-1">
              <FiShield className="h-4 w-4 text-green-500" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiCheckCircle className="h-4 w-4 text-blue-500" />
              <span>Instant Payments</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiGlobe className="h-4 w-4 text-purple-500" />
              <span>Global Access</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;