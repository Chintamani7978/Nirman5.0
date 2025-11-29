import { NextResponse, NextRequest } from 'next/server';
import { dbConnect } from '@/app/lib/db';
import User from '@/app/models/User';
import { generateToken, setAuthToken } from '@/app/lib/auth';
import { corsHeaders, handleCORS, addCorsHeaders } from '@/app/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleCORS(req);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      const errorResponse = NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      const errorResponse = NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const errorResponse = NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const token = generateToken(user._id.toString());

    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    setAuthToken(response, token);
    return addCorsHeaders(response, req);
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}
