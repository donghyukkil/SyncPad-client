import { useNavigate } from "react-router-dom";

const TextCard = ({ text }) => {
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    navigate(`/mypage/${text._id}`);
  };

  return (
    <div className="flex flex-col" onClick={navigateToDetailPage}>
      <div className="bg-amber-700 w-full h-1/2"></div>
      <div className="bg-yellow-300 flex round-md">
        <div className="flex flex-col justify-around m-auto border border-indigo-950">
          <div
            className="bg-white m-auto rounded-md overflow-hidden text-sm text-center"
            style={{ width: "140px", height: "130px" }}
          >
            {text.content.substring(0, 50)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCard;
