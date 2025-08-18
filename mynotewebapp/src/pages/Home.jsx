import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaRegStickyNote, 
  FaCheckCircle, 
  FaLightbulb, 
  FaRobot, 
  FaRocket, 
  FaShieldAlt,
  FaCalendarAlt,
  FaTasks,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaBell,
  FaHeart,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaDownload
} from "react-icons/fa";
import { toast } from 'react-toastify';
import { useInView } from '../utils/useInView';

const features = [
  {
    icon: <FaRegStickyNote className="text-4xl" />,
    title: "Smart Notes",
    description: "Create, organize and search notes easily. Support tagging, categorization and multi-device sync.",
    color: "from-terracotta to-brass",
    bgColor: "bg-sand",
    iconColor: "text-terracotta"
  },
  {
    icon: <FaTasks className="text-4xl" />,
    title: "Todo Management",
    description: "Track daily tasks with priorities, deadlines and reminders. Increase your work productivity.",
    color: "from-olive to-terracotta",
    bgColor: "bg-paper",
    iconColor: "text-olive"
  },
  {
    icon: <FaCalendarAlt className="text-4xl" />,
    title: "Smart Planning",
    description: "Create detailed plans for projects, personal goals and work with visual timeline.",
    color: "from-plum to-rose",
    bgColor: "bg-latte",
    iconColor: "text-plum"
  },
  {
    icon: <FaRobot className="text-4xl" />,
    title: "AI Assistant",
    description: "Smart AI assistant helps optimize work, provide suggestions and automate repetitive tasks.",
    color: "from-brass to-terracotta",
    bgColor: "bg-sand",
    iconColor: "text-brass"
  }
];

const aiInsights = [
  {
    type: "planning",
    title: "Smart Planning",
    description: "AI analyzes your habits and suggests planning strategies that fit your schedule perfectly",
    icon: <FaCalendarAlt className="text-3xl" />,
    color: "from-plum to-rose",
    bgColor: "bg-latte",
    iconColor: "text-plum"
  },
  {
    type: "todo",
    title: "Personalized Todo Lists",
    description: "Automatically prioritize tasks based on deadlines, importance and your work patterns",
    icon: <FaTasks className="text-3xl" />,
    color: "from-olive to-brass",
    bgColor: "bg-paper",
    iconColor: "text-olive"
  },
  {
    type: "ai-assistant",
    title: "Personal AI Assistant",
    description: "Learns from your work style to provide suggestions for time optimization and productivity",
    icon: <FaRobot className="text-3xl" />,
    color: "from-terracotta to-brass",
    bgColor: "bg-sand",
    iconColor: "text-terracotta"
  }
];

export default function Home() {
  const [animatedElements, setAnimatedElements] = useState({
    hero: false
  });

  const [featuresRef, featuresInView] = useInView({ threshold: 0.15, once: false });
  const [aiRef, aiInView] = useInView({ threshold: 0.15, once: false });
  const [demoRef, demoInView] = useInView({ threshold: 0.15, once: false });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, once: false });

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedElements(prev => ({ ...prev, hero: true })), 100);
    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const handleGetStarted = () => {
    toast.success("Welcome to MyNoteWebApp! 🎉");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-sand to-latte">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta/20 to-plum/20"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`transition-all duration-1000 ease-out ${animatedElements.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Manage Your Life
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-brass">
                  Intelligently
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                A note-taking, task management and planning app designed specifically for you. 
                Simple, effective and intelligent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-r from-terracotta to-brass text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out flex items-center gap-2"
                >
                  Get Started Now
                  <FaRocket className="group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                </button>
                <Link
                  to="/demo"
                  className="group bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-terracotta hover:shadow-xl transition-all duration-500 ease-out flex items-center gap-2"
                >
                  <FaPlay className="group-hover:scale-110 transition-transform duration-300 ease-out" />
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements Animation - Smoother */}
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-4 h-4 bg-terracotta/60 rounded-full"></div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce">
          <div className="w-6 h-6 bg-plum/60 rounded-full"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse">
          <div className="w-3 h-3 bg-olive/60 rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Key Features
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover powerful tools that make your life easier and more efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group ${feature.bgColor} p-8 rounded-3xl transition-all duration-700 ease-out hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`${feature.iconColor} mb-6 transition-transform duration-500 ease-out group-hover:scale-105`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <Link
                    to={`/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-2 text-terracotta hover:text-brass font-semibold transition-all duration-300 ease-out group-hover:gap-3"
                  >
                    Learn More
                    <FaArrowRight className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Personal Features Section */}
      <section ref={aiRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-paper to-sand">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${aiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Personalization
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover how AI can help you plan smarter and manage tasks more efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-3xl shadow-lg transition-all duration-700 ease-out hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] border border-gray-100 ${aiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className={`${insight.iconColor} mb-6 transition-transform duration-500 ease-out group-hover:scale-105`}>
                  {insight.icon}
                </div>
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${insight.color} text-white`}>
                    {insight.type === "planning" ? "Planning" : 
                     insight.type === "todo" ? "Todo List" : "AI Assistant"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{insight.title}</h3>
                <p className="text-gray-600 leading-relaxed">{insight.description}</p>
                <div className="mt-6">
                  <Link
                    to="/ai-features"
                    className="inline-flex items-center gap-2 text-terracotta hover:text-brass font-semibold transition-all duration-300 ease-out group-hover:gap-3"
                  >
                    Explore AI
                    <FaArrowRight className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section ref={demoRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${demoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Try It Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No registration required, you can try the main features right now
            </p>
          </div>

          <div className="bg-gradient-to-r from-paper to-sand rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Create Your First Note
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  Start with a simple note. You'll see the difference immediately!
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-olive text-xl" />
                    <span className="text-gray-700">Intuitive, easy-to-use interface</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-olive text-xl" />
                    <span className="text-gray-700">Multi-device sync</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-olive text-xl" />
                    <span className="text-gray-700">High data security</span>
                  </div>
                </div>
                <button className="mt-8 bg-gradient-to-r from-terracotta to-brass text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-500 ease-out">
                  Try Now
                </button>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-1 transition-transform duration-700 ease-out hover:rotate-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-rose rounded-full"></div>
                    <div className="w-3 h-3 bg-brass rounded-full"></div>
                    <div className="w-3 h-3 bg-olive rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-ink to-coffee">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-1000 ease-out ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            Ready to Start?
          </h2>
          <p className={`text-xl mb-8 opacity-90 transition-all duration-1000 ease-out ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '120ms' }}>
            Join thousands of users who are enjoying a better organized life
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 ease-out ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '200ms' }}>
            <Link
              to="/register"
              className="bg-white text-terracotta px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out flex items-center justify-center gap-2"
            >
              <FaHeart className="text-red-500" />
              Free Registration
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-terracotta transition-all duration-500 ease-out flex items-center justify-center gap-2"
            >
              <FaDownload />
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-ink text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <FaRegStickyNote className="text-2xl text-terracotta" />
            <span className="text-xl font-bold">MyNoteWebApp</span>
          </div>
          <p className="text-gray-400 mb-6">
            Simplify your life with modern technology
          </p>
          <div className="flex justify-center gap-6 text-gray-400">
            <Link to="/about" className="hover:text-white transition-colors duration-300">About Us</Link>
            <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-300">Terms</Link>
            <Link to="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
