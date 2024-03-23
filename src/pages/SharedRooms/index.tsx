import { useEffect, useCallback } from "react";

import TextCard from "../../components/TextCard";
import SubNavBar from "../../components/SubNavBar";
import Button from "../../components/Button";

import useStore from "../../useStore";

const SharedRooms = () => {
  const { rooms, user, fetchRooms } = useStore();

  const memoizedFetchRooms = useCallback(() => {
    if (user) {
      fetchRooms(user);
    }
  }, [user, fetchRooms]);

  useEffect(() => {
    memoizedFetchRooms();
  }, [memoizedFetchRooms]);

  return (
    <div className="w-screen h-screen flex flex-col sm:w-[60vw] lg:w-[60vw] m-auto">
      <SubNavBar />
      <div className="flex flex-col mx-auto my-12 h-screen justify-center rounded-md">
        <main className="flex-grow grid grid-cols-2 grid-rows-0.5 gap-6 m-5">
          {rooms?.map(room => <TextCard key={room._id} item={room} />)}
        </main>
        <nav className="flex justify-center">
          <ul className="list-style-none flex">
            <li>
              <Button
                style={
                  "relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400"
                }
              >
                Previous
              </Button>
            </li>
            <li>
              <Button
                style={
                  "relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400"
                }
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

export default SharedRooms;
