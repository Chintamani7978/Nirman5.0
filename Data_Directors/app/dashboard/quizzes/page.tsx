"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

export default function QuizzesPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)

  const quizzes = [
    {
      id: "1",
      title: "Physics - Newton's Laws",
      questions: 10,
      duration: "10 min",
      difficulty: "medium",
      subject: "Physics",
      icon: "📘",
    },
    {
      id: "2",
      title: "Chemistry - Organic Compounds",
      questions: 15,
      duration: "15 min",
      difficulty: "hard",
      subject: "Chemistry",
      icon: "🧪",
    },
    {
      id: "3",
      title: "Math - Calculus Basics",
      questions: 12,
      duration: "12 min",
      difficulty: "medium",
      subject: "Mathematics",
      icon: "📐",
    },
  ]

  const quizQuestions = [
    {
      id: "1",
      question: "What is Newton's First Law of Motion also known as?",
      options: ["Law of Inertia", "Law of Acceleration", "Law of Action-Reaction", "Law of Gravity"],
      correctAnswer: 0,
      explanation: "Newton's First Law is commonly called the Law of Inertia.",
    },
    {
      id: "2",
      question: "Which formula represents Newton's Second Law?",
      options: ["F = ma", "E = mc²", "v = d/t", "PV = nRT"],
      correctAnswer: 0,
      explanation: "F = ma (Force equals mass times acceleration) is Newton's Second Law.",
    },
    {
      id: "3",
      question: "What does Newton's Third Law state?",
      options: [
        "Force equals mass times acceleration",
        "For every action, there is an equal and opposite reaction",
        "Objects in motion stay in motion",
        "Energy cannot be created or destroyed",
      ],
      correctAnswer: 1,
      explanation: "Newton's Third Law states that for every action, there is an equal and opposite reaction.",
    },
  ]

  const handleSubmit = () => {
    let correctCount = 0
    quizQuestions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++
      }
    })
    setScore(Math.round((correctCount / quizQuestions.length) * 100))
    setIsComplete(true)
  }

  useEffect(() => {
    if (selectedQuiz && !isComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [selectedQuiz, isComplete, timeLeft, handleSubmit])

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!selectedQuiz) {
    return (
      <div className="space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quizzes</h1>
          <p className="text-gray-400">Test your knowledge with AI-generated quizzes</p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="dark-card p-6 rounded-xl border border-white/10 hover:neon-border transition-all"
            >
              <div className="text-5xl mb-4">{quiz.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{quiz.title}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>❓</span>
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>⏱️</span>
                  <span>{quiz.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                    {quiz.subject}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                    {quiz.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuiz(quiz.id)}
                className="w-full btn-3d-orange px-6 py-3 rounded-full font-semibold"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="dark-card-elevated p-12 rounded-xl text-center">
          <div className="text-6xl mb-6">{score >= 80 ? "🎉" : score >= 60 ? "👍" : "📚"}</div>
          <h2 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h2>
          <div className="text-6xl font-bold text-gradient-neon my-6">{score}%</div>
          <p className="text-gray-400 mb-8">
            You got {Math.round((score / 100) * quizQuestions.length)} out of {quizQuestions.length} questions correct
          </p>

          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="dark-card p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{Math.round((score / 100) * quizQuestions.length)}</div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="dark-card p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-400">
                {quizQuestions.length - Math.round((score / 100) * quizQuestions.length)}
              </div>
              <div className="text-sm text-gray-400">Incorrect</div>
            </div>
            <div className="dark-card p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{formatTime(600 - timeLeft)}</div>
              <div className="text-sm text-gray-400">Time</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectedQuiz(null)
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setTimeLeft(600)
                setIsComplete(false)
              }}
              className="flex-1 btn-3d-orange-secondary px-6 py-3 rounded-full font-medium"
            >
              Back to Quizzes
            </button>
            <Link href="/dashboard/flashcards" className="flex-1 btn-3d-orange px-6 py-3 rounded-full font-semibold text-center">
              Practice Flashcards
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Physics - Newton's Laws</h1>
          <p className="text-gray-400">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="dark-card px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-400">Time Left</div>
            <div className={`text-xl font-bold ${timeLeft < 60 ? "text-red-400" : "text-white"}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      
      <div className="dark-card p-4 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-medium">Progress</span>
          <span className="text-gray-400">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full gradient-neon-purple-pink transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      
      <div className="dark-card-elevated p-8 rounded-xl">
        <h3 className="text-2xl font-semibold text-white mb-8">{currentQ.question}</h3>

        
        <div className="space-y-4">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  isSelected
                    ? "btn-3d-orange text-white"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-white bg-white" : "border-gray-400"
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#ff9500]" />}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-3d-orange-secondary px-6 py-3 rounded-full font-medium disabled:opacity-50"
        >
          ← Previous
        </button>
        <div className="flex-1" />
        {currentQuestion < quizQuestions.length - 1 ? (
          <button onClick={handleNext} className="btn-3d-orange px-6 py-3 rounded-full font-semibold">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-3d-orange px-8 py-3 rounded-full font-semibold">
            Submit Quiz
          </button>
        )}
      </div>

      
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-white font-semibold mb-4">Question Navigator</h3>
        <div className="grid grid-cols-10 gap-2">
          {quizQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                index === currentQuestion
                  ? "btn-3d-orange text-white"
                  : selectedAnswers[index] !== undefined
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

