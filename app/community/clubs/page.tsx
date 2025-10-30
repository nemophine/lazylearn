import ChatRoom from './ChatRoom';

export default function ClubsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clubs</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create a Club</button>
      </div>

      <div className="space-y-4 mb-8">
        {/* Placeholder for club list */}
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold">React Enthusiasts</h3>
          <p className="text-gray-600">A club for people who love React.</p>
        </div>
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold">Next.js Ninjas</h3>
          <p className="text-gray-600">A club for Next.js developers.</p>
        </div>
      </div>

      <ChatRoom />
    </div>
  );
}
