"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually")

  const pricing = {
    starter: {
      monthly: 0,
      annually: 0,
    },
    professional: {
      monthly: 9.99,
      annually: 7.99, // 20% discount for annual
    },
    enterprise: {
      monthly: 49.99,
      annually: 39.99, // 20% discount for annual
    },
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-white/10 flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
          {/* Pricing Badge */}
          <div className="px-[14px] py-[6px] dark-card neon-border overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px]">
            <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 1V11M8.5 3H4.75C4.28587 3 3.84075 3.18437 3.51256 3.51256C3.18437 3.84075 3 4.28587 3 4.75C3 5.21413 3.18437 5.65925 3.51256 5.98744C3.84075 6.31563 4.28587 6.5 4.75 6.5H7.25C7.71413 6.5 8.15925 6.68437 8.48744 7.01256C8.81563 7.34075 9 7.78587 9 8.25C9 8.71413 8.81563 9.15925 8.48744 9.48744C8.15925 9.81563 7.71413 10 7.25 10H3.5"
                  stroke="#a855f7"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-center flex justify-center flex-col text-gray-300 text-xs font-medium leading-3 font-sans">
              Plans & Pricing
            </div>
          </div>

          {/* Title */}
          <div className="self-stretch text-center flex justify-center flex-col text-white text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Choose the <span className="text-gradient-neon">perfect plan</span> for your learning
          </div>

          {/* Description */}
          <div className="self-stretch text-center text-gray-400 text-base font-normal leading-7 font-sans">
            Scale your learning with flexible pricing that grows with your needs.
            <br />
            Start free, upgrade when you're ready.
          </div>
        </div>
      </div>

      {/* Billing Toggle Section */}
      <div className="self-stretch px-6 md:px-16 py-9 relative flex justify-center items-center gap-4">
        {/* Horizontal line */}
        <div className="w-full max-w-[1060px] h-0 absolute left-1/2 transform -translate-x-1/2 top-[63px] border-t border-white/10 z-0"></div>

        {/* Toggle Container */}
        <div className="p-3 relative dark-card backdrop-blur-xl flex justify-center items-center rounded-lg z-20">
          <div className="p-[2px] bg-white/10 rounded-[99px] border-[0.5px] border-white/20 flex justify-center items-center gap-[2px] relative">
            <div
              className={`absolute top-[2px] w-[calc(50%-1px)] h-[calc(100%-4px)] gradient-neon-purple-pink neon-glow-purple rounded-[99px] transition-all duration-300 ease-in-out ${
                billingPeriod === "annually" ? "left-[2px]" : "right-[2px]"
              }`}
            />

            <button
              onClick={() => setBillingPeriod("annually")}
              className="px-4 py-1 rounded-[99px] flex justify-center items-center gap-2 transition-colors duration-300 relative z-10 flex-1"
            >
              <div
                className={`text-[13px] font-medium leading-5 font-sans transition-colors duration-300 ${
                  billingPeriod === "annually" ? "text-white" : "text-gray-400"
                }`}
              >
                Annually
              </div>
            </button>

            <button
              onClick={() => setBillingPeriod("monthly")}
              className="px-4 py-1 rounded-[99px] flex justify-center items-center gap-2 transition-colors duration-300 relative z-10 flex-1"
            >
              <div
                className={`text-[13px] font-medium leading-5 font-sans transition-colors duration-300 ${
                  billingPeriod === "monthly" ? "text-white" : "text-gray-400"
                }`}
              >
                Monthly
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="self-stretch border-b border-t border-white/10 flex justify-center items-center">
        <div className="flex justify-center items-start w-full">
          {/* Left Decorative Pattern */}
          <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                ></div>
              ))}
            </div>
          </div>

          {/* Pricing Cards Container */}
          <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-6 py-12 md:py-0">
            {/* Starter Plan */}
            <div className="flex-1 max-w-full md:max-w-none self-stretch px-6 py-5 dark-card border border-white/10 overflow-hidden flex flex-col justify-start items-start gap-12">
              {/* Plan Header */}
              <div className="self-stretch flex flex-col justify-start items-center gap-9">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-lg font-medium leading-7 font-sans">Student</div>
                  <div className="w-full max-w-[242px] text-gray-400 text-sm font-normal leading-5 font-sans">
                    Perfect for individual students exploring AI-powered learning.
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="relative h-[60px] flex items-center text-white text-5xl font-medium leading-[60px] font-serif">
                      <span className="invisible">${pricing.starter[billingPeriod]}</span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "annually" ? 1 : 0,
                          transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
                        }}
                        aria-hidden={billingPeriod !== "annually"}
                      >
                        ${pricing.starter.annually}
                      </span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "monthly" ? 1 : 0,
                          transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
                        }}
                        aria-hidden={billingPeriod !== "monthly"}
                      >
                        ${pricing.starter.monthly}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium font-sans">
                      per {billingPeriod === "monthly" ? "month" : "year"}, per user.
                    </div>
                  </div>
                </div>

                <Button className="self-stretch rounded-full px-4 py-[10px]">
                  <span className="max-w-[108px] text-white text-[13px] font-semibold leading-5 font-sans">Start for free</span>
                </Button>
              </div>

              <div className="self-stretch flex flex-col justify-start items-start gap-2">
              {[
                  "5 PDF uploads per month",
                  "Basic flashcards & quizzes",
                  "Text-to-speech read-aloud",
                  "YouTube video suggestions",
                  "Community support",
                ].map((feature, index) => (
                  <div key={index} className="self-stretch flex justify-start items-center gap-[13px]">
                    <div className="w-4 h-4 relative flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#6b7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-gray-400 text-[12.5px] font-normal leading-5 font-sans">
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Plan (Featured) */}
            <div className="flex-1 max-w-full md:max-w-none self-stretch px-6 py-5 dark-card-elevated neon-border neon-glow-purple overflow-hidden flex flex-col justify-start items-start gap-12">
              {/* Plan Header */}
              <div className="self-stretch flex flex-col justify-start items-center gap-9">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-lg font-medium leading-7 font-sans flex items-center gap-2">
                    Teacher <span className="text-xs px-2 py-1 rounded-full border border-white/20">Popular</span>
                  </div>
                  <div className="w-full max-w-[242px] text-gray-300 text-sm font-normal leading-5 font-sans">
                    For educators managing classrooms and tracking student progress.
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="relative h-[60px] flex items-center text-white text-5xl font-medium leading-[60px] font-serif">
                      <span className="invisible">${pricing.professional[billingPeriod]}</span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "annually" ? 1 : 0,
                          transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
                        }}
                        aria-hidden={billingPeriod !== "annually"}
                      >
                        ${pricing.professional.annually}
                      </span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "monthly" ? 1 : 0,
                          transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
                        }}
                        aria-hidden={billingPeriod !== "monthly"}
                      >
                        ${pricing.professional.monthly}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm font-medium font-sans">
                      per {billingPeriod === "monthly" ? "month" : "year"}, per user.
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="self-stretch rounded-full px-4 py-[10px]">
                  <span className="max-w-[108px] text-white text-[13px] font-semibold leading-5 font-sans">Get started</span>
                </Button>
              </div>

              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                {[
                  "Unlimited PDF uploads",
                  "Advanced quizzes & flashcards",
                  "Kid Mode with gamification",
                  "Parent/Teacher dashboards",
                  "Progress tracking & analytics",
                  "Create custom assignments",
                  "Priority support",
                  "Multilingual support",
                ].map((feature, index) => (
                  <div key={index} className="self-stretch flex justify-start items-center gap-[13px]">
                    <div className="w-4 h-4 relative flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#ec4899"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-gray-300 text-[12.5px] font-normal leading-5 font-sans">{feature}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex-1 max-w-full md:max-w-none self-stretch px-6 py-5 dark-card border border-white/10 overflow-hidden flex flex-col justify-start items-start gap-12">
              {/* Plan Header */}
              <div className="self-stretch flex flex-col justify-start items-center gap-9">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-lg font-medium leading-7 font-sans">School/Institution</div>
                  <div className="w-full max-w-[242px] text-gray-400 text-sm font-normal leading-5 font-sans">
                    Complete solution for schools, universities, and large institutions.
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="relative h-[60px] flex items-center text-white text-5xl font-medium leading-[60px] font-serif">
                      <span className="invisible">${pricing.enterprise[billingPeriod]}</span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "annually" ? 1 : 0,
                          transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
                        }}
                        aria-hidden={billingPeriod !== "annually"}
                      >
                        ${pricing.enterprise.annually}
                      </span>
                      <span
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "monthly" ? 1 : 0,
                          transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
                        }}
                        aria-hidden={billingPeriod !== "monthly"}
                      >
                        ${pricing.enterprise.monthly}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm font-medium font-sans">
                      per {billingPeriod === "monthly" ? "month" : "year"}, per user.
                    </div>
                  </div>
                </div>

                <Button className="self-stretch rounded-full px-4 py-[10px]">
                  <span className="max-w-[108px] text-white text-[13px] font-semibold leading-5 font-sans">Contact sales</span>
                </Button>
              </div>

              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                {[
                  "Everything in Teacher plan",
                  "Unlimited students & teachers",
                  "Admin dashboard & controls",
                  "Bulk content upload",
                  "Custom gamified modules",
                  "Advanced analytics & reports",
                  "Dedicated account manager",
                  "Custom onboarding & training",
                ].map((feature, index) => (
                  <div key={index} className="self-stretch flex justify-start items-center gap-[13px]">
                    <div className="w-4 h-4 relative flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#6b7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-gray-400 text-[12.5px] font-normal leading-5 font-sans">
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Decorative Pattern */}
          <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
