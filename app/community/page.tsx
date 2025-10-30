import MissionBanner from './MissionBanner';

export default function CommunityPage() {
  return (
    <div className="container mx-auto p-4">
      <MissionBanner />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Hot Topics</h2>
        <div className="space-y-4">
          {/* Placeholder for hot topics */}
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold">How do I learn React?</h3>
            <p className="text-gray-600">This is a placeholder for a hot topic.</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Active Clubs</h2>
        <div className="space-y-4">
          {/* Placeholder for active clubs */}
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold">React Enthusiasts</h3>
            <p className="text-gray-600">This is a placeholder for an active club.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
