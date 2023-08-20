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
        <div className="flex bg-teal-950 w-6/12 h-2/4 m-auto py-0 justify-center rounded-md">
          <div className="flex flex-col justify-evenly w-3/4">
            <div className="p-3 border bg-white border-gray-400 rounded-lg h-48 resize-none text-center text-2xl">
              Hello, legalPad! 환영합니다.
            </div>
            <Button
              style={
                "bg-sky-400 hover:bg-blue-600 text-black px-4 py-2 rounded-lg p-0"
              }
              onClick={signInWithGoogle}
            >
              구글 로그인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
