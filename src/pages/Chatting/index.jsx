import { useState } from "react";

import TextCardDetail from "../../components/TextCardDetail";

const Chatting = () => {
  const [roomId, setRoomId] = useState(null);

  return (
    <div className="flex">
      <div
        className="w-screen h-screen flex flex-col"
        style={{ backgroundColor: "#F8F0E5" }}
      >
        <div className="m-4">
          <select
            onChange={e => setRoomId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="" disabled>
              Select a room
            </option>
            <option value="room1">Room 1</option>
            <option value="room2">Room 2</option>
            <option value="room3">Room 3</option>
          </select>
        </div>
        {roomId && <TextCardDetail roomId={roomId} />}
      </div>
    </div>
  );
};

export default Chatting;
