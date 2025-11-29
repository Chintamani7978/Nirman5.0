import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { getAuthToken, verifyToken } from "@/app/lib/auth";
import Camera from "@/app/models/Camera";
import { corsHeaders, handleCORS, addCorsHeaders } from "@/app/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORS(req);
}

export async function GET(req: NextRequest) {
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

    const cameras = await Camera.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    
    const response = NextResponse.json({ cameras }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error fetching cameras:", error);
    const errorMessage = error?.message || "Unknown error";
    const errorStack = error?.stack || "";
    const errorResponse = NextResponse.json(
      { 
        error: "Failed to fetch cameras", 
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

export async function POST(req: NextRequest) {
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
    const { id, name, ip, status, risk, securityChecks } = body;

    if (!id || !name || !ip) {
      const errorResponse = NextResponse.json(
        { error: "Missing required fields: id, name, ip" },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const camera = await Camera.create({
      userId: decoded.userId,
      id,
      name,
      ip,
      status: status || 'vulnerable',
      risk: risk || 'medium',
      securityChecks: securityChecks || {
        strongPassword: false,
        encryption: false,
        authentication: false,
        firewall: false,
        firmware: false,
      },
    });

    const response = NextResponse.json({ camera }, { status: 201 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error creating camera:", error);
    if (error.code === 11000) {
      const errorResponse = NextResponse.json(
        { error: "Camera with this ID already exists" },
        { status: 409 }
      );
      return addCorsHeaders(errorResponse, req);
    }
    const errorMessage = error?.message || "Unknown error";
    const errorStack = error?.stack || "";
    const errorResponse = NextResponse.json(
      { 
        error: "Failed to create camera", 
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

