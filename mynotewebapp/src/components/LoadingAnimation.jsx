import { useState, useEffect } from 'react';
import { FaPencilAlt, FaRegStickyNote, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

export default function LoadingAnimation({ onLoadingComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase(1); // Show icons
    }, 300);

    const timer2 = setTimeout(() => {
      setAnimationPhase(2); // Start writing effect
    }, 1200);

    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-ink via-coffee to-terracotta flex items-center justify-center z-50">
      {/* Main Content */}
      <div className="text-center">
        {/* App Icons - Appear with bounce */}
        <div className={`mb-8 transition-all duration-800 ease-out ${
          animationPhase >= 1 
            ? 'opacity-100 transform scale-100' 
            : 'opacity-0 transform scale-50'
        }`}>
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 animate-bounce">
              <FaRegStickyNote className="text-4xl text-white" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 animate-bounce" style={{animationDelay: '0.1s'}}>
              <FaCheckCircle className="text-4xl text-white" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 animate-bounce" style={{animationDelay: '0.2s'}}>
              <FaCalendarAlt className="text-4xl text-white" />
            </div>
          </div>
        </div>

        {/* App Title */}
        <div className={`mb-6 transition-all duration-800 ease-out delay-200 ${
          animationPhase >= 1 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}>
          <h1 className="text-5xl font-bold text-white mb-3">My Note Web App</h1>
          <p className="text-xl text-white/80">Ghi chú • Todo • Kế hoạch</p>
        </div>

        {/* Pencil Writing Effect */}
        <div className={`flex items-center justify-center space-x-3 mb-8 transition-all duration-800 ease-out delay-400 ${
          animationPhase >= 2 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}>
          <FaPencilAlt className="text-3xl text-brass animate-write" />
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-2 h-2 bg-brass rounded-full transition-all duration-300 ${
                animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`} style={{
                transitionDelay: `${i * 200}ms`
              }}></div>
            ))}
          </div>
        </div>

        {/* Loading Bar */}
        <div className={`w-96 h-3 bg-white/20 rounded-full overflow-hidden transition-all duration-800 ease-out delay-600 ${
          animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="h-full bg-brass rounded-full transition-all duration-1500 ease-out" style={{
            width: animationPhase >= 2 ? '100%' : '0%'
          }}></div>
        </div>

        {/* Status Text */}
        <div className={`mt-6 transition-all duration-500 ease-out delay-800 ${
          animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-white/70 text-lg">
            {animationPhase === 0 && "Khởi tạo..."}
            {animationPhase === 1 && "Sẵn sàng..."}
            {animationPhase === 2 && "Hoàn thành!"}
          </p>
        </div>
      </div>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-brass/30 rounded-full animate-pulse ${
              animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
