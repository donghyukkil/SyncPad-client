import TextCard from "../../components/TextCard";
import NavBar from "../../components/NavBar";

const Mypage = () => {
  return (
    <div className="flex">
      <NavBar />
      <div className="bg-yellow-300 w-screen h-screen flex">
        <div className="flex bg-teal-950 w-6/12 h-2/4 m-auto py-0 justify-center rounded-md">
          <main className="flex-grow grid grid-cols-3 grid-rows-2 gap-4 p-4">
            <TextCard></TextCard>
            <TextCard></TextCard>
            <TextCard></TextCard>
            <TextCard></TextCard>
            <TextCard></TextCard>
            <TextCard></TextCard>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
