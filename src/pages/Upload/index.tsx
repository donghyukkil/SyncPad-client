import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ImageUploader from "../../components/ImageUploader";
import SubNavBar from "../../components/SubNavBar";

const Upload = () => {
  return (
    <div className="h-full sm:w-[60vw] lg:w-[60vw] m-auto">
      <SubNavBar />
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
      <ImageUploader />
    </div>
  );
};

export default Upload;
