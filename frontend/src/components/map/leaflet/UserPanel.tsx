'use client'

import React, { useState } from "react";
import { RoomUser } from "@/types/ws/event";

interface UserPanelProps {
  roomUsers: RoomUser[];
}

const UserPanel: React.FC<UserPanelProps> = ({ roomUsers }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prev => !prev);

  return (
    <div className="absolute top-4 left-4 z-[9999] space-y-2">

      <button
        onClick={toggleVisibility}
        className="w-34 backdrop-blur-md bg-white/30 border border-white/40 text-gray-900 px-4 py-2 rounded-xl shadow hover:bg-white/50 transition duration-200 text-center"
      >
        {isVisible ? "Hide Users" : "Show Users"}
      </button>

 
      {isVisible && (
        <div className="w-34 rounded-2xl shadow-xl backdrop-blur-md bg-white/30 border border-white/40 p-4">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-900">Users</h3>
          <ul className="space-y-2">
            {roomUsers.map((roomUser) => (
              <li key={roomUser.user.id} className="flex items-center space-x-2">
                <span
                  className="text-xl"
                  dangerouslySetInnerHTML={{ __html: roomUser.style }}
                ></span>
                <span className="text-sm font-medium text-gray-800">{roomUser.user.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserPanel;