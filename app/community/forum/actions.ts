'use server';

import { revalidatePath } from 'next/cache';
import { questions } from './data';

export async function createQuestion(formData: FormData) {
  const title = formData.get('question-title') as string;
  const body = formData.get('question-body') as string;

  const newQuestion = {
    id: questions.length + 1,
    title,
    body,
    answers: [],
  };

  questions.push(newQuestion);

  await fetch('http://localhost:3000/api/impact/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 10 }),
  });

  revalidatePath('/community/forum');
}

export async function createAnswer(formData: FormData, questionId: number) {
  const body = formData.get('answer-body') as string;

  const question = questions.find((q) => q.id === questionId);

  if (question) {
    const newAnswer = {
      id: question.answers.length + 1,
      body,
      questionId,
    };
    question.answers.push(newAnswer);

    await fetch('http://localhost:3000/api/impact/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5 }),
    });

    revalidatePath(`/community/forum/${questionId}`);
  }
}

export async function markAsBestAnswer(questionId: number, answerId: number) {
  const question = questions.find((q) => q.id === questionId);

  if (question) {
    question.bestAnswerId = answerId;

    await fetch('http://localhost:3000/api/impact/award', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, amount: 50 }),
    });

    revalidatePath(`/community/forum/${questionId}`);
  }
}
