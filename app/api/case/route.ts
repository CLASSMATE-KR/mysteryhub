import { NextRequest, NextResponse } from 'next/server';
import { getCase } from '@/lib/caseLoader';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const caseId = searchParams.get('id') || '001';
  
  const caseData = getCase(`case_${caseId}`);
  
  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }
  
  return NextResponse.json(caseData);
}

