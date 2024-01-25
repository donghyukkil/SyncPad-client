import SubNavBar from "../../components/SubNavBar";
import TextEditor from "../../components/TextEditor";

const Create = () => {
  return (
    <>
      <SubNavBar />
      <div className="bg-custom-yellow mx-auto my-10 w-11/12 h-[75vh] rounded-md">
        <div>
          <div className="rounded-lg">
            <TextEditor />
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
