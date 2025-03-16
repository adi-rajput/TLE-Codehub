import { useState, useEffect } from "react";

const ContestTracker = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);

  // Fetch contests
  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/contests/active-contests");
      const data = await response.json();

      const filteredData = data.data
        .filter((contest) => contest.status === "upcoming" || contest.status === "ongoing")
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setContests(filteredData);
      setFilteredContests(filteredData);
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookmarks from API
  const fetchBookmarks = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/bookmarks");
      const data = await response.json();
      // Store the array of bookmark IDs instead of objects for easier checking
      setBookmarked(data.bookmarks?.map(bookmark => bookmark._id) || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  useEffect(() => {
    fetchContests();
    fetchBookmarks();
  }, []);

  // Handle platform filter change
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
      setFilteredContests(contests.filter((contest) => updatedPlatforms.includes(contest.platform)));
    }
  };

  // Handle bookmarking (calls API and updates local state)
  const toggleBookmark = async (contestId) => {
    try {
      const response = await fetch(`http://localhost:3000/user/toggle-bookmark/${contestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" // Include cookies if using session-based auth
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update local bookmark state immediately without refetching
        if (isBookmarked(contestId)) {
          setBookmarked(bookmarked.filter(id => id !== contestId));
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

  // Check if a contest is bookmarked using the ID directly
  const isBookmarked = (contestId) => bookmarked.includes(contestId);

  // Get remaining time
  const getRemainingTime = (startTime, status) => {
    if (status === "ongoing") {
      return <span className="text-lg font-semibold text-orange-500">Ongoing</span>;
    }

    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0)
      return <span className="text-lg font-semibold text-orange-500">Ongoing</span>;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return (
      <span className="text-lg font-semibold text-green-500">
        {days > 0 ? `${days}d ` : ""} {hours}h {minutes}m
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 text-gray-800 bg-gray-100">
      <div className="flex flex-col items-center w-full mb-6">
        <h1 className="mb-4 text-4xl font-bold text-black">Contest Tracker</h1>
        <button
          onClick={fetchContests}
          className="px-2 py-1 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Refresh 
        </button>
      </div>

      <div className="flex justify-center gap-6 mb-6">
        {["LeetCode", "Codeforces", "CodeChef"].map((platform) => (
          <label
            key={platform}
            className="flex items-center space-x-2 text-lg font-medium cursor-pointer"
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

      {/* Active Contests Section */}
      {loading ? (
        <p className="text-lg text-center text-gray-600">Loading contests...</p>
      ) : (
        <div className="max-w-[95%] mx-auto overflow-hidden bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-[50px_3fr_1.2fr_.9fr_1.2fr_1.15fr_87px_87px] gap-3 px-8 py-5 text-lg font-semibold text-white bg-gray-700">
            <span>#</span>
            <span>Contest</span>
            <span>Platform</span>
            <span>Status</span>
            <span>Time Left</span>
            <span>Duration</span>
            <span>Action</span>
            <span>Bookmark</span>
          </div>

          {filteredContests.length > 0 ? (
            filteredContests.map((contest, index) => (
              <div
                key={index}
                className="grid items-center grid-cols-[50px_3fr_1.2fr_1fr_1.2fr_1fr_110px_90px] gap-3 px-8 py-5 border-b border-gray-300 rounded-lg transition-all shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-[2px]"
              >
                <span className="w-8 text-xl font-medium text-center text-gray-700">
                  {index + 1}
                </span>

                <a
                  href={contest.contest_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-black hover:underline"
                >
                  {contest.title}
                </a>

                <span
                  className={`px-2 py-1 w-28 text-center text-lg font-medium rounded-md ${
                    contest.platform === "LeetCode"
                      ? "bg-yellow-200"
                      : contest.platform === "Codeforces"
                      ? "bg-purple-200"
                      : contest.platform === "CodeChef"
                      ? "bg-orange-200 "
                      : "bg-gray-50 "
                  }`}
                >
                  {contest.platform}
                </span>

                <span
                  className={`inline-flex items-center justify-center w-fit px-2.5 py-1 text-sm font-semibold rounded-md ${
                    contest.status === "upcoming"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {contest.status === "upcoming" ? "Upcoming" : "Ongoing"}
                </span>

                <span>{getRemainingTime(contest.date, contest.status)}</span>

                <span className="text-xl text-gray-600">{contest.duration} min</span>

                <a
                  href={contest.contest_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-1.5 text-lg font-semibold text-center text-white transition-all bg-black rounded-lg hover:bg-blue-400"
                >
                  Visit
                </a>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    toggleBookmark(contest._id);
                  }}
                  className={`p-2 text-2xl rounded-md ${
                    isBookmarked(contest._id) ? "text-yellow-500" : "text-gray-400"
                  } hover:scale-110 transition-transform`}
                >
                  ★
                </button>
              </div>
            ))
          ) : (
            <p className="p-6 text-lg text-center text-gray-600">No upcoming or ongoing contests.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContestTracker;