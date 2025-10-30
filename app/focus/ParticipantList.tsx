
'use client';

// This is a placeholder component for displaying participants.
// In a real app, it would receive participant data as props
// and update based on WebSocket events.

export default function ParticipantList() {
  // Mock data
  const participants = [
    { id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: '2', name: 'Friend A', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">In this session:</h3>
      <div className="flex justify-center space-x-4">
        {participants.map(p => (
          <div key={p.id} className="flex flex-col items-center space-y-2">
            <img 
              src={p.avatar} 
              alt={p.name} 
              className="w-16 h-16 rounded-full ring-2 ring-offset-2 ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
