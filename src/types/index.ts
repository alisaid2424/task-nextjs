export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface Lesson {
  title: string;
  locked?: boolean;
  description: string;
  time?: string;
  questions?: Question[];
}

export interface Week {
  title: string;
  subtitle?: string;
  lessons: Lesson[];
}
