import { NextResponse, NextRequest } from 'next/server';

const allowedOrigins = ['http://localhost:3000'];

export function corsHeaders(origin: string | null) {
  const originHeader = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleCORS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const headers = corsHeaders(origin);
  
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export function addCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

