import ImageUploader from "../../components/ImageUploader";
import NavBar from "../../components/NavBar";
import SubNavBar from "../../components/SubNavBar";

const Upload = () => {
  return (
    <div className="flex" style={{ backgroundColor: "#F8F0E5" }}>
      <NavBar />
      <div className="w-screen h-screen flex flex-col">
        <SubNavBar />
        <div
          className="flex w-3/4 h-3/4 m-auto py-0 justify-center rounded-md"
          style={{ backgroundColor: "#DAC0A3" }}
        >
          <ImageUploader />
        </div>
      </div>
    </div>
  );
};

export default Upload;
