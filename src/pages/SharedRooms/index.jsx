import TextCard from "../../components/TextCard";
import NavBar from "../../components/NavBar";
import SubNavBar from "../../components/SubNavBar";
import Button from "../../components/Button";

import useStore from "../../useStore";

const SharedRooms = () => {
  const { rooms } = useStore();

  return (
    <div className="flex">
      <NavBar />
      <div
        className="w-screen h-screen flex flex-col"
        style={{ backgroundColor: "#F8F0E5" }}
      >
        <SubNavBar />
        <div
          className="flex flex-col w-3/4 h-3/4 m-auto py-5 justify-center rounded-md"
          style={{ backgroundColor: "#DAC0A3" }}
        >
          <main className="flex-grow grid grid-cols-3 grid-rows-0.5 gap-6 p-6 m-5">
            {rooms?.map((room, index) => (
              <TextCard key={index} item={room} />
            ))}
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
    </div>
  );
};

export default SharedRooms;
