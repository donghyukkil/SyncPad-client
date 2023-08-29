import NavBar from "../../components/NavBar";
import LegalPadTextarea from "../../components/LegalPadTextArea";
import SubNavBar from "../../components/SubNavBar";

const Create = () => {
  return (
    <div className="flex">
      <NavBar />
      <div
        className="w-screen h-screen flex flex-col"
        style={{ backgroundColor: "#F8F0E5" }}
      >
        <SubNavBar />
        <div
          className="flex w-3/4 h-3/4 m-auto justify-center rounded-md"
          style={{ backgroundColor: "#DAC0A3" }}
        >
          <LegalPadTextarea />
        </div>
      </div>
    </div>
  );
};

export default Create;
