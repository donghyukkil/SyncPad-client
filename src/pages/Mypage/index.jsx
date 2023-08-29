import { useEffect, useState } from "react";

import TextCard from "../../components/TextCard";
import NavBar from "../../components/NavBar";
import useStore from "../../useStore";
import Button from "../../components/Button";
import SubNavBar from "../../components/SubNavBar";

const Mypage = () => {
  const { texts, fetchTexts, currentPage, setCurrentPage } = useStore();
  const [localTotalPages, setLocalTotalPages] = useState(1);

  const { totalPages } = texts;

  useEffect(() => {
    fetchTexts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (totalPages) {
      setLocalTotalPages(totalPages);
    }
  }, [totalPages]);

  const onPrevButtonClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const onNextButtonClick = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex">
      <NavBar />
      <div className="w-screen h-screen flex flex-col">
        <SubNavBar />
        <div
          className="flex flex-col w-3/4 h-3/4 m-auto py-5 justify-center rounded-md"
          style={{ backgroundColor: "#DAC0A3" }}
        >
          <main className="flex-grow grid grid-cols-3 grid-rows-0.5 gap-6 p-6 m-5">
            {texts.data !== undefined
              ? texts.data.map((text, index) => (
                  <TextCard key={index} text={text} />
                ))
              : null}
          </main>
          <nav className="flex justify-center">
            <ul className="list-style-none flex">
              <li>
                <Button
                  style={
                    "relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400"
                  }
                  onClick={onPrevButtonClick}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
              </li>
              {[...Array(totalPages).keys()].map(pageNumber => (
                <li key={pageNumber}>
                  <Button
                    style={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 dark:text-neutral-400 ${
                      pageNumber + 1 === currentPage
                        ? "text-neutral-700 shadow-lg"
                        : "text-neutral-500"
                    }`}
                    onClick={() => setCurrentPage(pageNumber + 1)}
                  >
                    {pageNumber + 1}
                  </Button>
                </li>
              ))}
              <li>
                <Button
                  style={
                    "relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400"
                  }
                  onClick={onNextButtonClick}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
