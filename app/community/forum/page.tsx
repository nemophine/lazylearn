import { createQuestion } from './actions';
import { questions } from './data';
import Link from 'next/link';

export default function ForumPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Q&A Forum</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Ask a Question</h2>
        <form action={createQuestion}>
          <div className="mb-4">
            <label htmlFor="question-title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="question-title" name="question-title" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-4">
            <label htmlFor="question-body" className="block text-sm font-medium text-gray-700">Question</label>
            <textarea id="question-body" name="question-body" rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Questions</h2>
        <div className="space-y-4">
          {questions.map((question) => (
            <Link key={question.id} href={`/community/forum/${question.id}`}>
              <div className="p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <h3 className="font-semibold">{question.title}</h3>
                <p className="text-gray-600">{question.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
