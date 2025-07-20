import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiShield, 
  FiLock, 
  FiEye,
  FiDatabase,
  FiUsers,
  FiSettings,
  FiAlertCircle,
  FiMail
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Privacy = () => {
  useDocumentTitle('Privacy Policy');
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
        staggerChildren: 0.1
      }
    }
  };

  const privacyHighlights = [
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Data Protection",
      description: "Your personal information is encrypted and securely stored",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FiLock className="h-6 w-6" />,
      title: "Secure Transactions",
      description: "All payment information is processed through secure channels",
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: <FiEye className="h-6 w-6" />,
      title: "Transparency",
      description: "We're clear about what data we collect and how we use it",
      gradient: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50"
    }
  ];

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, complete your profile, post tasks, or contact us for support. This may include your name, email address, phone number, payment information, and profile picture."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect certain information about your use of our platform, including your IP address, browser type, device information, pages visited, time spent on pages, and other usage statistics."
        },
        {
          subtitle: "Task Information",
          text: "When you post or complete tasks, we collect information about the task details, submissions, ratings, and communications between users."
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Platform Operations",
          text: "We use your information to operate, maintain, and improve our platform, including processing transactions, facilitating task completion, and providing customer support."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send you important updates about your account, transactions, and changes to our terms or policies."
        },
        {
          subtitle: "Safety and Security",
          text: "We use your information to detect, prevent, and address fraud, abuse, security issues, and other harmful or illegal activity."
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      content: [
        {
          subtitle: "With Other Users",
          text: "Certain profile information may be visible to other users to facilitate task completion and build trust within our community."
        },
        {
          subtitle: "Service Providers",
          text: "We may share your information with trusted third-party service providers who help us operate our platform, such as payment processors and cloud storage providers."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information when required by law or to protect our rights, safety, and property, or that of our users."
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect your personal information during transmission and storage."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls to ensure that only authorized personnel can access your personal information."
        },
        {
          subtitle: "Regular Audits",
          text: "We regularly review and update our security practices to protect against unauthorized access, alteration, disclosure, or destruction of your information."
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Update",
          text: "You can access and update your personal information through your account settings at any time."
        },
        {
          subtitle: "Data Portability",
          text: "You have the right to request a copy of your personal information in a structured, machine-readable format."
        },
        {
          subtitle: "Account Deletion",
          text: "You can delete your account at any time. Upon deletion, we will remove your personal information, though some information may be retained for legal or business purposes."
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "We use cookies that are necessary for the operation of our platform, such as those that enable you to log in and access secure areas."
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand how users interact with our platform and improve our services."
        },
        {
          subtitle: "Your Cookie Choices",
          text: "You can control cookie settings through your browser, though disabling certain cookies may affect platform functionality."
        }
      ]
    }
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
                <FiShield className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Privacy Policy</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
              >
                Your Privacy <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Matters
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8"
              >
                We are committed to protecting your privacy and ensuring transparency about how we collect, 
                use, and protect your personal information on the Earnzy platform.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center space-x-4 text-sm text-slate-500"
              >
                <span>Last updated: January 2025</span>
                <span>•</span>
                <span>Effective: January 1, 2025</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Privacy Highlights */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {privacyHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className={`${highlight.bgColor} p-6 rounded-2xl border border-slate-200/50 hover:border-slate-300/50 transition-all duration-300 text-center`}>
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${highlight.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {highlight.icon}
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {highlight.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm">
                      {highlight.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-12"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  variants={fadeInUp}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-lg"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    {section.title}
                  </h2>
                  
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-l-4 border-blue-200 pl-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
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
                <FiMail className="h-12 w-12 mx-auto mb-6 text-blue-400" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Questions About Privacy?
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  If you have any questions about this Privacy Policy or how we handle your data, 
                  we're here to help.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiMail className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Contact Us
                  </Link>
                  <Link
                    to="/terms"
                    className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Terms of Service
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

export default Privacy; 