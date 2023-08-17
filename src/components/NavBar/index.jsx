import { useState } from "react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-800 h-screen flex justify-center">
      <div className="flex flex-col space-y-20">
        <a
          href="#"
          className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
          aria-current="page"
        >
          HOME
        </a>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
          CREATE
        </a>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
          UPLOAD
        </a>
        <a
          href="#"
          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
          MYPAGE
        </a>
        <div className="mt-2 ml-3">
          <button
            type="button"
            className="relative flex rounded-full bg-gray-800 text-sm"
            onClick={toggleMenu}
          >
            <img className="h-8 w-8 rounded-full m-6" src="" alt="" />
          </button>
          {menuOpen && (
            <div className="bg-white">
              <a href="#" className="block text-sm text-gray-700">
                MYPAGE
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700">
                LOGOUT
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
