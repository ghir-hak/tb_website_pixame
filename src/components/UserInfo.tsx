import React, { useState } from "react";

interface UserInfoProps {
  userId: string;
  onUserIdChange: (userId: string) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ userId, onUserIdChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUserId, setTempUserId] = useState(userId);

  const handleSave = () => {
    if (tempUserId.trim()) {
      onUserIdChange(tempUserId.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempUserId(userId);
    setIsEditing(false);
  };

  const generateRandomId = () => {
    const adjectives = [
      "Happy",
      "Creative",
      "Artistic",
      "Colorful",
      "Bright",
      "Vibrant",
      "Cool",
      "Amazing",
    ];
    const nouns = [
      "Artist",
      "Painter",
      "Creator",
      "Designer",
      "Maker",
      "Builder",
      "Craftsman",
      "Genius",
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">User Info</h3>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={tempUserId}
            onChange={(e) => setTempUserId(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={20}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Username:</div>
              <div className="text-lg font-medium text-gray-800">{userId}</div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              Edit
            </button>
          </div>
          <button
            onClick={() => onUserIdChange(generateRandomId())}
            className="w-full px-3 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm"
          >
            Generate Random Name
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
