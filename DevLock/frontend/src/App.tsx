import { useState } from "react";
import { LandingSplash } from "./components/LandingSplash";
import { Dashboard } from "./components/Dashboard";
import { motion, AnimatePresence } from "motion/react";

type View = "landing" | "dashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return (
          <LandingSplash
            onOpenDashboard={() => setCurrentView("dashboard")}
          />
        );
      case "dashboard":
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A]">
            <Dashboard />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EDEDED]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      {/* View Switcher for Demo */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-card px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-[#9CA3AF]">Navigation</span>
          <div className="flex gap-2">
            {(["landing", "dashboard"] as View[]).map((view) => (
              <motion.button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  currentView === view
                    ? "bg-gradient-to-r from-[#6C63FF] to-[#5CE1E6] text-white"
                    : "bg-white/5 text-[#9CA3AF] hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}