import { ArrowRight, Calendar, Check, Clock, Flame, Plus, Shield, TrendingUp, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = ({ onLogin }) => {
  const [count, setCount] = useState(0);
  const [activeHabits, setActiveHabits] = useState([false, false, false]);
  
  // Simulated Streak Counter Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev < 24 ? prev + 1 : 24));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Simulated User Interaction on the "Phone"
  useEffect(() => {
    const sequence = [
      setTimeout(() => setActiveHabits([true, false, false]), 1000),
      setTimeout(() => setActiveHabits([true, true, false]), 2200),
      setTimeout(() => setActiveHabits([true, true, true]), 3500),
      setTimeout(() => setActiveHabits([false, false, false]), 5500), // Reset
    ];
    return () => sequence.forEach(clearTimeout);
  }, [activeHabits[2]]); // Loop when the last one finishes

  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Left Content */}
      <div className="lg:w-1/2 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 mb-8 animate-float-delayed">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-sm font-medium text-slate-600">v2.0 is now live</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Build habits that <br/>
          <span className="text-linear">actually stick.</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
          The minimal, calm, and beautiful way to track your daily goals. 
          Focus on consistency, not perfection.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onLogin('signup')}
            className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              Start Building Today <ArrowRight size={18} />
            </span>
          </button>
          
     
        </div>

        <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
              </div>
            ))}
          </div>
          <p>Join 10,000+ habit builders</p>
        </div>
      </div>

      {/* Right Content - Animated Phone Interface */}
      <div className="lg:w-1/2 relative z-10 w-full flex justify-center perspective-1000">
        {/* Floating Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>

        {/* The Phone Container */}
        <div className="relative w-[340px] h-[680px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden animate-float">
          {/* Screen Content */}
          <div className="absolute inset-0 bg-slate-50 overflow-hidden flex flex-col">
            {/* App Header */}
            <div className="h-32 bg-linear-to-br from-indigo-500 to-purple-600 p-6 text-white rounded-b-[2.5rem] shadow-lg relative z-10">
              <div className="flex justify-between items-start pt-4">
                <div>
                  <div className="text-indigo-100 text-sm">Welcome back</div>
                  <div className="text-2xl font-bold">Alex</div>
                </div>
                <div className="flex flex-col items-center bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Flame size={20} className="text-orange-300 fill-orange-300 animate-pulse" />
                  <span className="text-xs font-bold mt-1">{count}</span>
                </div>
              </div>
            </div>

            {/* Habits List */}
            <div className="flex-1 p-6 space-y-4 overflow-hidden relative">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Today's Focus</div>
              
              {/* Habit Card 1 */}
              <div className={`p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all duration-500 ${activeHabits[0] ? 'bg-green-50/50 border-green-200' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeHabits[0] ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-slate-800 ${activeHabits[0] ? 'line-through text-slate-400' : ''}`}>Morning Run</h3>
                    <p className="text-xs text-slate-400">30 mins cardio</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${activeHabits[0] ? 'bg-green-500 border-green-500' : 'border-slate-200'}`}>
                  {activeHabits[0] && <Check size={16} className="text-white animate-check" />}
                </div>
              </div>

              {/* Habit Card 2 */}
              <div className={`p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all duration-500 ${activeHabits[1] ? 'bg-green-50/50 border-green-200' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeHabits[1] ? 'bg-green-100 text-green-600' : 'bg-cyan-100 text-cyan-600'}`}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-slate-800 ${activeHabits[1] ? 'line-through text-slate-400' : ''}`}>Read Book</h3>
                    <p className="text-xs text-slate-400">10 pages minimum</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${activeHabits[1] ? 'bg-green-500 border-green-500' : 'border-slate-200'}`}>
                   {activeHabits[1] && <Check size={16} className="text-white animate-check" />}
                </div>
              </div>

               {/* Habit Card 3 */}
               <div className={`p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all duration-500 ${activeHabits[2] ? 'bg-green-50/50 border-green-200' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeHabits[2] ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-slate-800 ${activeHabits[2] ? 'line-through text-slate-400' : ''}`}>Meditation</h3>
                    <p className="text-xs text-slate-400">15 mins calm</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${activeHabits[2] ? 'bg-green-500 border-green-500' : 'border-slate-200'}`}>
                   {activeHabits[2] && <Check size={16} className="text-white animate-check" />}
                </div>
              </div>

              {/* Success Confetti Logic inside Phone */}
              {activeHabits[2] && (
                <div className="absolute inset-0 pointer-events-none z-50">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="absolute w-2 h-2 rounded-sm" 
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10px`,
                            backgroundColor: ['#FCA5A5', '#86EFAC', '#93C5FD', '#FDBA74'][Math.floor(Math.random() * 4)],
                            animation: `confetti-fall ${1 + Math.random()}s linear forwards`
                          }} 
                     />
                   ))}
                </div>
              )}
            </div>
            
            {/* Bottom Nav */}
            <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-around px-6">
              <div className="text-indigo-500"><Calendar size={24} /></div>
              <div className="text-slate-300"><TrendingUp size={24} /></div>
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-900/30 -mt-8 border-4 border-slate-50"><Plus size={24} /></div>
              <div className="text-slate-300"><Clock size={24} /></div>
              <div className="text-slate-300"><User size={24} /></div>
            </div>
          </div>
        </div>

        {/* Floating 3D Elements around phone */}
        <div className="absolute top-32 -left-12 glass-panel p-4 rounded-2xl animate-float-delayed shadow-xl">
           <div className="flex items-center gap-3">
             <div className="bg-orange-100 p-2 rounded-lg text-orange-500">
               <Flame size={20} fill="currentColor" />
             </div>
             <div>
               <div className="text-xs text-slate-500 font-medium">Current Streak</div>
               <div className="text-lg font-bold text-slate-800">24 Days</div>
             </div>
           </div>
        </div>

        <div className="absolute bottom-40 -right-8 glass-panel p-4 rounded-2xl animate-float shadow-xl">
           <div className="flex items-center gap-3">
             <div className="bg-green-100 p-2 rounded-lg text-green-600">
               <Check size={20} />
             </div>
             <div>
               <div className="text-xs text-slate-500 font-medium">Daily Goal</div>
               <div className="text-lg font-bold text-slate-800">Completed!</div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;