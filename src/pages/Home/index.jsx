import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import NavBar from "../../components/NavBar";
import { CONFIG } from "../../constants/config";

const Home = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const authenticateUser = async () => {
        try {
          const response = await fetch(`${CONFIG.BACKEND_SERVER_URL}/users`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail: user.email }),
          });

          if (response.ok) {
            console.log("인증 성공");
          } else {
            console.log("인증 실패", response);
          }
        } catch (error) {
          console.error(error.message);
        }
      };

      await authenticateUser();
    } catch (error) {
      console.error("오류 발생", error.message);
    }
  };

  return (
    <div className="flex">
      <NavBar />
      <div className="bg-amber-400 w-screen h-screen flex">
        <div className="bg-sky-950 w-6/12 h-2/4 m-auto py-0">
          <button
            className="text-white text-5xl h-2/4 py-0"
            onClick={signInWithGoogle}
          >
            구글 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
