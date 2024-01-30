import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

const Main = ({
  textareaRef,
  handleInputChange,
  bgColor,
  roomId,
  typingUser,
  backgroundColor,
}) => {
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.backgroundColor = backgroundColor;
    }
  }, [backgroundColor]);
  return (
    <>
      <div className="flex flex-col mx-10 mb-4">
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
        />
        <div className="flex justify-center bg-blue-900 min-h-[7vh] rounded-t-lg">
          <div className="text-white text-lg m-auto">Hello, legalpad</div>
        </div>

        <div
          className="bg-yellow-200 min-h-[50vh] max-h-[50vh] rounded-b-lg shadow-xl"
          ref={textareaRef}
          onInput={handleInputChange}
          contentEditable
          style={{
            lineHeight: "33px",
            fontFamily: "Courier New",
            color: "#000",
            background: `linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, transparent 20%, red 20.2%, red 20.5%, transparent 20%)`,
            backgroundSize: "100% 33px, 100% 100%",
            backgroundColor: bgColor,
            overflowY: "auto",
          }}
        />

        {roomId && (
          <div
            className="rounded-md text-center text-lg font-semibold font-mono flex items-center justify-center"
            style={{ height: "5px", marginTop: "25px" }}
          >
            {typingUser ? `${typingUser}가 입력 중입니다...` : ""}
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
