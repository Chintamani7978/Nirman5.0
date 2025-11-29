"use client"

import React, { useState, useEffect } from "react"

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [filter, setFilter] = useState("all")

  const flashcards = [
    {
      id: "1",
      question: "What is Newton's First Law of Motion?",
      answer:
        "An object at rest stays at rest and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.",
      difficulty: "medium",
      subject: "Physics",
      mastered: false,
    },
    {
      id: "2",
      question: "Define photosynthesis",
      answer:
        "The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.",
      difficulty: "easy",
      subject: "Biology",
      mastered: true,
    },
    {
      id: "3",
      question: "What is the quadratic formula?",
      answer: "x = (-b ± √(b² - 4ac)) / 2a, used to solve equations of the form ax² + bx + c = 0",
      difficulty: "hard",
      subject: "Mathematics",
      mastered: false,
    },
    {
      id: "4",
      question: "What caused the fall of the Roman Empire?",
      answer:
        "Multiple factors including economic troubles, overexpansion, military defeats, government corruption, and barbarian invasions.",
      difficulty: "medium",
      subject: "History",
      mastered: false,
    },
  ]

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const handleMastered = () => {

    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault()
        setIsFlipped((prev) => !prev)
      } else if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "m" || e.key === "M") {
        handleMastered()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  const difficultyColor = {
    easy: "bg-green-500/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    hard: "bg-red-500/20 text-red-400",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Flashcards Practice</h1>
        <p className="text-gray-400">Review and master your concepts</p>
      </div>

      
      <div className="grid grid-cols-4 gap-4">
        <div className="dark-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-white">{flashcards.length}</div>
          <div className="text-sm text-gray-400">Total Cards</div>
        </div>
        <div className="dark-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">
            {flashcards.filter((c) => c.mastered).length}
          </div>
          <div className="text-sm text-gray-400">Mastered</div>
        </div>
        <div className="dark-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {flashcards.filter((c) => !c.mastered).length}
          </div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
        <div className="dark-card p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-400">{currentIndex + 1}</div>
          <div className="text-sm text-gray-400">Current</div>
        </div>
      </div>

      
      <div className="relative">
        <div className="dark-card-elevated p-8 rounded-xl min-h-[400px] flex flex-col">
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
                {currentCard.subject}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${difficultyColor[currentCard.difficulty]}`}>
                {currentCard.difficulty}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {currentIndex + 1} / {flashcards.length}
            </div>
          </div>

          
          <div
            className="flex-1 flex items-center justify-center text-center cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="space-y-4">
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                {isFlipped ? "Answer" : "Question"}
              </div>
              <div className="text-2xl font-semibold text-white px-8">
                {isFlipped ? currentCard.answer : currentCard.question}
              </div>
              <div className="text-sm text-gray-500 mt-4">
                {isFlipped ? "Click to see question" : "Click to reveal answer"}
              </div>
            </div>
          </div>

          
          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePrevious}
              className="flex-1 btn-3d-orange-secondary px-6 py-3 rounded-full font-medium"
            >
              ← Previous
            </button>
            <button
              onClick={handleMastered}
              className="btn-3d-orange px-6 py-3 rounded-full font-semibold"
            >
              ✓ Mastered
            </button>
            <button
              onClick={handleNext}
              className="flex-1 btn-3d-orange-secondary px-6 py-3 rounded-full font-medium"
            >
              Next →
            </button>
          </div>
        </div>

        
        <div className="absolute top-4 right-4 text-4xl animate-pulse">🔄</div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Session Progress</span>
          <span className="text-gray-400">
            {Math.round(((currentIndex + 1) / flashcards.length) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full gradient-neon-purple-pink transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-white font-semibold mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
          {flashcards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => {
                setCurrentIndex(index)
                setIsFlipped(false)
              }}
              className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                index === currentIndex
                  ? "btn-3d-orange text-white"
                  : card.mastered
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      
      <div className="dark-card p-4 rounded-xl">
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd>
            <span>Flip card</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
            <span>Previous</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
            <span>Next</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded">M</kbd>
            <span>Mark as mastered</span>
          </div>
        </div>
      </div>
    </div>
  )
}

