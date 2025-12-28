import { NextRequest, NextResponse } from 'next/server';
import { getCase, updateCase, getCurrentCase, Case, CaseState } from '@/lib/caseLoader';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth');
  if (authCookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const caseId = request.nextUrl.searchParams.get('id') || 'case_001';
  const caseData = getCase(caseId);
  
  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }
  
  return NextResponse.json(caseData);
}

export async function POST(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth');
  if (authCookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const updates = await request.json();
  const caseId = updates.id || 'case_001';
  
  const updated = updateCase(caseId, updates);
  
  if (!updated) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }
  
  return NextResponse.json(updated);
}

