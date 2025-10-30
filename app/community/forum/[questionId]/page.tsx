import { questions } from "../data";
import { createAnswer, markAsBestAnswer } from "../actions";

export default function QuestionDetailPage({ params }: { params: { questionId: string } }) {
  const question = questions.find((q) => q.id === parseInt(params.questionId));

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
      <p className="mb-8">{question.body}</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Submit an Answer</h2>
        <form action={async (formData) => {
          await createAnswer(formData, question.id);
        }}>
          <div className="mb-4">
            <textarea name="answer-body" rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit Answer</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Answers</h2>
        <div className="space-y-4">
          {question.answers.map((answer) => (
            <div key={answer.id} className={`p-4 border rounded-md ${question.bestAnswerId === answer.id ? 'border-green-500' : ''}`}>
              <p className="text-gray-600">{answer.body}</p>
              {question.bestAnswerId === answer.id && <div className="text-green-600 font-bold mt-2">Best Answer</div>}
              <form action={async () => {
                await markAsBestAnswer(question.id, answer.id);
              }} className="mt-2">
                <button type="submit" className="text-xs text-gray-500">Mark as Best</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
