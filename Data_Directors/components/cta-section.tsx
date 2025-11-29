"use client"

import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      {/* Content */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 border-t border-b border-white/10 flex justify-center items-center gap-6 relative z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-white/5 outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[586px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center flex justify-center flex-col text-white text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Start learning <span className="text-gradient-neon">smarter</span> today
            </div>
            <div className="self-stretch text-center text-gray-400 text-base leading-7 font-sans font-medium">
              Transform any PDF into interactive lessons in seconds.
              <br />
              Join 10,000+ students, teachers, and parents using PadhAI.
            </div>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-12">
            <div className="flex justify-start items-center gap-4">
              <Button className="h-12 px-14 rounded-full">
                <span className="text-white text-[15px] font-semibold leading-5 font-sans">🚀 Try PadhAI Free</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
