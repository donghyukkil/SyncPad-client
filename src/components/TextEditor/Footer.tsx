import Button from "../Button";

import downloadIcon from "../../assets/down-arrow.png";
import saveIcon from "../../assets/check.png";
import chatIcon from "../../assets/chat.png";
import deleteIcon from "../../assets/delete.png";

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
}) => {
  return (
    <>
      <div className="bg-custom-white rounded-lg drop-shadow-xl">
        <div className="flex">
          {text_id && (
            <Button
              style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
              onClick={() => handleCreateRoom()}
            >
              <img
                src={chatIcon}
                className="max-w-[10vw] max-h-[10vh] m-auto"
              />
            </Button>
          )}
          {roomId && (
            <Button
              style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
              onClick={() => handleDeleteRoom()}
            >
              <img
                src={deleteIcon}
                className="max-w-[10vw] max-h-[10vh] m-auto"
              />
            </Button>
          )}
          {!handleSaveImage && (
            <Button
              style="m-auto hover:bg-gray-100 rounded-md font-mono font-bold"
              onClick={() => {
                handleDownloadClick(textValue, textareaRef, backgroundColor);
              }}
            >
              <img
                src={downloadIcon}
                alt="download"
                className="max-w-[10vw] max-h-[10vh] m-auto"
              />
            </Button>
          )}

          <Button
            style="m-auto hover:bg-gray-100 rounded-md font-mono font-bold"
            onClick={() => {
              handleSaveImage ? handleSaveImage() : updateText();
            }}
          >
            <img
              src={saveIcon}
              alt="download"
              className="max-w-[10vw] max-h-[10vh] m-auto"
            />
          </Button>

          {text_id && (
            <Button
              style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
              onClick={deleteText}
            >
              <img
                src={deleteIcon}
                className="max-w-[10vw] max-h-[10vh] m-auto"
              />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Footer;
