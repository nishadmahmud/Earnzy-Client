import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiFileText, 
  FiUsers, 
  FiDollarSign,
  FiShield,
  FiAlertTriangle,
  FiBookOpen,
  FiMail
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Terms = () => {
  useDocumentTitle('Terms of Service');
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

  const termsHighlights = [
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: "User Responsibilities",
      description: "Guidelines for proper platform usage and behavior",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FiDollarSign className="h-6 w-6" />,
      title: "Payment Terms",
      description: "Clear policies on payments, fees, and refunds",
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Platform Rules",
      description: "Terms governing task posting and completion",
      gradient: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50"
    }
  ];

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing and using the Earnzy platform, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service constitute a legally binding agreement between you and Earnzy."
        },
        {
          subtitle: "Changes to Terms",
          text: "We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of the platform after any changes indicates your acceptance of the new terms."
        },
        {
          subtitle: "Eligibility",
          text: "You must be at least 18 years old to use our platform. By using Earnzy, you represent and warrant that you have the legal capacity to enter into this agreement."
        }
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts and Registration",
      content: [
        {
          subtitle: "Account Creation",
          text: "To use certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process."
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use."
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason we deem appropriate."
        }
      ]
    },
    {
      id: "platform-usage",
      title: "Platform Usage and Conduct",
      content: [
        {
          subtitle: "Acceptable Use",
          text: "You agree to use the platform only for lawful purposes and in accordance with these Terms. You may not use the platform in any way that could damage, disable, or impair the service."
        },
        {
          subtitle: "Prohibited Activities",
          text: "You may not engage in fraudulent activities, post inappropriate content, harass other users, attempt to manipulate the platform, or violate any applicable laws or regulations."
        },
        {
          subtitle: "Content Standards",
          text: "All content you post must be accurate, respectful, and appropriate. We reserve the right to remove any content that violates our community standards."
        }
      ]
    },
    {
      id: "tasks-payments",
      title: "Tasks and Payments",
      content: [
        {
          subtitle: "Task Posting",
          text: "Buyers can post tasks by purchasing coins and providing clear, detailed instructions. All tasks must comply with our content policies and applicable laws."
        },
        {
          subtitle: "Task Completion",
          text: "Workers must complete tasks according to the provided instructions and submit work within the specified timeframe. Quality standards must be met for payment approval."
        },
        {
          subtitle: "Payment Processing",
          text: "Payments are processed through our secure system. Buyers pay upfront with coins, and workers receive payment upon task approval. We may charge processing fees as disclosed."
        },
        {
          subtitle: "Disputes",
          text: "In case of disputes between buyers and workers, we provide a resolution process. Our decision in dispute matters is final and binding."
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content: [
        {
          subtitle: "Platform Content",
          text: "The Earnzy platform, including its design, features, and functionality, is owned by us and protected by copyright, trademark, and other intellectual property laws."
        },
        {
          subtitle: "User Content",
          text: "You retain ownership of content you create, but by posting on our platform, you grant us a license to use, display, and distribute your content as necessary for platform operations."
        },
        {
          subtitle: "Respect for IP Rights",
          text: "You must respect the intellectual property rights of others. Do not post or submit content that infringes on copyrights, trademarks, or other proprietary rights."
        }
      ]
    },
    {
      id: "liability-disclaimers",
      title: "Liability and Disclaimers",
      content: [
        {
          subtitle: "Platform Availability",
          text: "We strive to maintain platform availability but cannot guarantee uninterrupted service. We are not liable for any downtime or technical issues that may occur."
        },
        {
          subtitle: "User Interactions",
          text: "We are not responsible for the actions or conduct of users on our platform. Users interact at their own risk, and we disclaim liability for any disputes or issues between users."
        },
        {
          subtitle: "Limitation of Liability",
          text: "Our liability is limited to the maximum extent permitted by law. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform."
        }
      ]
    },
    {
      id: "termination",
      title: "Termination and Suspension",
      content: [
        {
          subtitle: "Termination Rights",
          text: "Either party may terminate this agreement at any time. You may delete your account, and we may suspend or terminate your access for violations of these terms."
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, your right to access and use the platform ceases immediately. Certain provisions of these terms will survive termination, including payment obligations and intellectual property rights."
        },
        {
          subtitle: "Data Retention",
          text: "After account termination, we may retain certain information as required by law or for legitimate business purposes, in accordance with our Privacy Policy."
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
                <FiFileText className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Terms of Service</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
              >
                Terms of <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Service
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8"
              >
                These terms govern your use of the Earnzy platform. Please read them carefully 
                to understand your rights and responsibilities as a user of our service.
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

        {/* Terms Highlights */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {termsHighlights.map((highlight, index) => (
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

        {/* Terms Content */}
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

        {/* Important Notice */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-8"
            >
              <div className="flex items-start space-x-4">
                <FiAlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">
                    Important Legal Notice
                  </h3>
                  <p className="text-amber-700 leading-relaxed">
                    These Terms of Service constitute a binding legal agreement. If you do not agree 
                    to these terms, you may not use the Earnzy platform. For questions about these 
                    terms, please contact our legal team through our support channels.
                  </p>
                </div>
              </div>
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
                <FiBookOpen className="h-12 w-12 mx-auto mb-6 text-blue-400" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Questions About These Terms?
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service or need clarification 
                  on any provisions, our team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiMail className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Contact Legal Team
                  </Link>
                  <Link
                    to="/privacy"
                    className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Privacy Policy
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

export default Terms; 