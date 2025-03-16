import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookmark, FiUser } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa"; // Trophy icon for ContestHub logo

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleBookmarksClick = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate("/bookmarks");
    }
  };

  return (
    <nav className="flex items-center justify-between px-12 py-4 bg-gray-900 shadow-md">
      {/* Left Section - Logo */}
      <Link to="/" className="flex items-center gap-3 text-3xl font-bold text-white transition-all hover:text-gray-400">
        <FaTrophy className="text-yellow-400" /> ContestHub
      </Link>

      {/* Center Section - Navigation Links */}
      <div className="flex items-center gap-8 text-lg font-medium text-gray-300">
        <Link to="/" className="transition-all hover:text-white">Home</Link>
        <Link to="/past-contests" className="transition-all hover:text-white">Past Contests</Link>
        <button
          onClick={handleBookmarksClick}
          className="flex items-center gap-2 transition-all hover:text-white"
        >
          <FiBookmark className="text-xl" /> Bookmarks
        </button>
      </div>

      {/* Right Section - Authentication */}
      <div className="flex items-center">
        {user ? (
          <span className="flex items-center gap-2 px-5 py-2 text-lg font-semibold text-gray-900 bg-gray-200 rounded-lg shadow-md">
            <FiUser className="text-xl" /> {user.name}
          </span>
        ) : (
          <Link
            to="/register"
            className="px-6 py-2.5 text-lg font-semibold text-gray-900 transition-all bg-gray-200 rounded-lg shadow-md hover:bg-gray-300"
          >
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
