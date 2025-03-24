import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateToken, hashPassword, setTokenCookie } from '@/lib/auth';

// Validation schema for registration
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { username, email, password } = validation.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this username or email already exists' },
        { status: 409 }
      );
    }
    
    // Hash the password
    const passwordHash = await hashPassword(password);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Create response
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
    
    // Set token cookie
    setTokenCookie(response, token);
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 