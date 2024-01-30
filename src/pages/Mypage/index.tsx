import { useEffect } from "react";

import { ToastContainer } from "react-toastify";

import TextCard from "../../components/TextCard";
import useStore from "../../useStore";
import Button from "../../components/Button";
import SubNavBar from "../../components/SubNavBar";

import { CONFIG } from "../../constants/config";

interface StoreState {
  texts: {
    data: Array<object>;
    totalPages: number;
  };
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setTexts: (texts: { texts: Array<object> }) => void;
  user: {
    email: string;
  } | null;
}

const Mypage = () => {
  const { texts, currentPage, setCurrentPage, setTexts, user } =
    useStore() as StoreState;

  const fetchTexts = async () => {
    try {
      if (!user) {
        return;
      }

      const response = await fetch(
        `${CONFIG.BACKEND_SERVER_URL}/users/${user.email}/texts?per_page=6&page=${currentPage}`,
      );

      const texts = await response.json();

      setTexts(texts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, [currentPage, user]);

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-screen h-screen flex flex-col sm:w-[60vw] lg:w-[30vw] m-auto">
      <SubNavBar />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ top: "9vh" }}
      />
      <div className="flex flex-col w-11/12 h-3/4 m-auto rounded-md">
        <main className="flex-grow grid grid-cols-2 grid-rows-0.5 gap-5">
          {texts.data !== undefined
            ? texts.data.map((text, index) => (
                <TextCard key={index} item={text} />
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
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
            </li>
            {[...Array(texts.totalPages).keys()].map(pageNumber => (
              <li key={pageNumber}>
                <Button
                  style={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 dark:text-neutral-400 ${
                    pageNumber + 1 === currentPage
                      ? "text-neutral-700 shadow-lg"
                      : "text-neutral-500"
                  }`}
                  onClick={() => changePage(pageNumber + 1)}
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
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === texts.totalPages}
              >
                Next
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Mypage;
