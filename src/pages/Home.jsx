import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { useTopWorkers } from '../hooks/useHomeData';
import { FiArrowRight, FiStar, FiUsers, FiTrendingUp, FiShield, FiZap, FiAward, FiDollarSign, FiClock, FiCheckCircle, FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router';
import { AuthContext } from '../auth/AuthProvider';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { data: topWorkers = [], isLoading: workersLoading, error: workersError } = useTopWorkers();
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Debug logging
  console.log('Top workers data:', topWorkers);
  console.log('Workers loading:', workersLoading);
  console.log('Workers error:', workersError);

  // Dynamic navigation based on authentication status
  const getNavigationPath = () => {
    return user ? '/dashboard' : '/register';
  };

  const getCtaText = (originalText) => {
    if (!user) return originalText;
    return originalText.replace('Start Earning', 'Go to Dashboard').replace('Get Started', 'Go to Dashboard').replace('Join Now', 'Go to Dashboard');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  const goToSlide = (index) => {
    const swiperInstance = document.querySelector('.hero-swiper')?.swiper;
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  // Hero slides data
  const heroSlides = [
    {
      title: "Earn Money Online",
      subtitle: "Complete Simple Tasks & Get Paid",
      description: "Join thousands of workers earning money by completing micro-tasks. Start earning today!",
      bgImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&h=1080&fit=crop&crop=center",
      ctaText: "Start Earning Now"
    },
    {
      title: "Post Your Tasks",
      subtitle: "Get Work Done Quickly",
      description: "Need something done? Post your task and get it completed by skilled workers worldwide.",
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center",
      ctaText: "Post a Task"
    },
    {
      title: "Trusted Platform",
      subtitle: "Secure & Reliable",
      description: "Join our trusted community of buyers and workers. Safe payments and quality work guaranteed.",
      bgImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop&crop=center",
      ctaText: "Join Now"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Worker",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face",
      quote: "Earnzy has transformed my life! I've earned over $2000 in just 3 months by completing simple tasks.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "As a buyer, I love how quickly I can get tasks completed. The quality of work is consistently excellent.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Student",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "Perfect for students! I earn extra money between classes by doing quick tasks. Highly recommend!",
      rating: 5
    },
    {
      name: "Alex Rodriguez",
      role: "Marketing Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "The platform is incredibly user-friendly. I've completed hundreds of tasks and always get paid on time.",
      rating: 5
    }
  ];

  // Features data
  const features = [
    {
      icon: <FiShield className="h-8 w-8" />,
      title: "Secure Payments",
      description: "All payments are secured and processed safely through our trusted payment system."
    },
    {
      icon: <FiZap className="h-8 w-8" />,
      title: "Quick Tasks",
      description: "Complete simple tasks in minutes and start earning money immediately."
    },
    {
      icon: <FiUsers className="h-8 w-8" />,
      title: "Global Community",
      description: "Join thousands of workers and buyers from around the world."
    },
    {
      icon: <FiTrendingUp className="h-8 w-8" />,
      title: "Growing Platform",
      description: "Be part of our rapidly growing platform with new opportunities daily."
    }
  ];

  // Stats data
  const stats = [
    { number: "50K+", label: "Active Users", icon: <FiUsers className="h-6 w-6" /> },
    { number: "$2M+", label: "Total Earned", icon: <FiDollarSign className="h-6 w-6" /> },
    { number: "100K+", label: "Tasks Completed", icon: <FiCheckCircle className="h-6 w-6" /> },
    { number: "99%", label: "Success Rate", icon: <FiAward className="h-6 w-6" /> }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How do I start earning money on Earnzy?",
      answer: "Simply register as a worker, browse available tasks, complete them according to the instructions, and submit your work for approval. Once approved, you'll earn coins that can be withdrawn as real money."
    },
    {
      question: "What types of tasks are available?",
      answer: "Tasks vary widely and include social media engagement, data entry, content creation, surveys, app testing, and many other micro-tasks. Most tasks can be completed in minutes."
    },
    {
      question: "How do I get paid?",
      answer: "You earn coins for completed tasks. 20 coins = $1 USD. You can withdraw your earnings once you reach the minimum of 200 coins ($10) through various payment methods including PayPal, bank transfer, or mobile money."
    },
    {
      question: "Is Earnzy free to use?",
      answer: "Yes! Registration and browsing tasks is completely free for workers. Buyers pay only for the coins they purchase to fund their tasks."
    },
    {
      question: "How long does it take to get paid?",
      answer: "Once your task submission is approved by the buyer, coins are added to your account immediately. Withdrawal requests are typically processed within 24-48 hours."
    },
    {
      question: "What if a buyer rejects my work?",
      answer: "If your work is rejected, you won't receive payment for that task. However, you can contact support if you believe the rejection was unfair. We review all disputes carefully."
    },
    {
      question: "Can I post my own tasks?",
      answer: "Yes! You can register as a buyer, purchase coins, and post tasks for workers to complete. This is perfect for getting help with various projects or business needs."
    },
    {
      question: "Is there a limit to how much I can earn?",
      answer: "No, there's no earning limit! The more tasks you complete successfully, the more you can earn. Many active workers earn hundreds of dollars per month."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative h-screen overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          onSlideChange={handleSlideChange}
          className="h-full hero-swiper"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div 
                className="h-full flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="container mx-auto px-4 text-center text-white relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-4 font-semibold drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto drop-shadow-md">
                      {slide.description}
                    </p>
                    <Link
                      to={getNavigationPath()}
                      className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {getCtaText(slide.ctaText)}
                      <FiArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Pill-shaped Pagination */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-10 h-2 rounded-full transition-all duration-300 hover:bg-white/60 ${
                currentSlide === index 
                  ? 'bg-white/90 scale-110' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose Earnzy?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the benefits of joining our platform and start your journey to financial freedom
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Best Workers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Top Performers
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our highest-earning workers who have achieved success on our platform
            </motion.p>
          </motion.div>

          {workersLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : workersError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading top workers</p>
              <p className="text-gray-500">{workersError.message}</p>
            </div>
          ) : topWorkers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No workers found yet</p>
              <p className="text-gray-500">Workers will appear here once they start earning coins</p>
            </div>
          ) : (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {topWorkers.map((worker, index) => (
                <motion.div
                  key={worker._id}
                  variants={scaleIn}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      {worker.photoURL || worker.profilePic ? (
                        <img
                          src={worker.photoURL || worker.profilePic}
                          alt={worker.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {worker.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        #{index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{worker.name}</h3>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <FiDollarSign className="h-5 w-5" />
                      <span className="text-2xl font-bold">{worker.coins}</span>
                      <span className="text-sm">coins</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
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
                variants={scaleIn}
                className="text-center text-white"
              >
                <div className="text-blue-200 mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              What Our Users Say
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who have found success on our platform
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 4000 }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="pb-12"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just three simple steps
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your free account and choose your role as a worker or buyer",
                icon: <FiUsers className="h-8 w-8" />
              },
              {
                step: "2",
                title: "Start Working",
                description: "Browse available tasks or post your own tasks for others to complete",
                icon: <FiZap className="h-8 w-8" />
              },
              {
                step: "3",
                title: "Get Paid",
                description: "Complete tasks and receive payments directly to your account",
                icon: <FiDollarSign className="h-8 w-8" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center relative"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {item.icon}
                </div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about how Earnzy works
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="mb-4"
              >
                <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <FiHelpCircle className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-semibold text-gray-800">{faq.question}</span>
                    </div>
                    <FiChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <FiHelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                Can't find the answer you're looking for? Our support team is here to help!
              </p>
              <Link
                to={getNavigationPath()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {user ? 'Contact Support' : 'Get Started Now'}
                <FiArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-white"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Earning?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of successful workers and buyers on our platform today
            </motion.p>
            <motion.div variants={fadeInUp} className="space-x-4">
              <Link
                to={getNavigationPath()}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {getCtaText("Get Started Now")}
                <FiArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;