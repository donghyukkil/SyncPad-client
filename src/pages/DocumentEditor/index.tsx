import SubNavBar from "../../components/SubNavBar";
import TextEditor from "../../components/TextEditor";

const DocumentEditor = () => {
  return (
    <div className="flex bg-zinc-100">
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

export default DocumentEditor;
