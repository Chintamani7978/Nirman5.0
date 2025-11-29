import { NextRequest, NextResponse } from "next/server"

interface YouTubeRecommendation {
  videoId: string
  title: string
  channelName: string
  thumbnail: string
  duration: string
  views: string
  uploadDate: string
  description: string
  url: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")
    const limit = parseInt(searchParams.get("limit") || "5")

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockRecommendations: Record<string, YouTubeRecommendation[]> = {
      physics: [
        {
          videoId: "kKKM8Y-u7ds",
          title: "Newton's Three Laws of Motion Explained",
          channelName: "Khan Academy",
          thumbnail: "https://i.ytimg.com/vi/kKKM8Y-u7ds/mqdefault.jpg",
          duration: "12:45",
          views: "2.5M",
          uploadDate: "2 years ago",
          description: "A comprehensive explanation of Newton's laws with real-world examples",
          url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
        },
        {
          videoId: "ZM8ECpBuQYE",
          title: "Introduction to Forces and Newton's Laws",
          channelName: "Crash Course Physics",
          thumbnail: "https://i.ytimg.com/vi/ZM8ECpBuQYE/mqdefault.jpg",
          duration: "10:30",
          views: "1.8M",
          uploadDate: "1 year ago",
          description: "Fun and engaging introduction to the fundamentals of physics",
          url: "https://www.youtube.com/watch?v=ZM8ECpBuQYE",
        },
        {
          videoId: "jjfFfMxGQxU",
          title: "Newton's Laws: Simple Machines",
          channelName: "The Science Classroom",
          thumbnail: "https://i.ytimg.com/vi/jjfFfMxGQxU/mqdefault.jpg",
          duration: "15:20",
          views: "850K",
          uploadDate: "6 months ago",
          description: "How Newton's laws apply to simple machines and everyday objects",
          url: "https://www.youtube.com/watch?v=jjfFfMxGQxU",
        },
        {
          videoId: "1-QpnRLcVYo",
          title: "Physics Problems: Forces and Motion",
          channelName: "Professor Dave Explains",
          thumbnail: "https://i.ytimg.com/vi/1-QpnRLcVYo/mqdefault.jpg",
          duration: "18:15",
          views: "650K",
          uploadDate: "8 months ago",
          description: "Step-by-step solutions to common physics problems",
          url: "https://www.youtube.com/watch?v=1-QpnRLcVYo",
        },
        {
          videoId: "b1t41DNBExo",
          title: "Conservation of Energy Explained",
          channelName: "Veritasium",
          thumbnail: "https://i.ytimg.com/vi/b1t41DNBExo/mqdefault.jpg",
          duration: "14:50",
          views: "3.2M",
          uploadDate: "1 year ago",
          description: "Mind-blowing demonstrations of energy conservation principles",
          url: "https://www.youtube.com/watch?v=b1t41DNBExo",
        },
      ],
      chemistry: [
        {
          videoId: "dPaLTTuhpGw",
          title: "Organic Chemistry: Introduction",
          channelName: "Khan Academy",
          thumbnail: "https://i.ytimg.com/vi/dPaLTTuhpGw/mqdefault.jpg",
          duration: "11:20",
          views: "1.9M",
          uploadDate: "2 years ago",
          description: "Fundamentals of organic chemistry and carbon compounds",
          url: "https://www.youtube.com/watch?v=dPaLTTuhpGw",
        },
        {
          videoId: "IFAemRo-bwI",
          title: "Chemical Reactions & Equations",
          channelName: "Crash Course Chemistry",
          thumbnail: "https://i.ytimg.com/vi/IFAemRo-bwI/mqdefault.jpg",
          duration: "13:45",
          views: "2.1M",
          uploadDate: "1 year ago",
          description: "Understanding chemical reactions and how to balance equations",
          url: "https://www.youtube.com/watch?v=IFAemRo-bwI",
        },
      ],
      mathematics: [
        {
          videoId: "WUvTyaaNkzM",
          title: "Calculus: Derivatives Explained",
          channelName: "3Blue1Brown",
          thumbnail: "https://i.ytimg.com/vi/WUvTyaaNkzM/mqdefault.jpg",
          duration: "16:40",
          views: "4.5M",
          uploadDate: "2 years ago",
          description: "Visual and intuitive explanation of derivatives in calculus",
          url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
        },
        {
          videoId: "H9eCT6f_ZBU",
          title: "Algebra Basics: Solving Equations",
          channelName: "Khan Academy",
          thumbnail: "https://i.ytimg.com/vi/H9eCT6f_ZBU/mqdefault.jpg",
          duration: "9:30",
          views: "2.8M",
          uploadDate: "3 years ago",
          description: "Step-by-step guide to solving algebraic equations",
          url: "https://www.youtube.com/watch?v=H9eCT6f_ZBU",
        },
      ],
    }

    const topicLower = topic.toLowerCase()
    let recommendations: YouTubeRecommendation[] = []

    for (const [key, videos] of Object.entries(mockRecommendations)) {
      if (topicLower.includes(key) || key.includes(topicLower)) {
        recommendations = videos
        break
      }
    }

    if (recommendations.length === 0) {
      recommendations = [
        {
          videoId: "default_001",
          title: `Educational Videos on ${topic}`,
          channelName: "Khan Academy",
          thumbnail: "https://i.ytimg.com/vi/default/mqdefault.jpg",
          duration: "10:00",
          views: "1M",
          uploadDate: "1 year ago",
          description: `Comprehensive learning resources about ${topic}`,
          url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(topic),
        },
      ]
    }

    const limitedRecommendations = recommendations.slice(0, limit)

    return NextResponse.json({
      success: true,
      topic,
      totalResults: limitedRecommendations.length,
      recommendations: limitedRecommendations,
    })
  } catch (error) {
    console.error("YouTube recommendations error:", error)
    return NextResponse.json(
      { error: "Failed to fetch video recommendations. Please try again." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, videoId, watchTime } = body

    if (!userId || !videoId) {
      return NextResponse.json(
        { error: "User ID and Video ID are required" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Watch history saved successfully",
      watchHistory: {
        userId,
        videoId,
        watchTime,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Save watch history error:", error)
    return NextResponse.json(
      { error: "Failed to save watch history" },
      { status: 500 }
    )
  }
}

