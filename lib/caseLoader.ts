import case001 from '@/data/cases/case_001.json';

export interface Case {
  id: string;
  title: string;
  overview: string;
  metadata: {
    location: string;
    time_window: string;
  };
  suspects: {
    [key: string]: string;
  };
  hints: string[];
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

