import { motion, AnimatePresence } from "motion/react";
import { User, ArrowRight, Sparkles, Clock, Eye } from "lucide-react";
import { Button } from "./Button";
import { NebulaBackground } from "./NebulaBackground";
import { AnimatedToggle } from "./AnimatedToggle";
import { useState } from "react";
import incognitoIcon from "../assets/1917b702add36eae98c8a6d78ef5c9a3c688af75.png";

const onboardingSteps = [
  {
    icon: User,
    title: "Create Disposable Identities",
    description: "Generate temporary email aliases instantly to protect your real identity online.",
  },
  {
    icon: Clock,
    title: "Set Expiry Times",
    description: "Control how long each alias remains active - from 1 hour to forever.",
  },
  {
    icon: Eye,
    title: "Monitor Activity",
    description: "Track all incoming messages and activity for each alias in real-time.",
  },
];

interface LandingSplashProps {
  onOpenDashboard: () => void;
}

export function LandingSplash({ onOpenDashboard }: LandingSplashProps) {
  const [showContent, setShowContent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#0D0D0D] flex items-center justify-center">
      <NebulaBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-16 text-center">
        <AnimatePresence mode="wait">
          {!showContent ? (
            /* Toggle Animation */
            <motion.div
              key="toggle"
              className="flex flex-col items-center justify-center min-h-[60vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.9 }}
            >
              <AnimatedToggle onComplete={() => setShowContent(true)} />

              {/* Skip Animation Button */}
              <motion.button
                onClick={() => setShowContent(true)}
                className="mt-12 text-xs text-[#9CA3AF] hover:text-[#5CE1E6] transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
              >
                Skip Animation →
              </motion.button>
            </motion.div>
          ) : (
            /* Main Content */
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 0.78, 0.43, 1] }}
            >
              {/* Logo/Spy Agent Icon */}
              <motion.div
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5CE1E6] flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  boxShadow: [
                    "0 0 40px rgba(108, 99, 255, 0.4)",
                    "0 0 80px rgba(92, 225, 230, 0.6)",
                    "0 0 40px rgba(108, 99, 255, 0.4)",
                  ],
                }}
                transition={{
                  scale: { duration: 0.6, ease: [0.23, 0.78, 0.43, 1] },
                  rotate: { duration: 0.6, ease: [0.23, 0.78, 0.43, 1] },
                  boxShadow: { duration: 4, repeat: Infinity, delay: 0.6 },
                }}
              >
                <img src={incognitoIcon} alt="Incognito Icon" className="w-12 h-12 brightness-0 invert" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                className="text-5xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="text-gradient">MaskMe</span>
              </motion.h1>

              <motion.h2
                className="text-3xl mb-6 text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Privacy-Preserving Disposable Identity System
              </motion.h2>

              {/* Tagline */}
              <motion.p
                className="text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Generate temporary email aliases instantly. Protect your real identity online with
                disposable, self-destructing identities that keep you safe.
              </motion.p>

              {/* Onboarding Steps */}
              <motion.div
                className="mb-16 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {/* Step Content */}
                <div className="glass-card p-8 mb-8">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -50 }}
                      transition={{ duration: 0.4, ease: [0.23, 0.78, 0.43, 1] }}
                      className="text-center"
                    >
                      {/* Icon */}
                      <motion.div
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5CE1E6] flex items-center justify-center"
                        animate={{
                          boxShadow: [
                            "0 0 30px rgba(108, 99, 255, 0.4)",
                            "0 0 50px rgba(92, 225, 230, 0.6)",
                            "0 0 30px rgba(108, 99, 255, 0.4)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {(() => {
                          const Icon = onboardingSteps[currentStep].icon;
                          return <Icon className="w-10 h-10 text-white" />;
                        })()}
                      </motion.div>

                      {/* Content */}
                      <h2 className="mb-4">{onboardingSteps[currentStep].title}</h2>
                      <p className="text-[#9CA3AF] leading-relaxed">
                        {onboardingSteps[currentStep].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {onboardingSteps.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentStep ? 1 : -1);
                        setCurrentStep(index);
                      }}
                      className="relative"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        animate={{
                          backgroundColor: index === currentStep ? "#5CE1E6" : "#9CA3AF",
                          scale: index === currentStep ? 1.5 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                      {index === currentStep && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          initial={{ scale: 1, opacity: 1 }}
                          animate={{ scale: 3, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{
                            backgroundColor: "#5CE1E6",
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setDirection(-1);
                        setCurrentStep(currentStep - 1);
                      }}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (currentStep < onboardingSteps.length - 1) {
                        setDirection(1);
                        setCurrentStep(currentStep + 1);
                      } else {
                        onOpenDashboard();
                      }
                    }}
                    className="flex-1"
                    icon={currentStep === onboardingSteps.length - 1 ? <Sparkles className="w-5 h-5" /> : undefined}
                  >
                    {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Particles for Extra Polish */}
        {showContent && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#5CE1E6]/40"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}
