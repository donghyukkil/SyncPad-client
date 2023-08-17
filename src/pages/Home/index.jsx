import NavBar from "../../components/NavBar";
import { CONFIG } from "../../constants/config";

const Home = () => {
  return (
    <div className="flex">
      <NavBar />
      <div className="bg-amber-400 w-screen h-screen flex">
        <div className="bg-sky-950 w-6/12 h-2/4 m-auto py-0">
          <button className="text-white text-5xl h-2/4 py-0">
            구글 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
