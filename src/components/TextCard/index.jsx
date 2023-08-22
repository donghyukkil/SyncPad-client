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
        <div className="flex flex-col justify-around m-auto border border-indigo-950">
          <div
            className="bg-white m-auto rounded-md overflow-hidden text-sm"
            style={{ width: "140px", height: "100px" }}
          >
            {text.content}
          </div>
          <div className="text-sm">{createdAt}</div>
        </div>
      </div>
    </div>
  );
};

export default TextCard;
