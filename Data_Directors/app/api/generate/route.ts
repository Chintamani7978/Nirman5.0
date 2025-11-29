import { NextRequest, NextResponse } from "next/server"

interface GenerateRequest {
  documentId: string
  contentType: "summary" | "flashcards" | "quiz" | "all"
  difficulty?: "easy" | "medium" | "hard"
  language?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { documentId, contentType, difficulty = "medium", language = "en" } = body

    if (!documentId || !contentType) {
      return NextResponse.json(
        { error: "Document ID and content type are required" },
        { status: 400 }
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockSummary = {
      type: "summary",
      content: "This document covers fundamental concepts in physics, including Newton's laws of motion, energy conservation, and basic kinematics. The key topics include force, acceleration, velocity, and momentum, with practical examples demonstrating real-world applications.",
      keyPoints: [
        "Newton's First Law: Objects remain at rest or in uniform motion unless acted upon by force",
        "Newton's Second Law: F = ma (Force equals mass times acceleration)",
        "Newton's Third Law: For every action, there is an equal and opposite reaction",
        "Energy is conserved in closed systems",
        "Momentum is the product of mass and velocity",
      ],
      readingTime: 3, // minutes
    }

    const mockFlashcards = {
      type: "flashcards",
      cards: [
        {
          id: "fc_1",
          front: "What is Newton's First Law of Motion?",
          back: "An object at rest stays at rest and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.",
          difficulty: "easy",
        },
        {
          id: "fc_2",
          front: "Define acceleration",
          back: "Acceleration is the rate of change of velocity with respect to time. It is measured in m/s².",
          difficulty: "medium",
        },
        {
          id: "fc_3",
          front: "What is the formula for momentum?",
          back: "Momentum (p) = mass (m) × velocity (v). It is a vector quantity measured in kg⋅m/s.",
          difficulty: "medium",
        },
        {
          id: "fc_4",
          front: "State the Law of Conservation of Energy",
          back: "Energy cannot be created or destroyed, only transformed from one form to another. The total energy in a closed system remains constant.",
          difficulty: "hard",
        },
      ],
      totalCards: 4,
    }

    const mockQuiz = {
      type: "quiz",
      title: "Physics Fundamentals Quiz",
      difficulty,
      timeLimit: 600, // seconds
      questions: [
        {
          id: "q_1",
          question: "Which of the following best describes Newton's Second Law?",
          options: [
            "Force equals mass times acceleration",
            "Every action has an equal and opposite reaction",
            "Objects in motion stay in motion",
            "Energy cannot be created or destroyed",
          ],
          correctAnswer: 0,
          explanation: "Newton's Second Law states that F = ma, meaning force is directly proportional to mass and acceleration.",
          difficulty: "easy",
        },
        {
          id: "q_2",
          question: "A 5 kg object accelerates at 2 m/s². What is the net force acting on it?",
          options: ["5 N", "7 N", "10 N", "2.5 N"],
          correctAnswer: 2,
          explanation: "Using F = ma, we get F = 5 kg × 2 m/s² = 10 N",
          difficulty: "medium",
        },
        {
          id: "q_3",
          question: "What happens to the kinetic energy of an object if its velocity is doubled?",
          options: [
            "It doubles",
            "It triples",
            "It quadruples",
            "It remains the same",
          ],
          correctAnswer: 2,
          explanation: "Kinetic energy is proportional to velocity squared (KE = ½mv²). If velocity doubles, KE increases by a factor of 4.",
          difficulty: "hard",
        },
        {
          id: "q_4",
          question: "Which quantity is NOT a vector?",
          options: ["Velocity", "Acceleration", "Speed", "Force"],
          correctAnswer: 2,
          explanation: "Speed is a scalar quantity (magnitude only), while velocity, acceleration, and force are vectors (magnitude and direction).",
          difficulty: "easy",
        },
        {
          id: "q_5",
          question: "In an elastic collision, what is conserved?",
          options: [
            "Only momentum",
            "Only kinetic energy",
            "Both momentum and kinetic energy",
            "Neither momentum nor kinetic energy",
          ],
          correctAnswer: 2,
          explanation: "In an elastic collision, both momentum and kinetic energy are conserved.",
          difficulty: "medium",
        },
      ],
      totalQuestions: 5,
      passingScore: 60,
    }

    let response: any = { success: true, documentId }

    if (contentType === "summary" || contentType === "all") {
      response.summary = mockSummary
    }
    if (contentType === "flashcards" || contentType === "all") {
      response.flashcards = mockFlashcards
    }
    if (contentType === "quiz" || contentType === "all") {
      response.quiz = mockQuiz
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get("documentId")
  const contentType = searchParams.get("type")

  if (!documentId) {
    return NextResponse.json(
      { error: "Document ID is required" },
      { status: 400 }
    )
  }

  return NextResponse.json({
    documentId,
    availableContent: ["summary", "flashcards", "quiz"],
    message: "Use POST to generate new content",
  })
}

