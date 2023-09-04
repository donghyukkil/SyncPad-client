import { useState } from "react";
import TextEditor from "../../components/TextEditor";

const Chatting = () => {
  const [roomId, setRoomId] = useState(1);

  return (
    <div className="flex">
      <div
        className="w-screen h-screen flex flex-col"
        style={{ backgroundColor: "#F8F0E5" }}
      >
        <TextEditor roomId={roomId} setRoomId={setRoomId} />
      </div>
    </div>
  );
};

export default Chatting;
