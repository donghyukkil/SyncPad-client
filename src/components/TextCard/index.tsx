import { useNavigate } from "react-router-dom";

interface Item {
  roomId?: string;
  _id?: string;
  content?: string[] | { [key: string]: string };
  backgroundColor?: string;
}

interface TextCardProps {
  item: Item;
}

const TextCard: React.FC<TextCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    const path = item.roomId ? `/room/${item._id}` : `/mypage/${item._id}`;
    navigate(path);
  };

  const renderContent = (
    content: string | string[] | { [key: string]: string } | undefined,
  ) => {
    if (!content) {
      return null;
    }

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
  const content = item.content || item.roomId;

  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={navigateToDetailPage}
    >
      <div className="bg-blue-900 w-full h-[3vh] text-center text-white line leading-10 text-xs rounded-md font-semibold font-mono flex items-center justify-center">
        Hello, legalPad!
      </div>
      <div style={{ backgroundColor: backgroundColor }}>
        <div className="flex flex-col justify-around m-auto">
          <div
            className="m-auto rounded-md overflow-hidden text-sm text-center w-3/5"
            style={{ height: "100px", backgroundColor: backgroundColor }}
          >
            <div>{renderContent(content)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCard;
