import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import { getAuthToken, verifyToken } from "@/app/lib/auth";
import ScanResult from "@/app/models/ScanResult";
import { 
  encryptRTSPUrl, 
  decryptRTSPUrl, 
  validateRTSPUrl, 
  signRTSPUrl, 
  hashRTSPUrl 
} from "@/app/lib/encryption";
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query: any = { userId: decoded.userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const scanResults = await ScanResult.find(query).sort({ timestamp: -1 });
    
    const decryptedResults = scanResults.map(result => {
      try {
        const decrypted = decryptRTSPUrl(result.rtspUrl);
        return { 
          ...result.toObject(), 
          rtspUrl: decrypted 
        };
      } catch (error) {
        console.error('Decryption error for scan:', result.id, error);
        return { 
          ...result.toObject(), 
          rtspUrl: '[DECRYPTION_ERROR]' 
        };
      }
    });
    
    const response = NextResponse.json({ scanResults: decryptedResults }, { status: 200 });
    return addCorsHeaders(response, req);
  } catch (error: any) {
    console.error("Error fetching scan results:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to fetch scan results", details: error.message },
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
    const { id, rtspUrl, vulnerabilities, riskScore, status, timestamp, findings } = body;

    if (!id || !rtspUrl || riskScore === undefined || !status) {
      const errorResponse = NextResponse.json(
        { error: "Missing required fields: id, rtspUrl, riskScore, status" },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const validation = validateRTSPUrl(rtspUrl);
    if (!validation.valid) {
      const errorResponse = NextResponse.json(
        { error: `Invalid RTSP URL: ${validation.error}` },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const encryptedUrl = encryptRTSPUrl(rtspUrl);
    const urlHash = hashRTSPUrl(rtspUrl);
    const signature = signRTSPUrl(rtspUrl, decoded.userId);
    const urlTimestamp = Date.now();

    const scanResult = await ScanResult.create({
      userId: decoded.userId,
      id,
      rtspUrl: encryptedUrl,
      rtspUrlHash: urlHash,
      rtspUrlSignature: signature,
      rtspUrlTimestamp: urlTimestamp,
      vulnerabilities: vulnerabilities || [],
      riskScore,
      status,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      findings: findings || {
        weakPassword: false,
        openPorts: [],
        outdatedFirmware: false,
        unencryptedStream: false,
        defaultCredentials: false,
      },
    });

    const response = { 
      ...scanResult.toObject(), 
      rtspUrl: rtspUrl
    };

    const httpResponse = NextResponse.json({ scanResult: response }, { status: 201 });
    return addCorsHeaders(httpResponse, req);
  } catch (error: any) {
    console.error("Error creating scan result:", error);
    if (error.code === 11000) {
      const errorResponse = NextResponse.json(
        { error: "Scan result with this ID already exists" },
        { status: 409 }
      );
      return addCorsHeaders(errorResponse, req);
    }
    const errorResponse = NextResponse.json(
      { error: "Failed to create scan result", details: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}

