export interface Answer {
  id: number;
  body: string;
  questionId: number;
}

export interface Question {
  id: number;
  title: string;
  body: string;
  answers: Answer[];
  bestAnswerId?: number;
}

export const questions: Question[] = [
  {
    id: 1,
    title: "How do I learn React?",
    body: "I'm new to web development and I want to learn React. Where should I start?",
    answers: [],
  },
  {
    id: 2,
    title: "What is Next.js?",
    body: "I've heard a lot about Next.js. Can someone explain what it is and why I should use it?",
    answers: [],
  },
];
