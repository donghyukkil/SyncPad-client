import { ToastContainer, toast } from "react-toastify";

const Main = ({
  textareaRef,
  handleInputChange,
  bgColor,
  roomId,
  typingUser,
}) => {
  return (
    <>
      <div className="flex flex-col min-w-[40vw] max-w-[30vw] m-auto my-10">
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
        <div className="bg-blue-900 w-full text-center rounded-md text-white font-mono p-3">
          Hello, legalPad!
        </div>
        <div
          className="bg-yellow-200 border-gray-400 rounded-lg min-h-[50vh] max-h-[50vh] text-2xl"
          ref={textareaRef}
          onInput={handleInputChange}
          contentEditable
          style={{
            lineHeight: "33px",
            fontFamily: "Courier New",
            color: "#000",
            background: `linear-gradient(0deg, rgba(0,0,0,0.2) 1px, transparent 1px)`,
            backgroundSize: "100% 33px",
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
