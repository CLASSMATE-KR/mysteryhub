import { NextRequest, NextResponse } from 'next/server';
import { getCase, updateCase } from '@/lib/caseLoader';

export async function POST(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth');
  if (authCookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { caseId, hintId, action, revealAt } = await request.json();
  const caseData = getCase(caseId || 'case_001');
  
  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }
  
  const hints = caseData.hints.map(hint => {
    if (hint.id === hintId) {
      if (action === 'reveal') {
        return { ...hint, revealed: true, revealAt: revealAt || new Date().toISOString() };
      } else if (action === 'hide') {
        return { ...hint, revealed: false, revealAt: null };
      } else if (action === 'schedule' && revealAt) {
        return { ...hint, revealAt };
      }
    }
    return hint;
  });
  
  const updated = updateCase(caseId || 'case_001', { hints });
  
  return NextResponse.json(updated);
}

