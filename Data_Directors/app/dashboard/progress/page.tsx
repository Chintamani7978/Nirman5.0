"use client"

import React, { useState } from "react"

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("week")

  const stats = {
    totalStudyTime: 847, // minutes
    quizzesTaken: 35,
    averageScore: 85,
    flashcardsReviewed: 248,
    currentStreak: 7,
    longestStreak: 14,
    documentsUploaded: 12,
    totalPoints: 2450,
  }

  const subjectProgress = [
    { subject: "Physics", mastery: 78, quizzes: 12, avgScore: 82, color: "blue" },
    { subject: "Chemistry", mastery: 85, quizzes: 15, avgScore: 88, color: "green" },
    { subject: "Mathematics", mastery: 72, quizzes: 10, avgScore: 79, color: "purple" },
    { subject: "History", mastery: 90, quizzes: 8, avgScore: 92, color: "orange" },
  ]

  const weeklyActivity = [
    { day: "Mon", study: 45, quizzes: 3 },
    { day: "Tue", study: 60, quizzes: 5 },
    { day: "Wed", study: 30, quizzes: 2 },
    { day: "Thu", study: 75, quizzes: 6 },
    { day: "Fri", study: 50, quizzes: 4 },
    { day: "Sat", study: 90, quizzes: 8 },
    { day: "Sun", study: 40, quizzes: 3 },
  ]

  const recentQuizzes = [
    { title: "Physics - Newton's Laws", score: 92, date: "Today", difficulty: "medium" },
    { title: "Chemistry - Organic Compounds", score: 88, date: "Yesterday", difficulty: "hard" },
    { title: "Math - Calculus Basics", score: 79, date: "2 days ago", difficulty: "medium" },
    { title: "History - Ancient Rome", score: 95, date: "3 days ago", difficulty: "easy" },
  ]

  const achievements = [
    { title: "7-Day Streak", icon: "🔥", date: "Today", description: "Studied for 7 days in a row" },
    { title: "Quiz Master", icon: "🎯", date: "2 days ago", description: "Scored 90%+ on 5 quizzes" },
    { title: "Fast Learner", icon: "⚡", date: "1 week ago", description: "Completed 10 quizzes in one day" },
  ]

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Progress</h1>
          <p className="text-gray-400">Track your learning journey and achievements</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalStudyTime}</div>
          <div className="text-sm text-gray-400">Minutes Studied</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-3xl font-bold text-white mb-1">{stats.quizzesTaken}</div>
          <div className="text-sm text-gray-400">Quizzes Taken</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-gradient-neon mb-1">{stats.averageScore}%</div>
          <div className="text-sm text-gray-400">Average Score</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-gradient-neon mb-1">{stats.currentStreak}</div>
          <div className="text-sm text-gray-400">Day Streak</div>
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
        <div className="flex items-end justify-between gap-4 h-64">
          {weeklyActivity.map((day, index) => {
            const maxStudy = Math.max(...weeklyActivity.map((d) => d.study))
            const height = (day.study / maxStudy) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end flex-1">
                  <div className="text-sm text-purple-400 mb-2">{day.quizzes} quizzes</div>
                  <div
                    className="w-full rounded-t-lg gradient-neon-purple-pink transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${day.study} minutes`}
                  />
                </div>
                <div className="text-sm text-gray-400 mt-2">{day.day}</div>
              </div>
            )
          })}
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-6">Subject Mastery</h3>
        <div className="space-y-6">
          {subjectProgress.map((subject, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {subject.subject === "Physics" && "📘"}
                    {subject.subject === "Chemistry" && "🧪"}
                    {subject.subject === "Mathematics" && "📐"}
                    {subject.subject === "History" && "🏛️"}
                  </div>
                  <div>
                    <div className="text-white font-medium">{subject.subject}</div>
                    <div className="text-sm text-gray-400">
                      {subject.quizzes} quizzes • Avg: {subject.avgScore}%
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-gradient-neon">{subject.mastery}%</div>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-neon-purple-pink transition-all duration-500"
                  style={{ width: `${subject.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="dark-card p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Recent Quizzes</h3>
          <div className="space-y-3">
            {recentQuizzes.map((quiz, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">{quiz.title}</div>
                    <div className="text-sm text-gray-400">{quiz.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      quiz.score >= 90 ? "text-green-400" : quiz.score >= 70 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {quiz.score}%
                    </div>
                    <div className="text-xs text-gray-400">{quiz.difficulty}</div>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      quiz.score >= 90 ? "bg-green-500" : quiz.score >= 70 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${quiz.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="dark-card p-6 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-4 rounded-lg dark-card-elevated neon-border">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-semibold mb-1">{achievement.title}</div>
                    <div className="text-sm text-gray-400 mb-2">{achievement.description}</div>
                    <div className="text-xs text-gray-500">{achievement.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="dark-card-elevated p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">📊 Learning Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-3xl mb-2">💪</div>
            <div className="text-white font-semibold mb-1">Strongest Subject</div>
            <div className="text-2xl font-bold text-gradient-neon mb-1">History</div>
            <div className="text-sm text-gray-400">90% mastery</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-white font-semibold mb-1">Focus Area</div>
            <div className="text-2xl font-bold text-gradient-neon mb-1">Mathematics</div>
            <div className="text-sm text-gray-400">Needs more practice</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-white font-semibold mb-1">Best Time</div>
            <div className="text-2xl font-bold text-gradient-neon mb-1">Saturday</div>
            <div className="text-sm text-gray-400">Most productive day</div>
          </div>
        </div>
      </div>
    </div>
  )
}

