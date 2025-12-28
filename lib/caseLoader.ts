import case001 from '@/data/cases/case_001.json';
import fs from 'fs';
import path from 'path';

export type CaseState = 'intro' | 'overview' | 'evidence' | 'suspects' | 'voting' | 'closed';
export type CaseStatus = 'draft' | 'active' | 'closed';

export interface Hint {
  id: string;
  content: string;
  index: number;
  revealed: boolean;
  revealAt: string | null;
}

export interface Case {
  id: string;
  title: string;
  overview: string;
  caseState: CaseState;
  status: CaseStatus;
  metadata: {
    location: string;
    time_window: string;
  };
  suspects: {
    [key: string]: string;
  };
  hints: Hint[];
  vote_question: string;
  options: string[];
  correct_answer: string;
  answer_explanation: string;
}

const cases: { [key: string]: Case } = {
  case_001: case001 as Case,
};

export function getCase(caseId: string): Case | null {
  return cases[caseId] || null;
}

export function getCurrentCase(): Case {
  // For now, return case_001 as the active case
  return cases.case_001;
}

export function updateCase(caseId: string, updates: Partial<Case>): Case | null {
  const caseData = cases[caseId];
  if (!caseData) return null;
  
  const updated = { ...caseData, ...updates };
  cases[caseId] = updated;
  
  // In production, this would save to a database
  // For now, we'll keep it in memory
  return updated;
}

export function getRevealedHints(caseData: Case): Hint[] {
  return caseData.hints.filter(hint => hint.revealed);
}

