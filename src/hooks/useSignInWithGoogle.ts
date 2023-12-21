import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useStore from "../useStore";
import { CONFIG } from "../constants/config";

interface StoreState {
  setUser: (user: { email: string | null; photoURL: string | null }) => void;
}

interface Config {
  BACKEND_SERVER_URL: string;
}

const useSignInWithGoogle = (): (() => Promise<void>) => {
  const navigate = useNavigate();
  const { setUser } = useStore() as StoreState;

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setUser({
        email: user.email,
        photoURL: user.photoURL,
      });

      const idToken = await user.getIdToken();

      const response: Response = await fetch(
        `${(CONFIG as Config).BACKEND_SERVER_URL}/users`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: idToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail: user.email }),
        },
      );

      if (response.ok) {
        console.log("인증 성공");
        navigate("/create");
      } else {
        console.log("인증 실패", response);
      }
    } catch (error) {
      console.log("에러 발생", error);
    }
  };

  return signInWithGoogle;
};

export default useSignInWithGoogle;
