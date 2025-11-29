"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Upload PDF", href: "/dashboard/upload", icon: "📤" },
    { name: "My Documents", href: "/dashboard/documents", icon: "📚" },
    { name: "Flashcards", href: "/dashboard/flashcards", icon: "🃏" },
    { name: "Quizzes", href: "/dashboard/quizzes", icon: "📝" },
    { name: "Kid Mode", href: "/dashboard/kid-mode", icon: "🎮" },
    { name: "Progress", href: "/dashboard/progress", icon: "📈" },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } dark-card-elevated border-r border-white/10 transition-all duration-300 flex flex-col`}
      >
        
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/logopng.png" alt="PadhAI Logo" className="w-full h-full object-contain" />
            </div>
            {isSidebarOpen && <span className="text-gradient-neon text-xl font-bold">PadhAI</span>}
          </Link>
        </div>

        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-white/10 text-white neon-border"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          size="icon"
          className="h-16 w-full rounded-none border-t border-white/10"
        >
          {isSidebarOpen ? "←" : "→"}
        </Button>
      </aside>

      
      <main className="flex-1 flex flex-col">
        
        <header className="h-16 dark-card border-b border-white/10 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Welcome back!</h1>
            <p className="text-sm text-gray-400">Let's continue learning</p>
          </div>

          <div className="flex items-center gap-4">
            
            <Button size="icon" className="w-10 h-10 rounded-lg">
              🔔
            </Button>

            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-neon-purple-pink flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </header>

        
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  )
}

