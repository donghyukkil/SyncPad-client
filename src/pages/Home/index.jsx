import Button from "../../components/Button";

import useSignInWithGoogle from "../../hooks/useSignInWithGoogle";

const Home = () => {
  const signInWithGoogle = useSignInWithGoogle();

  return (
    <div className="flex bg-zinc-100">
      <div className="w-screen h-screen flex flex-col">
        <div className="flex w-3/4 h-3/4 m-auto py-0 justify-center rounded-md">
          <div className="flex flex-col justify-evenly w-3/4">
            <div className="p-3 border-2 bg-white border-yellow-300 rounded-lg h-72 resize-none text-center text-3xl font-mono font-semibold flex items-center justify-center">
              Hello, legalPad!
            </div>
            <Button
              style={
                "bg-yellow-300 hover:bg-white hover:border-0 text-black px-4 py-2 rounded-lg p-0 text-lg font-semibold font-mono"
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
