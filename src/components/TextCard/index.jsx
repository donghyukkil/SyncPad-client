import { useNavigate } from "react-router-dom";

const TextCard = ({ item }) => {
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    const path = item.roomName
      ? `/room/${item.roomName}`
      : `/mypage/${item._id}`;

    navigate(path);
  };

  const renderContent = content => {
    if (typeof content === "object") {
      return Object.values(content)
        .map((value, index) =>
          typeof value === "string" ? <span key={index}>{value}</span> : null,
        )
        .filter(Boolean);
    }
    return content;
  };

  const backgroundColor = item.backgroundColor || "#f0f0f0";
  const content = item.content || item.roomName;

  return (
    <div className="flex flex-col" onClick={navigateToDetailPage}>
      <div className="bg-amber-700 w-full h-10 text-center line leading-10 text-xs rounded-md font-semibold font-mono flex items-center justify-center">
        Hello, legalPad!
      </div>
      <div
        className="bg-yellow-200 flex"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="flex flex-col justify-around m-auto">
          <div
            className="bg-white m-auto rounded-md overflow-hidden text-sm text-center w-3/5"
            style={{ height: "100px" }}
          >
            <div>{renderContent(content)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCard;
