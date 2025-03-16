import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null); // Replace with actual authentication logic
  const navigate = useNavigate();

  const handleBookmarksClick = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate("/bookmarks");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Left Section - Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
        Contest Tracker
      </Link>

      {/* Center Section - Links */}
      <div className="flex items-center gap-6 font-medium text-gray-700">
        <Link to="/" className="transition hover:text-blue-600">Home</Link>
        <Link to="/past-contests" className="transition hover:text-blue-600">Past Contests</Link>
        <button
          onClick={handleBookmarksClick}
          className="transition hover:text-blue-600"
        >
          Bookmarks
        </button>
      </div>

      {/* Right Section - Sign Up / Username */}
      <div>
        {user ? (
          <span className="px-4 py-2 font-semibold text-blue-600 bg-blue-100 rounded-lg">
            {user.name}
          </span>
        ) : (
          <Link
            to="/register"
            className="px-4 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
