import Button from "../Button";

import downloadIcon from "../../assets/down-arrow.png";
import saveIcon from "../../assets/check.png";
import chatIcon from "../../assets/chat.png";
import deleteIcon from "../../assets/delete.png";

interface FooterProps {
  backgroundColor: string;
  text_id?: string;
  textareaRef: React.RefObject<HTMLDivElement>;
  handleCreateRoom: () => void;
  handleDeleteRoom: () => void;
  handleDownloadClick: (
    textValue: string,
    textareaRef: React.RefObject<HTMLDivElement>,
    backgroundColor: string,
  ) => void;
  updateText: () => void;
  roomId: string;
  textValue: string;
  deleteText: () => void;
  handleSaveImage?: () => void;
}

const Footer: React.FC<FooterProps> = ({
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
    <div className="flex justify-around">
      {text_id && (
        <>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md"
            onClick={() => handleCreateRoom()}
          >
            <img src={chatIcon} className="h-[4.5vh] m-auto" />
          </Button>
        </>
      )}
      {roomId && (
        <>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md"
            onClick={() => handleCreateRoom()}
          >
            <img src={chatIcon} className="h-[4.5vh] m-auto" />
          </Button>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md"
            onClick={() => handleDeleteRoom()}
          >
            <img src={deleteIcon} className="h-[4.5vh] m-auto" />
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
              className="h-[4.5vh] m-auto"
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
        <img src={saveIcon} alt="download" className="h-[4.5vh] m-auto" />
      </Button>

      {text_id && (
        <Button
          style="m-auto hover:bg-gray-100 rounded-md"
          onClick={deleteText}
        >
          <img src={deleteIcon} className="h-[4.5vh] m-auto" />
        </Button>
      )}
    </div>
  );
};

export default Footer;
