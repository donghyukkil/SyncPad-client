import { useState, useEffect, useRef } from "react";

import Button from "../Button";

import menu from "../../assets/menu.png";

import useSignInWithGoogle from "../../hooks/useSignInWithGoogle";

import useStore from "../../useStore";

import profile from "../../assets/user.png";

import { fetchUserRooms } from "../../utils/helpers";
import NavBar from "../NavBar";

const SubNavBar: React.FC = () => {
  const { user, setRooms } = useStore();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);

  const toggleHamburgeMenu = () => {
    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
  };

  const signInWithGoogle = useSignInWithGoogle();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (user) {
        try {
          const roomsData = await fetchUserRooms(user);
          setRooms(roomsData);
        } catch (error) {
          console.error("fetchUserRooms failed:", error);
        }
      }
    };
    fetchRooms();

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsHamburgerMenuOpen(false);
      }
    };

    if (isHamburgerMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (isHamburgerMenuOpen) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [user, isHamburgerMenuOpen]);

  return (
    <>
      <div className="flex justify-between bg-white min-h-[10vh]">
        <div className="my-auto flex w-1/2 cursor-pointer">
          <img
            className="h-[4.5vh] mx-5 my-auto"
            src={menu}
            alt="togglemenu"
            onClick={() => toggleHamburgeMenu()}
          />
        </div>

        <div
          ref={navRef}
          className={`absolute top-24 left-0 sm:left-[2vw] transform ${
            isHamburgerMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-1000 ease-in-out`}
        >
          {isHamburgerMenuOpen && <NavBar />}
        </div>

        <div className="relative flex justify-end my-auto w-1/2 mx-7">
          {user ? (
            <div>
              <Button>
                <img
                  className="h-[5vh] rounded-full mt-2"
                  src={user.photoURL}
                  alt="profile"
                  onClick={toggleMenu}
                />
              </Button>
            </div>
          ) : (
            <Button
              style={"bg-white hover:bg-white hover:border-0 rounded-lg"}
              onClick={signInWithGoogle}
            >
              <img src={profile} alt="profile" className="h-[5vh]" />
            </Button>
          )}
        </div>
      </div>
      <div className="border-b border-zinc-500 w-full"></div>
    </>
  );
};

export default SubNavBar;
