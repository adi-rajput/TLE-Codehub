import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/navbar";
import ContestTracker from "./Components/active-contests";
import PastContests from "./Components/PastContests";
import BookmarkedContests from "./Components/bookmark";
import Register from "./Components/Register";
import Login from "./Components/login";

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleBookmarksAccess = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate("/bookmarks");
    }
  };

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<ContestTracker />} />
        <Route path="/past-contests" element={<PastContests />} />
        <Route
          path="/register"
          element={<Register onRegister={(data) => setUser(data)} />}
        />
        <Route
          path="/login"
          element={<Login onLogin={(data) => setUser(data)} />}
        />
        <Route
          path="/bookmarks"
          element={<BookmarkedContests user={user} />}
        />
      </Routes>
    </>
  );
};

export default App;
