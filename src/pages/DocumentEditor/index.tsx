import SubNavBar from "../../components/SubNavBar";
import TextEditor from "../../components/TextEditor";

const DocumentEditor = () => {
  return (
    <div className="sm:w-[60vw] lg:w-[30vw] m-auto">
      <SubNavBar />
      <TextEditor />
    </div>
  );
};

export default DocumentEditor;
