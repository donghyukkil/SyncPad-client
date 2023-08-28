import { useState, useRef } from "react";

import Button from "../Button";

const ImageUploader = ({ onUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = async event => {
    const file = event.target.files[0];

    if (file) {
      const base64String = await convertToBase64(file);
      setSelectedImage(base64String);
    }
  };

  const handleSaveImage = () => {
    if (selectedImage) {
      onUpload(selectedImage);
      setUploadedImage(selectedImage);
    }
  };

  const convertToBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <>
      {selectedImage ? (
        <div className="w-3/4 h-full">
          <div className="flex flex-col justify-evenly h-full">
            <div className="p-3 border bg-white border-gray-400 rounded-lg h-72 resize-none text-center text-2xl flex justify-center">
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Uploaded"
                className="w-1/2 h-full m-auto"
              />
            </div>

            {uploadedImage ? (
              <Button
                style={
                  "bg-pink-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0"
                }
              >
                이미지가 업로드되었습니다.
              </Button>
            ) : (
              <Button
                onClick={handleSaveImage}
                style={
                  "bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0"
                }
              >
                저장
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-3/4 h-full">
          <div className="flex flex-col justify-evenly h-full">
            <div className="p-3 border bg-white border-gray-400 rounded-lg h-72 resize-none text-center text-2xl flex justify-center">
              <img
                src={"../src/assets/img.png"}
                className="w-1/3 h-1/2 m-auto"
              />
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              style={{ display: "none" }}
              ref={fileInputRef}
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="bg-white hover:border-0 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-center"
            >
              원하는 이미지를 업로드하세요
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
