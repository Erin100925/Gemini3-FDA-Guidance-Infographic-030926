export interface Topic {
  id: string;
  title: string;
  summary: string;
  type: string;
  data: any[];
  takeaways: string[];
}

export interface RiskRadarData {
  category: string;
  score: number;
  reasoning: string;
}

export interface SEMatrixData {
  predicateName: string;
  comparisons: {
    feature: string;
    subjectDevice: string;
    predicateDevice: string;
    equivalence: 'Identical' | 'Similar' | 'Different';
  }[];
}

export interface DeficiencyLetterData {
  date: string;
  reviewerName: string;
  deficiencies: {
    id: string;
    description: string;
    requestedAction: string;
  }[];
}

export interface AppState {
  theme: 'light' | 'dark';
  painterStyle: string;
  language: 'en' | 'zh';
  step: 'upload' | 'review' | 'dashboard';
  markdown: string;
  topics: Topic[];
  checklist: string[];
  questions: string[];
  riskRadar: RiskRadarData[];
  seMatrix: SEMatrixData | null;
  deficiencyLetter: DeficiencyLetterData | null;
  isLoading: boolean;
  loadingMessage: string;
}
