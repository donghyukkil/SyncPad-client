import { useEffect, useState } from "react";

import TextCard from "../../components/TextCard";
import NavBar from "../../components/NavBar";
import useStore from "../../usStore";

const Mypage = () => {
  const { texts, fetchTexts, currentPage } = useStore();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTexts(currentPage);

    if (texts.totalPages) {
      setTotalPages(texts.totalPages);
    }
  }, [currentPage, texts]);

  return (
    <div className="flex">
      <NavBar />
      <div className="bg-yellow-300 w-screen h-screen flex">
        <div className="flex flex-col bg-teal-950 w-6/12 h-2/4 m-auto py-0 justify-center rounded-md">
          <main className="flex-grow grid grid-cols-3 grid-rows-2 gap-4 p-4">
            {texts.data !== undefined
              ? texts.data.map((text, index) => (
                  <TextCard key={index} text={text} />
                ))
              : null}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
