import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

import Button from "../../components/Button";
import NavBar from "../../components/NavBar";

import { CONFIG } from "../../constants/config";

const Home = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userphtoURL", user.photoURL);

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
      <div className="bg-yellow-300 w-screen h-screen flex">
        <div className="flex bg-teal-950 w-6/12 h-2/4 m-auto py-0 justify-center">
          <Button
            style={
              "text-white text-lg h-2/4 py-0 m-auto border-solid border-4 border-yellow-400 w-1/4 font-bold"
            }
            onClick={signInWithGoogle}
          >
            구글 로그인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
