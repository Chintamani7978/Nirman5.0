import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { getAuthToken, verifyToken } from "@/app/lib/auth";
import Camera from "@/app/models/Camera";
import { corsHeaders, handleCORS, addCorsHeaders } from "@/app/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORS(req);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await dbConnect();
    
    const token = getAuthToken(req);
    if (!token) {
      const errorResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const errorResponse = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const camera = await Camera.findOne({ 
      userId: decoded.userId, 
      id: id 
    });

    if (!camera) {
      const errorResponse = NextResponse.json({ error: "Camera not found" }, { status: 404 });
      return addCorsHeaders(errorResponse, req);
    }

    const response = NextResponse.json({ camera }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error fetching camera:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to fetch camera", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await dbConnect();
    
    const token = getAuthToken(req);
    if (!token) {
      const errorResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const errorResponse = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const body = await req.json();
    
    const camera = await Camera.findOneAndUpdate(
      { userId: decoded.userId, id: id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!camera) {
      const errorResponse = NextResponse.json({ error: "Camera not found" }, { status: 404 });
      return addCorsHeaders(errorResponse, req);
    }

    const response = NextResponse.json({ camera }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error updating camera:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to update camera", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await dbConnect();
    
    const token = getAuthToken(req);
    if (!token) {
      const errorResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const errorResponse = NextResponse.json({ error: "Invalid token" }, { status: 401 });
      return addCorsHeaders(errorResponse, req);
    }

    const camera = await Camera.findOneAndDelete({ 
      userId: decoded.userId, 
      id: id 
    });

    if (!camera) {
      const errorResponse = NextResponse.json({ error: "Camera not found" }, { status: 404 });
      return addCorsHeaders(errorResponse, req);
    }

    const response = NextResponse.json({ message: "Camera deleted successfully" }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error deleting camera:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to delete camera", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

