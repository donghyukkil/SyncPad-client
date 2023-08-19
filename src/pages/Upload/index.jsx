import ImageUploader from "../../components/ImageUploader";
import NavBar from "../../components/NavBar";

import { CONFIG } from "../../constants/config";

const Upload = () => {
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

      const data = await response.json();
    } catch (error) {
      console.log("Image upload error", error.message);
    }
  };

  return (
    <div className="flex">
      <NavBar />
      <div className="bg-yellow-300 w-screen flex">
        <div className="m-auto flex w-1/2 bg-blue-400 justify-between">
          <ImageUploader onUpload={uploadImageToServer} />
        </div>
      </div>
    </div>
  );
};

export default Upload;
