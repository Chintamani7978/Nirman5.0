"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {

  const stats = [
    { label: "Documents", value: "12", icon: "📚", change: "+3 this week" },
    { label: "Flashcards", value: "248", icon: "🃏", change: "+42 this week" },
    { label: "Quizzes Taken", value: "35", icon: "📝", change: "+7 this week" },
    { label: "Average Score", value: "85%", icon: "🎯", change: "+5% this month" },
  ]

  const recentActivity = [
    {
      type: "upload",
      title: "Uploaded Introduction to Physics",
      time: "2 hours ago",
      icon: "📤",
    },
    {
      type: "quiz",
      title: "Completed Chemistry Quiz - Scored 92%",
      time: "5 hours ago",
      icon: "✅",
    },
    {
      type: "flashcard",
      title: "Practiced 20 Math flashcards",
      time: "Yesterday",
      icon: "🃏",
    },
    {
      type: "game",
      title: "Earned 'Quick Learner' badge in Kid Mode",
      time: "2 days ago",
      icon: "🏆",
    },
  ]

  const recommendations = [
    {
      title: "Complete Daily Quiz",
      description: "Keep your learning streak alive!",
      action: "Start Quiz",
      href: "/dashboard/quizzes",
    },
    {
      title: "Upload New Document",
      description: "Transform your next PDF into flashcards",
      action: "Upload",
      href: "/dashboard/upload",
    },
    {
      title: "Practice Flashcards",
      description: "Review your Biology flashcards",
      action: "Practice",
      href: "/dashboard/flashcards",
    },
  ]

  return (
    <div className="space-y-6">
      
      <div className="dark-card-elevated p-8 rounded-xl neon-border">
        <h2 className="text-3xl font-bold text-white mb-2">
          Ready to learn something new?
        </h2>
        <p className="text-gray-400 mb-6">
          Upload a PDF or start a quiz to continue your learning journey
        </p>
        <Button asChild className="px-6 py-3 rounded-full inline-block font-semibold">
          <Link href="/dashboard/upload">🚀 Upload New PDF</Link>
        </Button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="dark-card p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-sm text-green-400">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 dark-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="dark-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Recommended
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                <Button asChild className="px-4 py-2 rounded-full text-sm inline-block font-medium">
                  <Link href={rec.href}>{rec.action}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/quizzes"
          className="dark-card p-6 rounded-xl border border-white/10 hover:neon-border transition-all group"
        >
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-white mb-2">Take a Quiz</h3>
          <p className="text-sm text-gray-400">
            Test your knowledge with AI-generated quizzes
          </p>
        </Link>

        <Link
          href="/dashboard/flashcards"
          className="dark-card p-6 rounded-xl border border-white/10 hover:neon-border transition-all group"
        >
          <div className="text-4xl mb-3">🃏</div>
          <h3 className="text-lg font-semibold text-white mb-2">Practice Flashcards</h3>
          <p className="text-sm text-gray-400">
            Review and memorize key concepts
          </p>
        </Link>

        <Link
          href="/dashboard/kid-mode"
          className="dark-card p-6 rounded-xl border border-white/10 hover:neon-border transition-all group"
        >
          <div className="text-4xl mb-3">🎮</div>
          <h3 className="text-lg font-semibold text-white mb-2">Kid Mode</h3>
          <p className="text-sm text-gray-400">
            Fun gamified learning for young learners
          </p>
        </Link>
      </div>
    </div>
  )
}

