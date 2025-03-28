import { NextRequest, NextResponse } from 'next/server';
import { User } from './types';

export async function parseFormData(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return await request.json();
  } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const formDataObj = await request.formData();
    return Object.fromEntries(formDataObj.entries());
  }
  
  throw new Error('Unsupported content type');
}

export function isFormSubmission(contentType: string): boolean {
  return contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data');
}

export function createApiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function createApiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function redirectTo(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function checkFamilyAccess(user: User, familyId: number) {
  return user.familyMembers.some(member => member.family.id === familyId);
} 