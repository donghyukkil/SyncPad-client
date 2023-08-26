import { useNavigate } from "react-router-dom";

const TextCard = ({ text }) => {
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    navigate(`/mypage/${text._id}`);
  };

  return (
    <div className="flex flex-col" onClick={navigateToDetailPage}>
      <div className="bg-rose-800 w-full h-12 text-center line leading-10 text-sm text-green-50 rounded-md">
        Hello, legalPad!
      </div>
      <div className="bg-yellow-300 flex">
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
