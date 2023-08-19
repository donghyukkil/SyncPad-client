import { useState } from "react";

import Button from "../Button";

const ImageUploader = ({ onUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

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
        <div className="flex justify-around">
          <img
            src={`data:image/jpeg;base64,${selectedImage}`}
            alt="Uploaded"
            className="w-full"
          />

          <Button onClick={handleSaveImage} style={"bg-purple-800 text-white"}>
            저장
          </Button>
        </div>
      ) : (
        <input type="file" onChange={handleImageChange} />
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
