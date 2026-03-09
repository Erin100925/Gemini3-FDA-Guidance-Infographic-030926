export interface Topic {
  id: string;
  title: string;
  summary: string;
  type: string;
  data: any[];
  takeaways: string[];
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
  isLoading: boolean;
  loadingMessage: string;
}
