import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "../components/home/Nav";
import Hero from "../components/home/Hero";
import Journey from "../components/home/Journey";
import HowItWorks from "../components/home/HowItWorks";
import Login from "../components/home/Login";
import Footer from "../components/home/Footer";
import { useNavigate } from "react-router-dom";
const styleTag = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  @keyframes float-delayed {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  @keyframes pulse-glow {
    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
  }
  @keyframes check-bounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes confetti-fall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; animation-delay: 1s; }
  .animate-pulse-glow { animation: pulse-glow 2s infinite; }
  .animate-check { animation: check-bounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  }

  .text-gradient {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Custom Scroll Reveal Class */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
  }
  .reveal.active {
    opacity: 1;
    transform: translateY(0);
  }
`;
export default function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
  if (localStorage.getItem("token")) {
    navigate("/dashboard", { replace: true });
  }
}, []);
  return (
    <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <style>{styleTag}</style>
      <Nav onLogin={() => setOpen(true)} />

      <Hero onLogin={() => setOpen(true)} />
      <Journey />
      <HowItWorks />

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl lg:p-6 lg:m-10 m-2 relative lg:w-[100vh] w-full lg:h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute lg:top-8 lg:right-8 top-1 right-1 text-gray-500 bg-red-300  rounded p-2 cursor-pointer hover:bg-red-400"
              >
                ✕
              </button>

              <Login />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}


