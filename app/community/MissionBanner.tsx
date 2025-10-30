'use client';

import { useState, useEffect } from 'react';

export default function MissionBanner() {
  const [mission, setMission] = useState({
    title: "Help us plant 1,000 trees!",
    description: "For every 1,000,000 Heart Points collected, we will donate to a tree planting organization.",
    currentPoints: 0,
    goalPoints: 1000000,
    endDate: "3 days left",
  });

  useEffect(() => {
    const fetchHeartPoints = async () => {
      const response = await fetch('/api/impact/heart-points');
      const data = await response.json();
      setMission((prevMission) => ({ ...prevMission, currentPoints: data.heartPoints }));
    };

    fetchHeartPoints();

    const interval = setInterval(fetchHeartPoints, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const progress = (mission.currentPoints / mission.goalPoints) * 100;

  return (
    <div className="p-6 border rounded-md bg-indigo-50">
      <h2 className="text-2xl font-bold text-indigo-800">{mission.title}</h2>
      <p className="text-indigo-600 mt-2">{mission.description}</p>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-gray-700">{mission.currentPoints.toLocaleString()} / {mission.goalPoints.toLocaleString()} Heart Points</span>
        <span className="text-sm font-medium text-gray-700">{mission.endDate}</span>
      </div>
    </div>
  );
}
