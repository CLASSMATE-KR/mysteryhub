import fs from 'fs';
import path from 'path';

export interface Vote {
  id: string;
  caseId: string;
  option: string;
  ipAddress: string;
  browserToken: string;
  createdAt: string;
}

const VOTES_FILE = path.join(process.cwd(), 'data', 'votes.json');

function ensureVotesFile() {
  const dir = path.dirname(VOTES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(VOTES_FILE)) {
    fs.writeFileSync(VOTES_FILE, JSON.stringify([], null, 2));
  }
}

export function getVotes(): Vote[] {
  try {
    ensureVotesFile();
    const data = fs.readFileSync(VOTES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function saveVote(vote: Vote): void {
  try {
    ensureVotesFile();
    const votes = getVotes();
    votes.push(vote);
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
  } catch (error) {
    console.error('Failed to save vote:', error);
  }
}

export function hasVoted(caseId: string, ipAddress: string, browserToken: string): boolean {
  const votes = getVotes();
  return votes.some(
    v => v.caseId === caseId && (v.ipAddress === ipAddress || v.browserToken === browserToken)
  );
}

export function getVotesByCase(caseId: string): Vote[] {
  const votes = getVotes();
  return votes.filter(v => v.caseId === caseId);
}

export function getVoteCounts(caseId: string): { [option: string]: number } {
  const votes = getVotesByCase(caseId);
  const counts: { [option: string]: number } = {};
  
  votes.forEach(vote => {
    counts[vote.option] = (counts[vote.option] || 0) + 1;
  });
  
  return counts;
}

