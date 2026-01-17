import RevealOnScroll from "./RevealOnScroll";
import { 
  Check, 
  Flame, 
  Calendar, 
  Clock, 
  Plus, 
  TrendingUp, 
  Shield, 
  Zap, 
  X, 
  ArrowRight,
  Mail,
  Lock,
  User,
  PartyPopper
} from 'lucide-react';

export default function Journey() {
  const items = [
    { title: "Create Habits", desc: "Set clear, actionable goals in seconds." },
    { title: "Track Progress", desc: "Tick off tasks with satisfying motion." },
    { title: "Build Streaks", desc: "Watch your streak flame grow daily." },
    { title: "Visual Insights", desc: "Beautiful charts to visualize growth." },
  ];

  return (
     <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Your Journey to <span className="text-gradient">Better Habits</span></h2>
        <p className="text-lg text-slate-600">A simple flow designed to keep you motivated every single day.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "Create Habits", icon: Plus, color: "blue", desc: "Set clear, actionable goals in seconds." },
          { title: "Track Progress", icon: Check, color: "green", desc: "Tick off tasks with satisfying micro-interactions." },
          { title: "Build Streaks", icon: Flame, color: "orange", desc: "Watch your streak flame grow brighter daily." },
          { title: "Visual Insights", icon: TrendingUp, color: "purple", desc: "Beautiful charts to visualize your growth." }
        ].map((item, index) => (
          <RevealOnScroll key={index} delay={index * 150}>
            <div className="glass-card p-8 rounded-3xl h-full hover:-translate-y-2 transition-transform duration-300">
              <div className={`w-14 h-14 rounded-2xl bg-${item.color}-100 flex items-center justify-center text-${item.color}-500 mb-6`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
