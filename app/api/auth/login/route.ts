import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { comparePasswords, generateToken, setTokenCookie } from '@/lib/auth';

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Type for family member with family relation
interface FamilyMemberWithFamily {
  familyId: number;
  userId: number;
  isAdmin: boolean;
  family: {
    id: number;
    name: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data;
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        familyMembers: {
          include: {
            family: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check password
    const passwordMatch = await comparePasswords(password, user.passwordHash);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Create response
    const response = NextResponse.json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        families: user.familyMembers.map((member: FamilyMemberWithFamily) => ({
          id: member.family.id,
          name: member.family.name,
          isAdmin: member.isAdmin,
        })),
      },
    });
    
    // Set token cookie
    setTokenCookie(response, token);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 