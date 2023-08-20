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
      <div className="bg-yellow-300 w-screen h-screen flex">
        <div className="flex bg-teal-950 w-6/12 h-2/4 m-auto py-0 justify-center rounded-md">
          <ImageUploader onUpload={uploadImageToServer} />
        </div>
      </div>
    </div>
  );
};

export default Upload;
