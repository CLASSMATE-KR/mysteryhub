import { NextRequest, NextResponse } from 'next/server';
import { saveVote, hasVoted, Vote } from '@/lib/voteStorage';
import { randomBytes } from 'crypto';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function generateBrowserToken(): string {
  return randomBytes(16).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, option } = body;

    if (!caseId || !option) {
      return NextResponse.json({ error: 'Missing caseId or option' }, { status: 400 });
    }

    const ipAddress = getClientIP(request);
    
    // Get or create browser token
    let browserToken = request.cookies.get('browser-token')?.value;
    if (!browserToken) {
      browserToken = generateBrowserToken();
    }

    // Check if already voted
    if (hasVoted(caseId, ipAddress, browserToken)) {
      const response = NextResponse.json({ 
        alreadyVoted: true,
        error: 'Your vote has already been recorded.' 
      });
      response.cookies.set('browser-token', browserToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
      return response;
    }

    // Save vote
    const vote: Vote = {
      id: randomBytes(8).toString('hex'),
      caseId,
      option,
      ipAddress,
      browserToken,
      createdAt: new Date().toISOString(),
    };

    saveVote(vote);

    const response = NextResponse.json({ success: true, vote });
    response.cookies.set('browser-token', browserToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}

