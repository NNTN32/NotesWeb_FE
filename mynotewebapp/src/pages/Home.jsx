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

const features = [
  {
    icon: <FaRegStickyNote className="text-4xl" />,
    title: "Smart Notes",
    description: "Create, organize and search notes easily. Support tagging, categorization and multi-device sync.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500"
  },
  {
    icon: <FaTasks className="text-4xl" />,
    title: "Todo Management",
    description: "Track daily tasks with priorities, deadlines and reminders. Increase your work productivity.",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-500"
  },
  {
    icon: <FaCalendarAlt className="text-4xl" />,
    title: "Smart Planning",
    description: "Create detailed plans for projects, personal goals and work with visual timeline.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500"
  },
  {
    icon: <FaRobot className="text-4xl" />,
    title: "AI Assistant",
    description: "Smart AI assistant helps optimize work, provide suggestions and automate repetitive tasks.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500"
  }
];

const aiInsights = [
  {
    type: "planning",
    title: "Smart Planning",
    description: "AI analyzes your habits and suggests planning strategies that fit your schedule perfectly",
    icon: <FaCalendarAlt className="text-3xl" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500"
  },
  {
    type: "todo",
    title: "Personalized Todo Lists",
    description: "Automatically prioritize tasks based on deadlines, importance and your work patterns",
    icon: <FaTasks className="text-3xl" />,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-500"
  },
  {
    type: "ai-assistant",
    title: "Personal AI Assistant",
    description: "Learns from your work style to provide suggestions for time optimization and productivity",
    icon: <FaRobot className="text-3xl" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500"
  }
];

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState({
    hero: false,
    features: false,
    aiInsights: false,
    demo: false
  });

  useEffect(() => {
    // Smooth entrance animations
    const timer1 = setTimeout(() => setAnimatedElements(prev => ({ ...prev, hero: true })), 100);
    const timer2 = setTimeout(() => setAnimatedElements(prev => ({ ...prev, features: true })), 300);
    const timer3 = setTimeout(() => setAnimatedElements(prev => ({ ...prev, aiInsights: true })), 500);
    const timer4 = setTimeout(() => setAnimatedElements(prev => ({ ...prev, demo: true })), 700);

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000); // Increased to 5 seconds for smoother transition

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(interval);
    };
  }, []);

  const handleGetStarted = () => {
    toast.success("Welcome to MyNoteWebApp! 🎉");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`transition-all duration-1000 ease-out ${animatedElements.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Manage Your Life
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
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
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out flex items-center gap-2"
                >
                  Get Started Now
                  <FaRocket className="group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                </button>
                <Link
                  to="/demo"
                  className="group bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 ease-out flex items-center gap-2"
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
          <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce">
          <div className="w-6 h-6 bg-purple-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse">
          <div className="w-3 h-3 bg-green-400 rounded-full opacity-60"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedElements.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover powerful tools that make your life easier and more efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group ${feature.bgColor} p-8 rounded-3xl transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02]`}
              >
                <div className={`${feature.iconColor} mb-6 transition-transform duration-500 ease-out group-hover:scale-105`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <Link
                    to={`/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 ease-out group-hover:gap-3"
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedElements.aiInsights ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Personalization
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how AI can help you plan smarter and manage tasks more efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] border border-gray-100`}
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
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 ease-out group-hover:gap-3"
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${animatedElements.demo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Try It Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No registration required, you can try the main features right now
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
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
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <span className="text-gray-700">Intuitive, easy-to-use interface</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <span className="text-gray-700">Multi-device sync</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <span className="text-gray-700">High data security</span>
                  </div>
                </div>
                <button className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-500 ease-out">
                  Try Now
                </button>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-1 transition-transform duration-700 ease-out hover:rotate-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are enjoying a better organized life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out flex items-center justify-center gap-2"
            >
              <FaHeart className="text-red-500" />
              Free Registration
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-500 ease-out flex items-center justify-center gap-2"
            >
              <FaDownload />
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <FaRegStickyNote className="text-2xl text-blue-400" />
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
