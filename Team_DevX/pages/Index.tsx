import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  MapPin,
  TrendingUp,
  Users,
  Vote,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import { motion } from "framer-motion";

const EarthBG = "/earth-bg.jpeg";

// === BACKGROUND GLOW SHAPE ===
const EarthShape = () => (
  <div
    style={{
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "150vmax",
      height: "150vmax",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(0,110,255,0.35), transparent 70%)",
      filter: "blur(65px)",
      zIndex: 0,
    }}
  />
);

// === ANIMATION PRESETS ===
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalSolutions: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) navigate("/dashboard");
  };

  const loadStats = async () => {
    const { count: problemsCount } = await supabase
      .from("problems")
      .select("*", { count: "exact", head: true });

    const { count: solutionsCount } = await supabase
      .from("solutions")
      .select("*", { count: "exact", head: true });

    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    setStats({
      totalProblems: problemsCount || 0,
      totalSolutions: solutionsCount || 0,
      activeUsers: usersCount || 0,
    });
  };

  return (
    <div className="min-h-screen text-foreground relative">

      {/* 🌌 HERO BACKGROUND */}
      <div
        className="relative w-full min-h-[95vh] bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(15, 5, 5, 0.81)), url('/earth-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

        {/* HEADER */}
        <div className="relative z-10 pt-6 pb-10">
          <Header
            right={
              <div className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="px-8 rounded-full text-sm font-medium bg-sky-200 text-sky-900 hover:bg-sky-100 transition"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </div>
            }
          />
        </div>

        {/* HERO CONTENT */}
        <section className="relative py-24 px-6 text-center text-white z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <MapPin className="h-16 w-16 text-sky-400 mx-auto mb-6 drop-shadow-xl" />
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            custom={1}
            className="text-5xl md:text-7xl font-extrabold mb-4 text-sky-100"
          >
            VoiceUp
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-xl md:text-2xl text-sky-200 max-w-2xl mx-auto mb-6"
          >
            Empowering Citizens Through Digital Participation
          </motion.p>

          <motion.p
            variants={fadeInUp}
            custom={3}
            className="text-lg text-sky-300 max-w-3xl mx-auto mb-8"
          >
            Report problems, propose solutions, vote on priorities, and track progress.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-sky-200 text-sky-900 hover:bg-sky-100 px-8 rounded-full shadow-lg hover:scale-110 transition"
              onClick={() => navigate("/auth")}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-sky-300 text-sky-200 hover:bg-sky-300/10 px-8 rounded-full hover:scale-105 transition"
              onClick={() => navigate("/dashboard")}
            >
              View Problems
            </Button>
          </motion.div>
        </section>

        <EarthShape />
      </div>

      {/* 📊 STATS SECTION */}
      <section className="py-20 bg-gradient-to-b from-blue-900/30 to-blue-950/60 backdrop-blur-md">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {[
            {
              icon: <TrendingUp className="h-12 w-12 text-sky-300" />,
              value: stats.totalProblems,
              label: "Problems Reported",
            },
            {
              icon: <CheckCircle className="h-12 w-12 text-green-300" />,
              value: stats.totalSolutions,
              label: "Solutions Proposed",
            },
            {
              icon: <Users className="h-12 w-12 text-blue-300" />,
              value: stats.activeUsers,
              label: "Active Citizens",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-xl hover:-translate-y-2 transition">
                <CardContent>
                  <div className="mb-4 flex justify-center">{item.icon}</div>
                  <div className="text-4xl font-bold text-purple-100 mb-2">
                    {item.value.toLocaleString()}
                  </div>
                  <div className="text-sky-300 font-medium">{item.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⭐ FEATURES SECTION */}
      <section className="py-24 px-6 bg-gradient-to-t from-blue-950 to-blue-900">
        <div className="container mx-auto max-w-6xl">

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-sky-100 mb-4">
              How VoiceUp Works
            </h2>
            <p className="text-lg text-sky-300 max-w-2xl mx-auto">
              A transparent platform connecting citizens with real solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mx-auto">
            {[
              {
                icon: <MapPin className="h-12 w-12 text-sky-300" />,
                title: "Report Problems",
                desc: "Easily report local issues with photos, location, and descriptions.",
              },
              {
                icon: <Vote className="h-12 w-12 text-green-300" />,
                title: "Vote & Discuss",
                desc: "Vote on solutions and engage in meaningful community discussions.",
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-blue-300" />,
                title: "Track Progress",
                desc: "See real-time updates as issues go from report to resolution.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl"
              >
                <CardContent>
                  {item.icon}
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 mt-2">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Index;
