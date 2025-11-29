"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is PadhAI and who is it for?",
    answer:
      "PadhAI is an AI-powered edutech platform that transforms PDFs and prompts into summaries, flashcards, quizzes, and interactive lessons. It's perfect for students, teachers, parents, and institutions looking to make learning faster and more effective.",
  },
  {
    question: "How does PDF to learning materials work?",
    answer:
      "Simply upload any PDF document, and our AI instantly analyzes and generates summaries, flashcards, quizzes, and explanations. You can also use text-to-speech to listen to any content, making learning accessible and flexible.",
  },
  {
    question: "What is Kid Mode and how does it work?",
    answer:
      "Kid Mode is a gamified learning experience with interactive mini-games, avatars, rewards, and safe content moderation. It makes learning fun and engaging for young learners while keeping content age-appropriate and secure.",
  },
  {
    question: "Can teachers and parents track student progress?",
    answer:
      "Yes! We provide smart dashboards for teachers and parents to track learning progress, create custom assignments, monitor quiz scores, and see detailed analytics on student performance.",
  },
  {
    question: "Does PadhAI recommend YouTube videos?",
    answer:
      "Absolutely! Our AI recommends relevant educational YouTube videos based on the topics you're studying, saving you time searching and ensuring you get high-quality content aligned with your learning goals.",
  },
  {
    question: "Is PadhAI available in multiple languages?",
    answer:
      "Yes! PadhAI supports multilingual content and can generate learning materials in multiple languages, making it accessible to learners worldwide.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-white font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            <span className="text-gradient-neon">Frequently</span> Asked Questions
          </div>
          <div className="w-full text-gray-400 text-base font-normal leading-7 font-sans">
            Get answers about AI-powered learning,
            <br className="hidden md:block" />
            pricing, and how to get started.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-white/5 transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-white text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-gray-400 text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
