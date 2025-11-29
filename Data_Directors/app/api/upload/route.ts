import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const prompt = formData.get("prompt") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(
      {
        success: true,
        document: {
          id: documentId,
          title: file.name.replace(".pdf", ""),
          uploadedAt: new Date().toISOString(),
          size: file.size,
          status: "processing",
          prompt: prompt || null,
        },
        message: "PDF uploaded successfully. Processing will begin shortly.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload PDF. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get("documentId")

  if (!documentId) {
    return NextResponse.json(
      { error: "Document ID is required" },
      { status: 400 }
    )
  }

  return NextResponse.json({
    documentId,
    status: "completed",
    progress: 100,
    extractedText: true,
    generatedContent: {
      summary: true,
      flashcards: true,
      quiz: true,
    },
  })
}

