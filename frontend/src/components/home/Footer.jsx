import { Check } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="bg-slate-900 p-1.5 rounded text-white">
          <Check size={16} strokeWidth={3} />
        </div>
        <span className="font-bold text-slate-900">Habitmantra</span>
      </div>
      <div className="text-slate-500 text-sm">
        © 2025 HabitMantra Inc. All rights reserved.
      </div>
      <div className="flex gap-6 text-slate-400">
        <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Email</a>
      </div>
    </div>
  </footer>
);

export default Footer;