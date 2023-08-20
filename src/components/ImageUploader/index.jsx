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
        <div className="border-4">
          <div className="w-72 h-52 p-3">
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Uploaded"
            />
            <Button
              onClick={handleSaveImage}
              style={"bg-sky-400 text-black h-20 w-full my-2"}
            >
              저장
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={fileInputRef}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="bg-sky-400 flex justify-center items-center cursor-pointer w-full h-1/3 text-black rounded-md"
          >
            원하는 이미지를 업로드하세요
          </label>
        </div>
      )}
      {uploadedImage && (
        <div>
          <p className="text-white">이미지가 업로드되었습니다.</p>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
