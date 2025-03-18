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
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      console.log("Adding solution for contest:", contest._id);

      const response = await axios.put(
        `http://localhost:3000/user/add-solution-link/${contest._id}`,
        { solutionLink: selectedVideo },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setIsLoading(false);
      // Show success message
      const successMessage = document.getElementById("success-toast");
      if (successMessage) {
        successMessage.classList.remove("hidden");
        setTimeout(() => {
          successMessage.classList.add("hidden");
          window.location.reload();
        }, 2000);
      } else {
        alert("Solution added successfully!");
        window.location.reload();
      }
      setShowPlaylist(false);
    } catch (error) {
      setIsLoading(false);
      console.error(
        "Error adding solution:",
        error.response?.data || error.message
      );
      alert("Failed to add solution.");
    }
  };

  // Get platform-specific styles
  const getPlatformColor = () => {
    switch (contest.platform) {
      case "Codeforces":
        return "from-red-500 to-red-700 hover:from-red-400 hover:to-red-600";
      case "LeetCode":
        return "from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600";
      case "CodeChef":
        return "from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600";
      default:
        return "from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600";
    }
  };

  return (
    <div className="w-full h-12">
      {user?.role?.toLowerCase() === "admin" && (
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center px-4 py-1 text-sm font-semibold text-black transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
        >
          ADD SOLUTION
        </button>
      )}

      {showModal && contest.platform in platformPlaylists && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="relative p-6 bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl border border-gray-100 animate-fadeIn">
            {/* Success Toast */}
            <div
              id="success-toast"
              className="absolute hidden p-4 text-green-700 bg-green-100 border-l-4 border-green-500 rounded shadow-md top-4 right-4 left-4 animate-fadeIn"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <p>Solution added successfully!</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              {/* <h2 className="text-2xl font-bold text-gray-800">
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-2 bg-${
                    contest.platform === "Codeforces"
                      ? "red"
                      : contest.platform === "LeetCode"
                      ? "yellow"
                      : "blue"
                  }-500`}
                ></span>
                {contest.platform} Solution
              </h2> */}

              <div className="flex flex-col items-start">
                <h2 className="text-2xl font-bold text-gray-800">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 bg-${
                      contest.platform === "Codeforces"
                        ? "red"
                        : contest.platform === "LeetCode"
                        ? "yellow"
                        : "blue"
                    }-500`}
                  ></span>
                  {contest.platform} Solution
                  <div className="mt-1 text-lg font-medium text-gray-600">
                    {contest.name}
                  </div>
                </h2>

                <span className="mt-1 ml-6 text-lg font-medium text-gray-600 ">
                  {contest.title}
                </span>
              </div>
              <button
                onClick={handleCloseModal}
                className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="relative overflow-hidden border border-gray-200 shadow-md rounded-xl">
              <iframe
                className="w-full border-0 h-80"
                src={platformPlaylists[contest.platform]}
                title={`${contest.platform} Playlist`}
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Selected Video URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Paste selected video URL here..."
                  value={selectedVideo}
                  onChange={(e) => setSelectedVideo(e.target.value)}
                  className="w-full px-4 py-3 pl-10 transition-all border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex mt-6 space-x-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSolution}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 font-medium text-white transition-all rounded-xl bg-gradient-to-r ${getPlatformColor()} shadow-md hover:shadow-lg flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Add Solution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSolutionButton;
