import { ArrowRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function HowItWorks() {
  const steps = [
    { title: "Add Your Habit", desc: "Choose from our preset library or create your own custom habit to track.", icon: "🎯" },
    { title: "Set Reminders", desc: "Get gentle nudges at the right time so you never break the chain.", icon: "⏰" },
    { title: "Mark Complete", desc: "One tap to log your progress. Feel the dopamine hit of completion.", icon: "✅" },
    { title: "Review Analytics", desc: "See your consistency rate and longest streaks over time.", icon: "📊" },
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-slate-900">How it Works</h2>
        
        <div className="space-y-6">
          {steps.map((step, i) => (
             <RevealOnScroll key={i} delay={i * 100}>
               <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-8 rounded-3xl bg-white/40 border border-white/60 hover:bg-white/60 transition-colors">
                 <div className="text-5xl bg-white p-6 rounded-2xl shadow-sm">{step.icon}</div>
                 <div className="flex-1 text-center md:text-left">
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Step {i + 1}: {step.title}</h3>
                   <p className="text-slate-600 text-lg">{step.desc}</p>
                 </div>
                 <div className="hidden md:block text-slate-200">
                   <ArrowRight size={40} className="transform rotate-90 md:rotate-0" />
                 </div>
               </div>
             </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
