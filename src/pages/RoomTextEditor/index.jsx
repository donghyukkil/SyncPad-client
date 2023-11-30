import NavBar from "../../components/NavBar";
import SubNavBar from "../../components/SubNavBar";
import TextEditor from "../../components/TextEditor";

const RoomTextEditor = () => {
  return (
    <div className="flex bg-zinc-100">
      <NavBar />
      <div className="w-screen flex flex-col bg-white">
        <SubNavBar />
        <div className="w-3/4 h-3/4 m-auto rounded-md bg-zinc-100">
          <div className="my-10 mx-auto">
            <TextEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTextEditor;
