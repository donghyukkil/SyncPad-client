import Button from "../Button";

const Footer = ({
  backgroundColor,
  text_id,
  textareaRef,
  setBackgroundColor,
  handleCreateRoom,
  handleDeleteRoom,
  handleDownloadClick,
  updateText,
  roomId,
  textValue,
  deleteText,
}) => {
  return (
    <>
      <div className="m-auto bg-white rounded-md">
        <div className="flex flex-col h-[50vh] w-[15vw]">
          {text_id && (
            <Button
              style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
              onClick={() => handleCreateRoom()}
            >
              같이 메모하기
            </Button>
          )}
          {roomId && (
            <Button
              style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
              onClick={() => handleDeleteRoom()}
            >
              나가기
            </Button>
          )}
          <Button
            style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
            onClick={() => {
              handleDownloadClick(textValue, textareaRef, backgroundColor);
            }}
          >
            다운로드
          </Button>
          <Button
            style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
            onClick={updateText}
          >
            저장하기
          </Button>

          <div className="m-auto hover:bg-gray-100 rounded-md">
            <input
              className="w-[8vw] h-[8vh]"
              type="color"
              id="bgcolor"
              value={backgroundColor}
              onChange={e => {
                setBackgroundColor(e.target.value);

                if (textareaRef.current) {
                  textareaRef.current.style.backgroundColor = e.target.value;
                }
              }}
            />
          </div>
          {text_id && (
            <Button
              style="m-auto hover:bg-gray-100 rounded-md text-xl font-bold font-mono"
              onClick={deleteText}
            >
              삭제하기
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Footer;
