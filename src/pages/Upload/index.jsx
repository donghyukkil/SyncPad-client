import ImageUploader from "../../components/ImageUploader";
import NavBar from "../../components/NavBar";

const Upload = () => {
  return (
    <div className="flex">
      <NavBar />
      <div className="bg-amber-400 w-screen flex ">
        <div className="m-auto flex w-1/2 bg-blue-400 justify-between">
          <ImageUploader />
          <div className="bg-indigo-950 w-4/12 text-center">
            <button className="text-zinc-200">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
