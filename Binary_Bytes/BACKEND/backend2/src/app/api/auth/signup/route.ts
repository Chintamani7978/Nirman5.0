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
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      const errorResponse = NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    if (password.length < 6) {
      const errorResponse = NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorResponse = NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const errorResponse = NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse, req);
    }


    const user = await User.create({ name, email, password });


    const token = generateToken(user._id.toString());


    const response = NextResponse.json(
      { user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );

    setAuthToken(response, token);
    return addCorsHeaders(response, req);
  } catch (error) {
    console.error('Signup error:', error);
    const errorResponse = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, req);
  }
}
