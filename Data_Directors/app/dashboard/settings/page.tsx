"use client"

import React, { useState } from "react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    emailQuizzes: true,
    emailProgress: true,
    pushQuizzes: false,
    pushAchievements: true,
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy & Security", icon: "🔒" },
    { id: "subscription", label: "Subscription", icon: "💳" },
  ]

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and settings</p>
      </div>

      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "btn-3d-orange"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl text-white">
                AS
              </div>
              <div className="flex-1">
                <button className="btn-3d-orange-secondary px-4 py-2 rounded-lg text-sm mb-2">
                  Change Avatar
                </button>
                <p className="text-sm text-gray-400">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  defaultValue="Aarav Sharma"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Email</label>
                <input
                  type="email"
                  defaultValue="aarav.sharma@example.com"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Phone</label>
                <input
                  type="tel"
                  defaultValue="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Grade/Class</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option>Class 10</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-white mb-2 font-medium">Bio</label>
              <textarea
                rows={4}
                defaultValue="Passionate learner focused on science and mathematics."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-3d-orange px-6 py-3 rounded-lg font-semibold">
                Save Changes
              </button>
              <button className="px-6 py-3 rounded-lg font-semibold bg-white/10 text-white hover:bg-white/20 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Learning Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">Language</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option>English</option>
                  <option>हिंदी (Hindi)</option>
                  <option>বাংলা (Bengali)</option>
                  <option>தமிழ் (Tamil)</option>
                  <option>తెలుగు (Telugu)</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Default Quiz Difficulty</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Quiz Timer Duration</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option>5 minutes</option>
                  <option>10 minutes</option>
                  <option>15 minutes</option>
                  <option>No timer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Display Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Dark Mode</div>
                  <div className="text-sm text-gray-400">Currently enabled (default)</div>
                </div>
                <div className="w-12 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Text-to-Speech Auto-play</div>
                  <div className="text-sm text-gray-400">Automatically read content aloud</div>
                </div>
                <div className="w-12 h-6 bg-white/20 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Show Keyboard Shortcuts</div>
                  <div className="text-sm text-gray-400">Display keyboard hints in UI</div>
                </div>
                <div className="w-12 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Kid Mode Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Enable Kid Mode</div>
                  <div className="text-sm text-gray-400">Simplified interface with gamification</div>
                </div>
                <div className="w-12 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 font-medium">Content Filtering</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option>Strict (5-10 years)</option>
                  <option>Moderate (11-15 years)</option>
                  <option>Relaxed (16+ years)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Quiz Reminders</div>
                  <div className="text-sm text-gray-400">Get reminded about pending quizzes</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailQuizzes}
                  onChange={(e) => setNotifications({ ...notifications, emailQuizzes: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Progress Reports</div>
                  <div className="text-sm text-gray-400">Weekly summary of your learning progress</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailProgress}
                  onChange={(e) => setNotifications({ ...notifications, emailProgress: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>

          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Quiz Deadlines</div>
                  <div className="text-sm text-gray-400">Notify before quiz deadline</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pushQuizzes}
                  onChange={(e) => setNotifications({ ...notifications, pushQuizzes: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Achievements</div>
                  <div className="text-sm text-gray-400">Celebrate milestones and badges</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pushAchievements}
                  onChange={(e) => setNotifications({ ...notifications, pushAchievements: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Profile Visibility</div>
                  <div className="text-sm text-gray-400">Who can see your profile and progress</div>
                </div>
                <select className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white">
                  <option>Only Me</option>
                  <option>Teachers & Parents</option>
                  <option>Everyone</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Show in Leaderboard</div>
                  <div className="text-sm text-gray-400">Display your name on public leaderboards</div>
                </div>
                <div className="w-12 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
            </div>
          </div>

          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-6">Security</h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div className="text-white font-medium mb-1">Change Password</div>
                <div className="text-sm text-gray-400">Update your password regularly</div>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div className="text-white font-medium mb-1">Two-Factor Authentication</div>
                <div className="text-sm text-gray-400">Add extra security to your account</div>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div className="text-white font-medium mb-1">Active Sessions</div>
                <div className="text-sm text-gray-400">Manage devices logged into your account</div>
              </button>
            </div>
          </div>

          <div className="dark-card-elevated p-6 rounded-xl border border-red-500/30">
            <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/30">
                <div className="text-red-400 font-medium mb-1">Download My Data</div>
                <div className="text-sm text-gray-400">Export all your learning data</div>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/30">
                <div className="text-red-400 font-medium mb-1">Delete Account</div>
                <div className="text-sm text-gray-400">Permanently delete your account and data</div>
              </button>
            </div>
          </div>
        </div>
      )}

      
      {activeTab === "subscription" && (
        <div className="space-y-6">
          <div className="dark-card-elevated p-6 rounded-xl neon-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Student Plan (Free)</h3>
                <p className="text-gray-400">Currently active</p>
              </div>
              <div className="text-3xl">🎓</div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✓</span> 10 PDF uploads per month
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✓</span> Unlimited quizzes and flashcards
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✓</span> Kid Mode access
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-red-400">✗</span> Advanced analytics
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-red-400">✗</span> Priority AI processing
              </div>
            </div>
            <button className="btn-3d-orange w-full py-3 rounded-lg font-semibold">
              Upgrade to Teacher Plan
            </button>
          </div>

          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Available Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-lg dark-card-elevated border border-white/20">
                <div className="text-2xl mb-4">👨‍🏫</div>
                <div className="text-xl font-bold text-white mb-2">Teacher Plan</div>
                <div className="text-3xl font-bold text-gradient-neon mb-4">₹499<span className="text-sm text-gray-400">/month</span></div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ Everything in Student</li>
                  <li>✓ Classroom management</li>
                  <li>✓ Assignment creation</li>
                  <li>✓ Student progress tracking</li>
                  <li>✓ Advanced analytics</li>
                </ul>
                <button className="w-full btn-3d-orange-secondary py-2 rounded-lg font-medium">
                  Select Plan
                </button>
              </div>
              <div className="p-6 rounded-lg dark-card-elevated border border-purple-500/50">
                <div className="text-2xl mb-4">🏫</div>
                <div className="text-xl font-bold text-white mb-2">School Plan</div>
                <div className="text-3xl font-bold text-gradient-neon mb-4">₹2999<span className="text-sm text-gray-400">/month</span></div>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">
                  <li>✓ Everything in Teacher</li>
                  <li>✓ Up to 500 students</li>
                  <li>✓ Custom gamified modules</li>
                  <li>✓ Institutional dashboard</li>
                  <li>✓ Priority support</li>
                </ul>
                <button className="w-full btn-3d-orange-secondary py-2 rounded-lg font-medium">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Billing History</h3>
            <div className="text-gray-400 text-center py-8">
              No billing history available
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

