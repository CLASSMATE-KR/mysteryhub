import { NextResponse } from 'next/server';
import { getCurrentCase } from '@/lib/caseLoader';

export async function GET() {
  const caseData = getCurrentCase();
  return NextResponse.json(caseData);
}

