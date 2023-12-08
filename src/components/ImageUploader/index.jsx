import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import useStore from "../../useStore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../Button";

import imgSrc from "../../assets/img.png";

import { uploadImageToServer } from "../../utils/helpers";

const ImageUploader = () => {
  const { user } = useStore();

  const navigate = useNavigate();

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

  const handleSaveImage = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setTimeout(() => navigate("/"), 2500);
      return;
    }

    if (selectedImage) {
      const uploadSuccess = await uploadImageToServer(selectedImage, user);

      if (uploadSuccess) {
        setUploadedImage(selectedImage);

        setTimeout(() => navigate("/mypage"), 2000);
      }
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
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ top: "9vh" }}
            />
            <div className="p-3 border bg-white border-gray-400 rounded-lg h-72 resize-none text-center text-2xl flex justify-center">
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Uploaded"
                className="w-1/2 h-full m-auto"
              />
            </div>

            <Button
              onClick={handleSaveImage}
              style={
                "bg-yellow-300 h-[8vh] hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-center text-lg font-semibold font-mono"
              }
            >
              저장
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-3/4 h-full">
          <div className="flex flex-col justify-evenly h-full">
            <div className="p-3 border bg-white border-gray-400 rounded-lg h-72 resize-none text-center text-2xl flex justify-center">
              <img src={imgSrc} className="w-1/3 h-1/2 m-auto" />
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
              className="flex justify-center item-center bg-yellow-300 h-[8vh] hover:border-0 hover:bg-white text-black px-4 py-2 rounded-md text-2xl font-semibold font-mono"
            >
              <div>원하는 이미지에서 메모를 추출하세요</div>
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
