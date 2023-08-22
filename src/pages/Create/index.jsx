import NavBar from "../../components/NavBar";
import LegalPadTextarea from "../../components/LegalpadTextArea";

const Create = () => {
  return (
    <div className="flex">
      <NavBar />
      <div className="bg-yellow-300 w-screen h-screen flex">
        <div className="flex bg-teal-950 w-6/12 h-2/4 m-auto py-0 justify-center rounded-md">
          <LegalPadTextarea />
        </div>
      </div>
    </div>
  );
};

export default Create;
