import { useState } from "react";
import axios from "axios";

const platformPlaylists = {
  Codeforces:
    "https://www.youtube.com/embed/videoseries?list=PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB",
  LeetCode:
    "https://www.youtube.com/embed/videoseries?list=PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr",
  CodeChef:
    "https://www.youtube.com/embed/videoseries?list=PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr",
};

const AddSolutionButton = ({ contest, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [showPlaylist, setShowPlaylist] = useState(false);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVideo("");
  };

  const handleAddSolution = async () => {
    if (!selectedVideo.trim()) {
      alert("Please paste a video link.");
      return;
    }

    try {
      console.log("Adding solution for contest:", contest._id);

      const response = await axios.put(
        `http://localhost:3000/user/add-solution-link/${contest._id}`,
        { solutionLink: selectedVideo },
        {
          withCredentials: true, // ✅ Ensures cookies (token) are sent
          headers: { "Content-Type": "application/json" }, // ❌ No need for Authorization header
        }
      );

      alert("Solution added successfully!");
      setShowPlaylist(false); 
      window.location.reload()
    } catch (error) {
      console.error(
        "Error adding solution:",
        error.response?.data || error.message
      );
      alert("Failed to add solution.");
    }
  };

  return (
    <div>
      {user?.role?.toLowerCase() === "admin" && (
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 text-white transition-all bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-700"
        >
          Add Sol...
        </button>
      )}

      {showModal && contest.platform in platformPlaylists && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-[90%] max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Select a Video for {contest.platform}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <iframe
              className="w-full h-64 border border-gray-300 rounded-lg"
              src={platformPlaylists[contest.platform]}
              title={`${contest.platform} Playlist`}
              allowFullScreen
            ></iframe>

            <input
              type="text"
              placeholder="Paste selected video URL here..."
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              className="w-full px-4 py-2 mt-4 border rounded-lg"
            />

            <button
              onClick={handleAddSolution}
              className="w-full px-4 py-2 mt-4 text-white transition-all bg-green-600 rounded-lg cursor-pointer hover:bg-green-700"
            >
              Add Solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSolutionButton;
