// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// Document Types
export interface Document {
  id: string
  userId: string
  title: string
  originalFileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: 'processing' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
}

// AI Generated Content Types
export interface Summary {
  id: string
  documentId: string
  content: string
  type: 'brief' | 'detailed'
  createdAt: Date
}

export interface Flashcard {
  id: string
  documentId: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  createdAt: Date
}

export interface Quiz {
  id: string
  documentId: string
  title: string
  questions: QuizQuestion[]
  totalQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit?: number
  createdAt: Date
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  score: number
  totalQuestions: number
  answers: UserAnswer[]
  timeSpent: number
  completedAt: Date
}

export interface UserAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
}

// YouTube Recommendation Types
export interface VideoRecommendation {
  id: string
  videoId: string
  title: string
  channelName: string
  thumbnail: string
  duration: string
  viewCount: number
  relevanceScore: number
}

// Kid Mode Types
export interface KidProfile {
  id: string
  userId: string
  avatarId: string
  level: number
  totalPoints: number
  badges: Badge[]
  streakDays: number
  lastActiveDate: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
}

export interface GameSession {
  id: string
  kidProfileId: string
  gameType: 'flashcard-match' | 'quiz-race' | 'word-puzzle'
  score: number
  pointsEarned: number
  duration: number
  completedAt: Date
}

// Dashboard Types
export interface StudentProgress {
  userId: string
  totalDocuments: number
  totalQuizzes: number
  averageScore: number
  totalStudyTime: number
  currentStreak: number
  lastActive: Date
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: 'upload' | 'quiz' | 'flashcard' | 'game'
  description: string
  timestamp: Date
  points?: number
}

export interface Assignment {
  id: string
  teacherId: string
  title: string
  description: string
  dueDate: Date
  attachedDocumentIds: string[]
  assignedStudents: string[]
  status: 'draft' | 'published' | 'closed'
  createdAt: Date
}

// Analytics Types
export interface ClassroomAnalytics {
  totalStudents: number
  averageScore: number
  completionRate: number
  topPerformers: StudentPerformance[]
  strugglingStudents: StudentPerformance[]
  topicMastery: TopicMastery[]
}

export interface StudentPerformance {
  userId: string
  name: string
  averageScore: number
  quizzesCompleted: number
  lastActive: Date
}

export interface TopicMastery {
  topic: string
  averageScore: number
  totalAttempts: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PDFProcessingResponse {
  documentId: string
  summary: string
  flashcards: Flashcard[]
  quiz: Quiz
  videoRecommendations: VideoRecommendation[]
}

// Chat/Q&A Types
export interface ChatMessage {
  id: string
  documentId: string
  userId: string
  question: string
  answer: string
  timestamp: Date
}
