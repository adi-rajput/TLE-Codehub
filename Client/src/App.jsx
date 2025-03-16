import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/navbar";
import ContestTracker from "./Components/active-contests";
// import PastContests from "./Components/PastContests";
// import Bookmarks from "./Components/Bookmarks";
import Register from "./Components/Register";

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
        
      </Routes>
    </>
  );
};

export default App;
