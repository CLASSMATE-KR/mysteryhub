import { NextRequest, NextResponse } from 'next/server';
import { getVoteCounts, getVotesByCase } from '@/lib/voteStorage';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const caseId = searchParams.get('caseId');

  if (!caseId) {
    return NextResponse.json({ error: 'Missing caseId' }, { status: 400 });
  }

  const votes = getVotesByCase(caseId);
  const counts = getVoteCounts(caseId);
  const total = votes.length;

  // Calculate percentages
  const results = Object.entries(counts).map(([option, count]) => ({
    option,
    votes: count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  return NextResponse.json({
    results,
    total,
    counts,
  });
}

