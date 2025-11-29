"use client"

import React, { useState } from "react"
import Link from "next/link"

export default function KidModePage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const kidProfile = {
    name: "Alex",
    avatar: "🦁",
    level: 12,
    totalPoints: 2450,
    streakDays: 7,
    badges: [
      { id: "1", name: "Quick Learner", icon: "⚡", earned: true },
      { id: "2", name: "Reading Master", icon: "📚", earned: true },
      { id: "3", name: "Math Wizard", icon: "🧙", earned: true },
      { id: "4", name: "Science Explorer", icon: "🔬", earned: false },
      { id: "5", name: "Perfect Week", icon: "🎯", earned: true },
      { id: "6", name: "Super Star", icon: "⭐", earned: false },
    ],
  }

  const games = [
    {
      id: "flashcard-match",
      title: "Flashcard Match",
      description: "Match questions with answers!",
      icon: "🎴",
      points: "50-100",
      difficulty: "Easy",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "quiz-race",
      title: "Quiz Race",
      description: "Answer as fast as you can!",
      icon: "🏃",
      points: "100-200",
      difficulty: "Medium",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "word-puzzle",
      title: "Word Puzzle",
      description: "Find the hidden words!",
      icon: "🧩",
      points: "75-150",
      difficulty: "Easy",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "memory-master",
      title: "Memory Master",
      description: "Remember and repeat!",
      icon: "🧠",
      points: "80-160",
      difficulty: "Hard",
      color: "from-orange-500 to-red-500",
    },
  ]

  const recentActivities = [
    { activity: "Completed Quiz Race", points: 150, time: "10 min ago", icon: "🏃" },
    { activity: "Earned 'Quick Learner' Badge", points: 100, time: "1 hour ago", icon: "⚡" },
    { activity: "Flashcard Match - Level 5", points: 75, time: "Today", icon: "🎴" },
  ]

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">{kidProfile.avatar}</span>
            Welcome, {kidProfile.name}!
          </h1>
          <p className="text-gray-400">Let's learn and have fun today!</p>
        </div>
        <Link
          href="/dashboard/kid-mode/avatar"
          className="btn-3d-orange-secondary px-6 py-3 rounded-full font-medium"
        >
          ✏️ Customize Avatar
        </Link>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dark-card-elevated p-6 rounded-xl text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-3xl font-bold text-gradient-neon mb-1">{kidProfile.level}</div>
          <div className="text-sm text-gray-400">Level</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-gradient-neon mb-1">{kidProfile.totalPoints}</div>
          <div className="text-sm text-gray-400">Total Points</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-gradient-neon mb-1">{kidProfile.streakDays}</div>
          <div className="text-sm text-gray-400">Day Streak</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl text-center">
          <div className="text-4xl mb-2">🎖️</div>
          <div className="text-3xl font-bold text-gradient-neon mb-1">
            {kidProfile.badges.filter((b) => b.earned).length}
          </div>
          <div className="text-sm text-gray-400">Badges</div>
        </div>
      </div>

      
      <div className="dark-card-elevated p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Level {kidProfile.level}</h3>
            <p className="text-sm text-gray-400">350 more points to Level {kidProfile.level + 1}!</p>
          </div>
          <div className="text-2xl">🎯</div>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full gradient-neon-purple-pink" style={{ width: "65%" }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>2450 XP</span>
          <span>2800 XP</span>
        </div>
      </div>

      
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">🎮 Choose Your Game!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="dark-card-elevated p-6 rounded-xl border-2 border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
              onClick={() => setSelectedGame(game.id)}
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform`}>
                {game.icon}
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">{game.title}</h3>
              <p className="text-sm text-gray-400 text-center mb-4">{game.description}</p>
              <div className="flex justify-between text-xs">
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                  {game.points} pts
                </span>
                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                  {game.difficulty}
                </span>
              </div>
              <button className="w-full mt-4 btn-3d-orange px-4 py-2 rounded-full text-sm font-semibold">
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🏅</span> Badge Collection
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {kidProfile.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl text-center transition-all ${
                badge.earned
                  ? "dark-card-elevated border-2 border-yellow-500/50"
                  : "bg-white/5 opacity-50 grayscale"
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="text-xs text-white font-medium">{badge.name}</div>
              {badge.earned && <div className="text-xs text-green-400 mt-1">✓ Earned</div>}
            </div>
          ))}
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark-card p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="text-3xl">{activity.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.activity}</div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">+{activity.points}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="dark-card-elevated p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Daily Challenge
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Answer 10 Questions</span>
                <span className="text-purple-400 font-bold">7/10</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: "70%" }} />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Study for 15 minutes</span>
                <span className="text-green-400 font-bold">✓ Done!</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Complete 1 Game</span>
                <span className="text-orange-400 font-bold">0/1</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: "0%" }} />
              </div>
            </div>

            <div className="text-center mt-6">
              <div className="text-sm text-gray-400 mb-2">Complete all challenges to earn</div>
              <div className="text-2xl font-bold text-gradient-neon">+500 Bonus Points!</div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏆</span> Leaderboard
          </h3>
          <Link href="/dashboard/kid-mode/leaderboard" className="text-purple-400 hover:text-purple-300 text-sm">
            View All →
          </Link>
        </div>
        <div className="space-y-2">
          {[
            { rank: 1, name: "Emma", points: 3200, avatar: "🦄" },
            { rank: 2, name: "Alex", points: 2450, avatar: "🦁", isYou: true },
            { rank: 3, name: "Max", points: 2150, avatar: "🐻" },
          ].map((player) => (
            <div
              key={player.rank}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                player.isYou ? "bg-purple-500/20 border-2 border-purple-500/50" : "bg-white/5"
              }`}
            >
              <div className="text-2xl font-bold text-gray-400 w-8">#{player.rank}</div>
              <div className="text-3xl">{player.avatar}</div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  {player.name} {player.isYou && <span className="text-purple-400">(You!)</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gradient-neon">{player.points}</div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

