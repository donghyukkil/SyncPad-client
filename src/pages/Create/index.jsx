import TextEditor from "../../components/TextEditor";

import useStore from "../../useStore";

const Create = () => {
  const { setRoomId } = useStore();
  return (
    <div className="flex">
      <div
        className="flex w-3/4 h-3/4 m-auto justify-center rounded-md"
        style={{ backgroundColor: "#DAC0A3" }}
      >
        <TextEditor setRoomId={setRoomId} />
      </div>
    </div>
  );
};

export default Create;
