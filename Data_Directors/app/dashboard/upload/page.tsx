"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [prompt, setPrompt] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0] && files[0].type === "application/pdf") {
      setFile(files[0])
    } else {
      alert("Please upload a PDF file")
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            router.push("/dashboard/documents")
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Document</h1>
        <p className="text-gray-400">
          Upload a PDF to generate summaries, flashcards, and quizzes instantly
        </p>
      </div>

      
      <div className="dark-card-elevated p-8 rounded-xl">
        {!isProcessing ? (
          <>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging
                  ? "border-purple-500 bg-purple-500/10 neon-glow-purple"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {file ? file.name : "Drop your PDF here"}
              </h3>
              <p className="text-gray-400 mb-6">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse"}
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild className="px-6 py-3 rounded-full cursor-pointer inline-block">
                <label htmlFor="file-upload">{file ? "Change File" : "Select PDF"}</label>
              </Button>
            </div>

            
            <div className="mt-6">
              <label className="block text-white font-medium mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Focus on chapter 3, create beginner-level questions..."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                rows={4}
              />
            </div>

            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-white font-medium">Summary</div>
                <div className="text-xs text-gray-400">Brief & Detailed</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🃏</div>
                <div className="text-white font-medium">Flashcards</div>
                <div className="text-xs text-gray-400">Auto-generated</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">❓</div>
                <div className="text-white font-medium">Quiz</div>
                <div className="text-xs text-gray-400">Multiple choice</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🎬</div>
                <div className="text-white font-medium">Videos</div>
                <div className="text-xs text-gray-400">YouTube picks</div>
              </div>
            </div>

            
            {file && (
              <div className="mt-6 flex gap-4">
                <Button onClick={handleUpload} className="px-8 py-3 rounded-full flex-1 font-semibold">
                  🚀 Process Document
                </Button>
                <Button onClick={() => setFile(null)} className="px-6 py-3 rounded-full font-medium">
                  Cancel
                </Button>
              </div>
            )}
          </>
        ) : (
          
          <div className="text-center py-12">
            <div className="text-6xl mb-6 animate-bounce">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-2">AI is Processing...</h3>
            <p className="text-gray-400 mb-8">
              Generating summaries, flashcards, and quizzes
            </p>

            
            <div className="max-w-md mx-auto">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full gradient-neon-purple-pink transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-gray-400">{progress}% Complete</div>
            </div>

            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { step: "Analyzing PDF", icon: "📄", done: progress > 25 },
                { step: "Creating Summary", icon: "📝", done: progress > 50 },
                { step: "Generating Cards", icon: "🃏", done: progress > 75 },
                { step: "Building Quiz", icon: "✅", done: progress === 100 },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg ${item.done ? "bg-green-500/20" : "bg-white/5"}`}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs text-white">{item.step}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>💡</span> Tips for Best Results
        </h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Use clear, well-formatted PDF documents</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Text-based PDFs work better than scanned images</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Add specific instructions for targeted learning materials</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Maximum file size: 50MB</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

