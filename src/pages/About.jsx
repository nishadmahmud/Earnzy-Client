import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiUsers, 
  FiTarget, 
  FiHeart, 
  FiTrendingUp,
  FiShield,
  FiZap,
  FiGlobe,
  FiAward
} from 'react-icons/fi';
import { HiSparkles, HiRocketLaunch } from 'react-icons/hi2';
import useDocumentTitle from '../hooks/useDocumentTitle';

const About = () => {
  useDocumentTitle('About Us');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const values = [
    {
      icon: <FiHeart className="h-6 w-6" />,
      title: "Empowerment",
      description: "We believe everyone deserves the opportunity to earn and grow, regardless of their background or location.",
      gradient: "from-red-500 to-pink-600",
      bgColor: "bg-red-50"
    },
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Trust & Security",
      description: "Your safety and security are our top priorities. We maintain the highest standards of data protection.",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: "Community",
      description: "We're building a global community where workers and businesses can thrive together.",
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: <FiZap className="h-6 w-6" />,
      title: "Innovation",
      description: "We continuously innovate to make earning money online simpler, faster, and more accessible.",
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Users", icon: <FiUsers className="h-5 w-5" /> },
    { number: "$2M+", label: "Total Paid Out", icon: <FiTrendingUp className="h-5 w-5" /> },
    { number: "100K+", label: "Tasks Completed", icon: <FiTarget className="h-5 w-5" /> },
    { number: "99.8%", label: "Satisfaction Rate", icon: <FiAward className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
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
                <span className="text-sm font-medium text-slate-700">About Earnzy</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
              >
                Empowering the Future of <br />
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Digital Work
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8"
              >
                Earnzy is more than just a microtask platform. We're building a global ecosystem where 
                anyone can earn money by completing simple tasks, while businesses get work done efficiently and affordably.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
                >
                  <HiRocketLaunch className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Join Our Community
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-white/60 backdrop-blur-sm text-slate-700 font-semibold rounded-2xl border border-white/50 hover:bg-white/80 transition-all duration-300"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1"
                >
                  <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/50 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div variants={fadeInUp}>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-6">
                    <FiTarget className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">Our Mission</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                    Democratizing <span className="text-emerald-600">Opportunities</span>
                  </h2>
                  
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    We believe that everyone, regardless of their location or background, should have access to 
                    earning opportunities. Our platform connects skilled individuals with businesses that need 
                    work done, creating a win-win ecosystem.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      </div>
                      <p className="text-slate-600">Make earning money online accessible to everyone</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      </div>
                      <p className="text-slate-600">Provide businesses with efficient, cost-effective solutions</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      </div>
                      <p className="text-slate-600">Foster a global community of digital workers</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="relative">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
                    <FiGlobe className="h-12 w-12 mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-4">Global Impact</h3>
                    <p className="text-emerald-100 leading-relaxed">
                      Since our launch, we've enabled thousands of people worldwide to earn supplemental 
                      income, while helping businesses scale their operations efficiently.
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-200 rounded-full opacity-20"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-6"
              >
                <FiHeart className="h-4 w-4 mr-2 text-violet-600" />
                <span className="text-sm font-medium text-slate-700">Our Values</span>
              </motion.div>
              
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                What We <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Stand For</span>
              </motion.h2>
              
              <motion.p variants={fadeInUp} className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Our core values guide everything we do, from product development to community building
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className={`${value.bgColor} p-8 rounded-3xl border border-slate-200/50 hover:border-slate-300/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50`}>
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${value.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors">
                      {value.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <HiSparkles className="h-12 w-12 mx-auto mb-6 text-blue-400" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Join Our Community?
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Whether you're looking to earn money or get work done, Earnzy is here to help you succeed.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <HiRocketLaunch className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Get Started Today
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 