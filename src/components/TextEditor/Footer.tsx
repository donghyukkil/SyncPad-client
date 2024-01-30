import Button from "../Button";

import downloadIcon from "../../assets/down-arrow.png";
import saveIcon from "../../assets/check.png";
import chatIcon from "../../assets/chat.png";
import deleteIcon from "../../assets/delete.png";
import closeButton from "../../assets/close.png";

const Footer = ({
  backgroundColor,
  text_id,
  textareaRef,
  handleCreateRoom,
  handleDeleteRoom,
  handleDownloadClick,
  updateText,
  roomId,
  textValue,
  deleteText,
  handleSaveImage,
  setShowFooter,
}) => {
  return (
    <div className="rounded-lg drop-shadow-xl flex justify-evenly">
      {text_id && (
        <>
          <Button>
            <img
              src={closeButton}
              alt="closeButton"
              className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
              onClick={prev => setShowFooter(!prev)}
            />
          </Button>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md"
            onClick={() => handleCreateRoom()}
          >
            <img
              src={chatIcon}
              className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
            />
          </Button>
        </>
      )}
      {roomId && (
        <>
          <Button>
            <img
              src={closeButton}
              alt="closeButton"
              className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
              onClick={prev => setShowFooter(!prev)}
            />
          </Button>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md"
            onClick={() => handleCreateRoom()}
          >
            <img
              src={chatIcon}
              className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
            />
          </Button>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md"
            onClick={() => handleDeleteRoom()}
          >
            <img
              src={deleteIcon}
              className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
            />
          </Button>
        </>
      )}
      {!handleSaveImage && (
        <>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md"
            onClick={() => {
              handleDownloadClick(textValue, textareaRef, backgroundColor);
            }}
          >
            <img
              src={downloadIcon}
              alt="download"
              className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
            />
          </Button>
        </>
      )}

      <Button
        style="m-auto hover:bg-gray-100 rounded-md"
        onClick={() => {
          handleSaveImage ? handleSaveImage() : updateText();
        }}
      >
        <img
          src={saveIcon}
          alt="download"
          className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
        />
      </Button>

      {text_id && (
        <Button
          style="m-auto hover:bg-gray-100 rounded-md"
          onClick={deleteText}
        >
          <img
            src={deleteIcon}
            className="max-w-[10vw] max-h-[10vh] m-auto sm:w-[3vw]"
          />
        </Button>
      )}
    </div>
  );
};

export default Footer;
