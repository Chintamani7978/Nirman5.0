import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { getAuthToken, verifyToken } from "@/app/lib/auth";
import Threat from "@/app/models/Threat";
import { corsHeaders, handleCORS, addCorsHeaders } from "@/app/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORS(req);
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
    
    const threat = await Threat.findOneAndUpdate(
      { userId: decoded.userId, id: id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!threat) {
      const errorResponse = NextResponse.json({ error: "Threat not found" }, { status: 404 });
      return addCorsHeaders(errorResponse, req);
    }

    const response = NextResponse.json({ threat }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error updating threat:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to update threat", details: error.message },
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

    const threat = await Threat.findOneAndDelete({ 
      userId: decoded.userId, 
      id: id 
    });

    if (!threat) {
      const errorResponse = NextResponse.json({ error: "Threat not found" }, { status: 404 });
      return addCorsHeaders(errorResponse, req);
    }

    const response = NextResponse.json({ message: "Threat deleted successfully" }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error deleting threat:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to delete threat", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

