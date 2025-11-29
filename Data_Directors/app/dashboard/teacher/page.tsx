"use client"

import React, { useState } from "react"

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  const classes = [
    { id: "class-1", name: "Class 10-A", students: 35, avgScore: 82 },
    { id: "class-2", name: "Class 10-B", students: 32, avgScore: 78 },
    { id: "class-3", name: "Class 11-Science", students: 28, avgScore: 85 },
  ]

  const students = [
    { 
      id: 1, 
      name: "Aarav Sharma", 
      class: "Class 10-A", 
      avgScore: 88, 
      quizzesTaken: 15, 
      lastActive: "2 hours ago",
      status: "on-track",
      streak: 12
    },
    { 
      id: 2, 
      name: "Priya Patel", 
      class: "Class 10-A", 
      avgScore: 92, 
      quizzesTaken: 18, 
      lastActive: "1 hour ago",
      status: "excellent",
      streak: 15
    },
    { 
      id: 3, 
      name: "Rohan Mehta", 
      class: "Class 10-B", 
      avgScore: 65, 
      quizzesTaken: 8, 
      lastActive: "3 days ago",
      status: "needs-attention",
      streak: 2
    },
    { 
      id: 4, 
      name: "Ananya Singh", 
      class: "Class 10-A", 
      avgScore: 85, 
      quizzesTaken: 14, 
      lastActive: "5 hours ago",
      status: "on-track",
      streak: 8
    },
    { 
      id: 5, 
      name: "Arjun Kumar", 
      class: "Class 11-Science", 
      avgScore: 78, 
      quizzesTaken: 12, 
      lastActive: "1 day ago",
      status: "on-track",
      streak: 5
    },
  ]

  const recentAssignments = [
    { 
      id: 1, 
      title: "Physics - Chapter 5 Quiz", 
      class: "Class 10-A", 
      dueDate: "Tomorrow", 
      submitted: 28, 
      total: 35,
      avgScore: 82
    },
    { 
      id: 2, 
      title: "Chemistry Lab Report", 
      class: "Class 11-Science", 
      dueDate: "In 3 days", 
      submitted: 15, 
      total: 28,
      avgScore: 88
    },
    { 
      id: 3, 
      title: "Math - Calculus Practice", 
      class: "Class 10-B", 
      dueDate: "Today", 
      submitted: 30, 
      total: 32,
      avgScore: 75
    },
  ]

  const analytics = {
    totalStudents: 95,
    activeThisWeek: 82,
    avgClassScore: 82,
    assignmentsPending: 12,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-400 bg-green-500/20"
      case "on-track": return "text-blue-400 bg-blue-500/20"
      case "needs-attention": return "text-red-400 bg-red-500/20"
      default: return "text-gray-400 bg-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teacher Dashboard</h1>
          <p className="text-gray-400">Monitor student progress and manage assignments</p>
        </div>
        <button
          onClick={() => setShowAssignmentModal(true)}
          className="btn-3d-orange px-6 py-3 rounded-lg font-semibold"
        >
          ➕ Create Assignment
        </button>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-3xl font-bold text-white mb-1">{analytics.totalStudents}</div>
          <div className="text-sm text-gray-400">Total Students</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-green-400 mb-1">{analytics.activeThisWeek}</div>
          <div className="text-sm text-gray-400">Active This Week</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-gradient-neon mb-1">{analytics.avgClassScore}%</div>
          <div className="text-sm text-gray-400">Avg Class Score</div>
        </div>
        <div className="dark-card-elevated p-6 rounded-xl">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-3xl font-bold text-yellow-400 mb-1">{analytics.assignmentsPending}</div>
          <div className="text-sm text-gray-400">Pending Reviews</div>
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">My Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div 
              key={cls.id}
              className="p-4 rounded-lg dark-card-elevated hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => setSelectedClass(cls.id)}
            >
              <div className="text-2xl mb-3">🎓</div>
              <div className="text-white font-semibold mb-2">{cls.name}</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{cls.students} students</span>
                <span className="text-gradient-neon font-semibold">{cls.avgScore}% avg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4">Recent Assignments</h3>
        <div className="space-y-3">
          {recentAssignments.map((assignment) => (
            <div key={assignment.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-white font-medium mb-1">{assignment.title}</div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>📚 {assignment.class}</span>
                    <span>•</span>
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {assignment.submitted}/{assignment.total}
                    </div>
                    <div className="text-xs text-gray-400">Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient-neon">{assignment.avgScore}%</div>
                    <div className="text-xs text-gray-400">Avg Score</div>
                  </div>
                  <button className="btn-3d-orange-secondary px-4 py-2 rounded-lg text-sm">
                    View Details
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-neon-purple-pink"
                    style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Student Performance</h3>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white text-sm"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-gray-400 font-medium pb-3 px-2">Student</th>
                <th className="text-left text-gray-400 font-medium pb-3 px-2">Class</th>
                <th className="text-center text-gray-400 font-medium pb-3 px-2">Avg Score</th>
                <th className="text-center text-gray-400 font-medium pb-3 px-2">Quizzes</th>
                <th className="text-center text-gray-400 font-medium pb-3 px-2">Streak</th>
                <th className="text-center text-gray-400 font-medium pb-3 px-2">Status</th>
                <th className="text-center text-gray-400 font-medium pb-3 px-2">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-white/10 hover:bg-white/5 transition-all">
                  <td className="py-4 px-2">
                    <div className="text-white font-medium">{student.name}</div>
                  </td>
                  <td className="py-4 px-2 text-gray-400">{student.class}</td>
                  <td className="py-4 px-2 text-center">
                    <span className={`text-lg font-bold ${
                      student.avgScore >= 85 ? "text-green-400" : 
                      student.avgScore >= 70 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {student.avgScore}%
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center text-white">{student.quizzesTaken}</td>
                  <td className="py-4 px-2 text-center">
                    <span className="text-orange-400 font-semibold">🔥 {student.streak}</span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status === "excellent" && "Excellent"}
                      {student.status === "on-track" && "On Track"}
                      {student.status === "needs-attention" && "Needs Help"}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center text-gray-400 text-sm">{student.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="dark-card-elevated p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Assignment</h2>
              <button 
                onClick={() => setShowAssignmentModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">Assignment Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Physics Chapter 5 Quiz"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Select Class</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option value="">Choose a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Assignment Type</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option value="quiz">Quiz</option>
                  <option value="flashcards">Flashcards Practice</option>
                  <option value="reading">Reading Assignment</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Due Date</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Description (Optional)</label>
                <textarea 
                  rows={4}
                  placeholder="Add instructions or notes for students..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  className="flex-1 btn-3d-orange px-6 py-3 rounded-lg font-semibold"
                >
                  Create Assignment
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-6 py-3 rounded-lg font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

