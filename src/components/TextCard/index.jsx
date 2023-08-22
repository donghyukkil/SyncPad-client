import { useNavigate } from "react-router-dom";

const TextCard = ({ text }) => {
  const navigate = useNavigate();

  const navigateToDetailPage = () => {
    navigate(`/mypage/${text._id}`);
  };

  const createdAt = new Date(text.createdAt).toLocaleString();

  return (
    <div className="flex flex-col" onClick={navigateToDetailPage}>
      <div className="bg-amber-700 w-full h-full"></div>
      <div className="bg-yellow-300 w-full h-screen flex">
        <div className="flex flex-col justify-around">
          <div
            className="bg-white m-auto rounded-md overflow-hidden text-sm"
            style={{ width: "80px", height: "80px" }}
          >
            {text.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCard;
