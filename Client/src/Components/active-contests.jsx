import { useState, useEffect } from "react";
import {
  FiRefreshCw,
  FiExternalLink,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
const ContestTracker = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedPlatforms")) || [];
  });
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchContests = async () => {
    setSelectedPlatforms([]);
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await fetch(
        "http://localhost:3000/contests/active-contests"
      );
      const data = await response.json();

      const filteredData = data.data
        .filter(
          (contest) =>
            contest.status === "upcoming" || contest.status === "ongoing"
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setContests(filteredData);
      setFilteredContests(filteredData);
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500); // Add a small delay for animation
    }
  };
  const fetchBookmarks = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/bookmarks", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data.bookmarks)) {
        setBookmarked(data.bookmarks.map((bookmark) => bookmark._id));
      } else {
        console.error("Invalid bookmarks format:", data);
        setBookmarked([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setBookmarked([]);
    }
  };
  useEffect(() => {
    fetchContests();
    fetchBookmarks();
    setSelectedPlatforms([]);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedPlatforms",
      JSON.stringify(selectedPlatforms)
    );
  }, [selectedPlatforms]);

  const handlePlatformChange = (platform) => {
    let updatedPlatforms = [...selectedPlatforms];

    if (updatedPlatforms.includes(platform)) {
      updatedPlatforms = updatedPlatforms.filter((p) => p !== platform);
    } else {
      updatedPlatforms.push(platform);
    }

    setSelectedPlatforms(updatedPlatforms);

    if (updatedPlatforms.length === 0) {
      setFilteredContests(contests);
    } else {
      setFilteredContests(
        contests.filter((contest) =>
          updatedPlatforms.includes(contest.platform)
        )
      );
    }
  };

  // Handle bookmarking (calls API and updates local state)
  const toggleBookmark = async (contestId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/toggle-bookmark/${contestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update local bookmark state immediately without refetching
        if (isBookmarked(contestId)) {
          setBookmarked(bookmarked.filter((id) => id !== contestId));
        } else {
          setBookmarked([...bookmarked, contestId]);
        }
      } else {
        console.error("Error toggling bookmark:", data.message);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };
  const isBookmarked = (contestId) => bookmarked.includes(contestId);
  const getRemainingTime = (startTime, status) => {
    if (status === "ongoing") {
      return (
        <span className="flex items-center gap-2 text-lg font-semibold text-orange-500">
          <FiClock className="animate-pulse" /> Live Now
        </span>
      );
    }

    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0)
      return (
        <span className="flex items-center gap-2 text-lg font-semibold text-orange-500">
          <FiClock className="animate-pulse" /> Live Now
        </span>
      );

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return (
      <span className="flex items-center gap-2 text-lg font-semibold text-green-500">
        <FiCalendar />
        {days > 0 ? `${days}d ` : ""} {hours}h {minutes}m
      </span>
    );
  };

  // Format date & time
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get platform-specific styling
  const getPlatformStyles = (platform) => {
    switch (platform) {
      case "LeetCode":
        return "bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 shadow-yellow-300/50";
      case "Codeforces":
        return "bg-gradient-to-r from-orange-500 to-orange-400  text-white shadow-purple-300/50";
      case "CodeChef":
        return "bg-gradient-to-r from-purple-500 to-purple-400  text-white shadow-orange-300/50";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-gray-300/50";
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 mt-16 text-gray-800 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-2006">
      <div className="flex flex-col items-center w-full max-w-6xl mb-8">
        <h1 className="mb-6 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Contest Tracker
        </h1>

        <div className="flex flex-wrap items-center justify-center w-full gap-4">
          <button
            onClick={fetchContests}
            disabled={refreshing}
            className={`px-5 py-2.5 flex items-center gap-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-blue-300/50 transition-all duration-300 ${
              refreshing ? "opacity-75" : "hover:-translate-y-1"
            }`}
          >
            <FiRefreshCw className={`${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Contests"}
          </button>

          <div className="flex flex-wrap justify-center gap-3 ml-4">
            {["LeetCode", "Codeforces", "CodeChef"].map((platform) => (
              <label
                key={platform}
                className={`flex items-center space-x-2 px-4 py-2 text-lg font-medium rounded-full cursor-pointer transition-all duration-300 border-2 ${
                  selectedPlatforms.includes(platform)
                    ? `border-blue-500 bg-blue-50 text-blue-700 shadow-md`
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <input
                  type="checkbox"
                  value={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                  className="w-5 h-5 text-blue-600 bg-gray-200 border-gray-300 rounded-md focus:ring-blue-500"
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center w-full p-12">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-xl text-gray-600">Loading your contests...</p>
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto overflow-hidden bg-white shadow-xl rounded-2xl">
          <div className="hidden md:grid grid-cols-[50px_3fr_1.2fr_.9fr_1.2fr_1.15fr_80px_auto] gap-4 px-8 py-5 text-lg font-medium text-gray-100 bg-gradient-to-r from-gray-800 to-gray-700">
            <span>#</span>
            <span>Contest</span>
            <span>Platform</span>
            <span>Status</span>
            <span>Time Left</span>
            <span>Duration</span>
            <span>Action</span>
            <span>Save</span>
          </div>

          {filteredContests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredContests.map((contest, index) => (
                <div
                  key={index}
                  className="grid md:grid-cols-[50px_3fr_1.2fr_1fr_1.2fr_1fr_auto_auto] gap-4 px-4 md:px-8 py-6 transition-all hover:bg-blue-50 group"
                >
                  <span className="items-center justify-center hidden w-8 h-8 text-lg font-medium text-white transition-colors bg-gray-700 rounded-full md:flex group-hover:bg-blue-600">
                    {index + 1}
                  </span>

                  <div className="flex flex-col col-span-2 md:col-span-1">
                    <a
                      href={contest.contest_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-gray-800 transition-colors hover:text-blue-600"
                    >
                      {contest.title}
                    </a>
                    <span className="mt-1 text-sm text-gray-500">
                      {formatDateTime(contest.date)}
                    </span>
                  </div>

                  <div className="items-center justify-start md:flex">
                    <span
                      className={`px-4 py-1.5 text-center text-lg font-medium rounded-full shadow-md ${getPlatformStyles(
                        contest.platform
                      )}`}
                    >
                      {contest.platform}
                    </span>
                  </div>

                  <div className="items-center md:flex">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full ${
                        contest.status === "upcoming"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-orange-100 text-orange-700 border border-orange-200"
                      }`}
                    >
                      {contest.status === "upcoming" ? "Upcoming" : "Ongoing"}
                    </span>
                  </div>

                  <div className="items-center md:flex">
                    {getRemainingTime(contest.date, contest.status)}
                  </div>

                  <div className="items-center md:flex">
                    <span className="flex items-center gap-1.5 text-lg text-gray-700">
                      <FiClock className="text-gray-500" /> {contest.duration}{" "}
                      min
                    </span>
                  </div>

                  <div className="items-center md:flex">
                    <a
                      href={contest.contest_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-5 py-2 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-md hover:shadow-blue-200/50 hover:-translate-y-0.5 transition-all"
                    >
                      <FiExternalLink className="mr-1.5" /> Visit
                    </a>
                  </div>

                  <div className="items-center justify-center md:flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(contest._id);
                      }}
                      className={`p-2 text-2xl rounded-full transition-all duration-300 hover:scale-110 ${
                        isBookmarked(contest._id)
                          ? "text-yellow-500 bg-yellow-50"
                          : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-50"
                      }`}
                      aria-label={
                        isBookmarked(contest._id)
                          ? "Remove from bookmarks"
                          : "Add to bookmarks"
                      }
                    >
                      <FaStar
                        className={
                          isBookmarked(contest._id) ? "drop-shadow-md" : ""
                        }
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16">
              <svg
                className="w-20 h-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="mt-4 text-xl text-gray-500">
                No upcoming or ongoing contests found.
              </p>
              <p className="text-gray-400">
                Try refreshing or changing your filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContestTracker;
