import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookmark, FiUser } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/me", {
          method: "GET",
          credentials: "include", // ✅ Ensures cookies are sent
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUser(data); // ✅ Set user state if successful
      } catch (err) {
        console.error("Failed to fetch user:", err.message);
        setUser(null); // ✅ Clear user on error
      }
    };

    fetchUser(); // ✅ Call function on mount
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
    <nav className="flex items-center justify-between px-12 py-4 bg-gray-900 shadow-md">
      <Link to="/" className="flex items-center gap-3 text-3xl font-bold text-white transition-all hover:text-gray-400">
        <FaTrophy className="text-yellow-400" /> ContestHub
      </Link>

      <div className="flex items-center gap-8 text-lg font-medium text-gray-300">
        <Link to="/" className="transition-all hover:text-white">Home</Link>
        <Link to="/past-contests" className="transition-all hover:text-white">Past Contests</Link>
        <button
          onClick={() => (user ? navigate("/bookmarks") : navigate("/login"))}
          className="flex items-center gap-2 transition-all cursor-pointer hover:text-white"
        >
          <FiBookmark className="text-xl" /> Bookmarks
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-5 py-2 text-lg font-semibold text-gray-900 bg-gray-200 rounded-lg shadow-md">
              <FiUser className="text-xl" /> {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-5 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2.5 text-lg font-semibold text-gray-900 transition-all bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
