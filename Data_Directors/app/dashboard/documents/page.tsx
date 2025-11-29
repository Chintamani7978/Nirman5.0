"use client"

import React, { useState } from "react"
import Link from "next/link"

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const documents = [
    {
      id: "1",
      title: "Introduction to Physics",
      fileName: "physics_chapter1.pdf",
      uploadedAt: "2 hours ago",
      size: "2.4 MB",
      status: "completed",
      flashcards: 45,
      quizzes: 3,
      thumbnail: "📘",
    },
    {
      id: "2",
      title: "Organic Chemistry Basics",
      fileName: "chemistry_notes.pdf",
      uploadedAt: "1 day ago",
      size: "3.8 MB",
      status: "completed",
      flashcards: 62,
      quizzes: 5,
      thumbnail: "🧪",
    },
    {
      id: "3",
      title: "Calculus I - Derivatives",
      fileName: "math_derivatives.pdf",
      uploadedAt: "3 days ago",
      size: "1.9 MB",
      status: "completed",
      flashcards: 38,
      quizzes: 4,
      thumbnail: "📐",
    },
    {
      id: "4",
      title: "World History - Ancient Rome",
      fileName: "history_rome.pdf",
      uploadedAt: "1 week ago",
      size: "5.2 MB",
      status: "completed",
      flashcards: 71,
      quizzes: 6,
      thumbnail: "🏛️",
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || doc.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Documents</h1>
          <p className="text-gray-400">
            {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="btn-3d-orange px-6 py-3 rounded-full font-semibold inline-block text-center"
        >
          📤 Upload New PDF
        </Link>
      </div>

      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
        >
          <option value="all">All Documents</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
        </select>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="dark-card p-6 rounded-xl border border-white/10 hover:neon-border transition-all group"
          >
            
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">{doc.thumbnail}</div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  ⋮
                </button>
              </div>
            </div>

            
            <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-gradient-neon transition-all">
              {doc.title}
            </h3>
            <p className="text-sm text-gray-400 mb-4 truncate">{doc.fileName}</p>

            
            <div className="flex gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <span>🃏</span>
                <span>{doc.flashcards}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <span>📝</span>
                <span>{doc.quizzes}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <span>📦</span>
                <span>{doc.size}</span>
              </div>
            </div>

            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{doc.uploadedAt}</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                {doc.status}
              </span>
            </div>

            
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/dashboard/documents/${doc.id}/flashcards`}
                className="btn-3d-orange-secondary px-4 py-2 rounded-lg text-sm text-center font-medium"
              >
                🃏 Flashcards
              </Link>
              <Link
                href={`/dashboard/documents/${doc.id}/quiz`}
                className="btn-3d-orange-secondary px-4 py-2 rounded-lg text-sm text-center font-medium"
              >
                📝 Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>

      
      {filteredDocuments.length === 0 && (
        <div className="dark-card p-12 rounded-xl text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? "Try a different search term" : "Upload your first PDF to get started"}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/upload"
              className="btn-3d-orange px-6 py-3 rounded-full font-semibold inline-block"
            >
              📤 Upload PDF
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

