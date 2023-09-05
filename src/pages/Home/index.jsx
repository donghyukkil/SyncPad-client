import { useNavigate } from "react-router-dom";

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import SubNavBar from "../../components/SubNavBar";

import useStore from "../../useStore";

import { CONFIG } from "../../constants/config";

const Home = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const { setRoomId } = useStore();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userPhotoURL", user.photoURL);

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

      navigate("/create");
    } catch (error) {
      console.log("에러 발생");
    }
  };

  return (
    <div className="flex" style={{ backgroundColor: "#F8F0E5" }}>
      <NavBar />
      <div className="w-screen h-screen flex flex-col">
        <SubNavBar setRoomId={setRoomId} />
        <div
          className="flex w-3/4 h-3/4 m-auto py-0 justify-center rounded-md"
          style={{ backgroundColor: "#DAC0A3" }}
        >
          <div className="flex flex-col justify-evenly w-3/4">
            <div className="p-3 border bg-white border-gray-400 rounded-lg h-72 resize-none text-center text-3xl font-mono font-semibold flex items-center justify-center">
              Hello, legalPad!
            </div>
            <Button
              style={
                "bg-white hover:bg-gray-100 hover:border-0 text-black px-4 py-2 rounded-lg p-0 text-lg font-semibold font-mono"
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
