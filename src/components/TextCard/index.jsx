import { useNavigate } from "react-router-dom";

const TextCard = ({ text }) => {
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    navigate(`/mypage/${text._id}`);
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

  return (
    <div className="flex flex-col" onClick={navigateToDetailPage}>
      <div className="bg-amber-700 w-full h-10 text-center line leading-10 text-sm text-green-50 rounded-md">
        Hello, legalPad!
      </div>
      <div className="bg-yellow-200 flex">
        <div className="flex flex-col justify-around m-auto border border-indigo-950">
          <div
            className="bg-white m-auto rounded-md overflow-hidden text-sm text-center"
            style={{ width: "140px", height: "130px" }}
          >
            {renderContent(text.content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCard;
