import { Check } from "lucide-react";

export default function Nav({ onLogin }) {
  return (
    <nav className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-white/50">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 rounded-lg text-white">
          <img src="/logo.svg" className="w-8 h-8" alt="" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">HabitMantra</span>
      </div>
      

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onLogin('login')}
          className="hidden md:block font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Sign in
        </button>
        <button 
          onClick={() => onLogin('signup')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          Get Started
        </button>
      </div>
    </div>
  </nav>
  );
}
