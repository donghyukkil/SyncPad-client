import ImageUploader from "../../components/ImageUploader";
import NavBar from "../../components/NavBar";
import SubNavBar from "../../components/SubNavBar";

import useStore from "../../useStore";

import { CONFIG } from "../../constants/config";

const Upload = () => {
  const { setRoomId } = useStore();

  const uploadImageToServer = async base64String => {
    try {
      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${localStorage.getItem(
          "userEmail",
        )}/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: base64String }),
        },
      );
    } catch (error) {
      console.log("Image upload error", error.message);
    }
  };

  return (
    <div className="flex" style={{ backgroundColor: "#F8F0E5" }}>
      <NavBar />
      <div className="w-screen h-screen flex flex-col">
        <SubNavBar setRoomId={setRoomId} />
        <div
          className="flex w-3/4 h-3/4 m-auto py-0 justify-center rounded-md"
          style={{ backgroundColor: "#DAC0A3" }}
        >
          <ImageUploader onUpload={uploadImageToServer} />
        </div>
      </div>
    </div>
  );
};

export default Upload;
