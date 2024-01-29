import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import useStore from "../../useStore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "../TextEditor/Footer";

import imgSrc from "../../assets/image.png";

import { uploadImageToServer } from "../../utils/helpers";

const ImageUploader = () => {
  const { user } = useStore();

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;

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

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          resolve(result.split(",")[1]);
        } else {
          reject(new Error("FileReader result is not a string"));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {selectedImage ? (
        <div className="my-20 mx-auto w-10/12 h-screen">
          <div className="flex flex-col">
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
            <div className="border bg-selectbox border-gray-400 rounded-lg resize-none min-h-[40vh] max-h-[40vh]">
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Uploaded"
                className="w-full h-full"
              />
              <Footer handleSaveImage={handleSaveImage} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-8 my-20 border bg-white border-gray-400 rounded-lg min-h-[40vh] resize-none text-center text-2xl flex justify-center">
          <img
            src={imgSrc}
            className="w-1/3 h-1/2 m-auto"
            onClick={triggerFileInput}
          />
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={fileInputRef}
            id="fileInput"
          />
        </div>
      )}
    </>
  );
};

export default ImageUploader;
