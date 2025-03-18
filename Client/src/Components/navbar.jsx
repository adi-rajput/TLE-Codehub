import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookmark, FiUser, FiLogOut } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err.message);
        setUser(null);
      }
    };

    fetchUser();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/user/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl py-3" 
        : "bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-lg py-5"
    }`}>
      <div className="max-w-full px-8 mx-auto sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-3 text-3xl font-black text-transparent transition-all duration-500 bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 hover:from-yellow-200 hover:via-yellow-300 hover:to-orange-400"
            >
              <FaTrophy className="text-yellow-400 text-4xl drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <span className="tracking-tight">ContestHub</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-12 text-xl">
              <Link
                to="/"
                className="text-gray-300 hover:text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-yellow-400 after:transition-all after:duration-300"
              >
                Home
              </Link>
              <Link
                to="/past-contests"
                className="text-gray-300 hover:text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-yellow-400 after:transition-all after:duration-300"
              >
                Past Contests
              </Link>
              <button
                onClick={() => (user ? navigate("/bookmarks") : navigate("/login"))}
                className="flex items-center gap-2 text-gray-300 hover:text-white font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-yellow-400 after:transition-all after:duration-300"
              >
                <FiBookmark className="text-xl" /> Bookmarks
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 px-5 py-2.5 text-white bg-gradient-to-r from-gray-800 to-gray-700 rounded-full border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="bg-yellow-500 rounded-full p-1.5">
                    <FiUser className="text-gray-900" />
                  </div>
                  <span className="text-lg font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2.5 text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FiLogOut /> 
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="relative px-8 py-3 overflow-hidden text-lg font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-xl hover:from-yellow-400 hover:to-yellow-500 group"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 w-3 bg-white/20 skew-x-[20deg] group-hover:w-full transform transition-all duration-500 -z-[1] left-[10%] group-hover:left-0 group-hover:skew-x-0"></div>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-3 pb-4 space-y-2 bg-gray-800 border-t border-gray-700">
            <Link
              to="/"
              className="block px-4 py-3 text-base font-medium text-white transition-all duration-200 rounded-lg hover:bg-gray-700 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/past-contests"
              className="block px-4 py-3 text-base font-medium text-white transition-all duration-200 rounded-lg hover:bg-gray-700 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Past Contests
            </Link>
            <button
              onClick={() => {
                user ? navigate("/bookmarks") : navigate("/login");
                setMenuOpen(false);
              }}
              className="block w-full px-4 py-3 text-base font-medium text-left text-white transition-all duration-200 rounded-lg hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <FiBookmark /> Bookmarks
              </div>
            </button>
            {user ? (
              <>
                <div className="px-4 py-3 text-base font-medium text-white bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiUser /> {user.name}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-base font-medium text-left text-white transition-all duration-200 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <div className="flex items-center gap-2">
                    <FiLogOut /> Logout
                  </div>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-3 text-base font-medium text-white transition-all duration-200 bg-yellow-600 rounded-lg hover:bg-yellow-700"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;