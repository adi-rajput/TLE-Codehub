import { useState, useEffect } from "react";
import AddSolutionButton from "./AddSolution";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiExternalLink } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const PastContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 50;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/me", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        console.log("Fetched user data:", data.user.role);
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err.message);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bookmarkResponse = await fetch(
          "http://localhost:3000/user/bookmarks",
          {
            credentials: "include",
          }
        );
        const bookmarkData = await bookmarkResponse.json();
        if (bookmarkResponse.ok && bookmarkData.bookmarks) {
          const bookmarkIds = bookmarkData.bookmarks.map(
            (bookmark) => bookmark._id
          );
          setBookmarked(bookmarkIds);
        }

        const [leetcodeRes, codeforcesRes, codechefRes] = await Promise.all([
          fetch("http://localhost:3000/contests/leetcode-contests"),
          fetch("http://localhost:3000/contests/codeforces-contests"),
          fetch("http://localhost:3000/contests/codechef-contests"),
        ]);

        const [leetcodeData, codeforcesData, codechefData] = await Promise.all([
          leetcodeRes.json(),
          codeforcesRes.json(),
          codechefRes.json(),
        ]);

        const allContests = [
          ...leetcodeData.data,
          ...codeforcesData.data,
          ...codechefData.data,
        ];

        const pastContests = allContests
          .filter((contest) => {
            const endTime = new Date(contest.date);
            endTime.setMinutes(endTime.getMinutes() + contest.duration);
            return endTime < new Date() && contest.status === "past";
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setContests(pastContests);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isBookmarked = (contestId) => bookmarked.includes(contestId);

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

      if (response.ok) {
        if (isBookmarked(contestId)) {
          setBookmarked(bookmarked.filter((id) => id !== contestId));
          toast.success("Bookmark removed successfully!");
        } else {
          setBookmarked([...bookmarked, contestId]);
          toast.success("Bookmark added successfully!");
        }
      } else {
        const data = await response.json();
        console.error("Error toggling bookmark:", data.message);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const filteredContests = contests.filter((contest) => {
    return (
      (selectedPlatform === "All" || contest.platform === selectedPlatform) &&
      (selectedDuration === "All" ||
        (selectedDuration === "Short" && contest.duration <= 120) ||
        (selectedDuration === "Medium" &&
          contest.duration > 120 &&
          contest.duration <= 240) ||
        (selectedDuration === "Long" && contest.duration > 240)) &&
      contest.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = filteredContests.slice(
    indexOfFirstContest,
    indexOfLastContest
  );

  const getPlatformStyles = (platform) => {
    switch (platform) {
      case "LeetCode":
        return "bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 shadow-yellow-300/50";
      case "Codeforces":
        return "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-purple-300/50";
      case "CodeChef":
        return "bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-orange-300/50";
      case "AtCoder":
        return "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-blue-300/50";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-gray-300/50";
    }
  };

  return (
    <div className="min-h-screen p-6 text-gray-800 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="mb-8 text-5xl font-bold text-center text-transparent mt-18 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
        Past Contests
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mx-auto mb-8 max-w-[95%]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contests..."
            className="w-64 px-4 py-3 pl-10 text-lg transition-all border-0 shadow-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>

        <select
          className="px-4 py-3 text-lg transition-all bg-white border-0 shadow-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          <option value="All">All Platforms</option>
          <option value="LeetCode">LeetCode</option>
          <option value="Codeforces">Codeforces</option>
          <option value="CodeChef">CodeChef</option>
          <option value="AtCoder">AtCoder</option>
        </select>

        <select
          className="px-4 py-3 text-lg transition-all bg-white border-0 shadow-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
        >
          <option value="All">All Durations</option>
          <option value="Short">Short (&lt; 2 hours)</option>
          <option value="Medium">Medium (2-4 hours)</option>
          <option value="Long">Long (&gt; 4 hours)</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16">
          <div className="w-20 h-20 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-6 text-2xl font-medium text-gray-600">
            Loading contests and bookmarks...
          </p>
        </div>
      ) : (
        <div className="max-w-[98%] mx-auto overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100">
          {/* Header with animated gradient background */}
          <div className="hidden md:grid grid-cols-[70px_2.7fr_1fr_1.3fr_1fr_130px_110px_80px] gap-4 px-8 py-5 text-lg font-medium text-gray-100 bg-gradient-to-r from-gray-800 to-gray-700">
            <span className="flex items-center">#</span>
            <span className="flex items-center">Contest</span>
            <span className="flex items-center">Platform</span>
            <span className="flex items-center">Start Time</span>
            <span className="flex items-center">Duration</span>
            <span className="flex items-center">Action</span>
            <span className="flex items-center">Solution</span>
            <span className="flex items-center">Bookmark</span>
          </div>

          {/* Contest listing with hover effects */}
          {currentContests.length > 0 ? (
            currentContests.map((contest, index) => (
              <div
                key={index}
                className="grid items-center grid-cols-[70px_2.5fr_1fr_1.3fr_1.17fr_130px_130px_80px] gap-3 px-8 py-6 border-b border-gray-200 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md"
              >
                <span className="items-center justify-center hidden w-8 h-8 text-lg font-medium text-white transition-colors bg-gray-700 rounded-full md:flex group-hover:bg-blue-600">
                  {indexOfFirstContest + index + 1}
                </span>

                <div>
                  <a
                    href={contest.contest_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-gray-800 transition-colors hover:text-blue-600"
                  >
                    {contest.title}
                  </a>
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

                <span className="flex items-center text-lg text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {new Date(contest.date).toLocaleString()}
                </span>

                <span className="flex items-center text-xl text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {contest.duration} min
                </span>

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

                {contest.solutionLink ? (
                  <a
                    href={contest.solutionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-12 px-4 text-lg font-semibold text-white transition-all duration-300 transform rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 hover:shadow-xl hover:shadow-green-200/40 hover:scale-105 group"
                  >
                    <svg 
                      className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Solution
                  </a>
                ) : user?.role?.toLowerCase() === "admin" ? (
                  <div className="w-full h-12">
                    <AddSolutionButton contest={contest} user={user} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-12 px-4 text-lg font-medium text-gray-400 transition-all duration-200 cursor-default rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 group">
                    <svg 
                      className="w-5 h-5 mr-2 text-gray-400 opacity-70" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    No Solution
                  </div>
                )}

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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-16">
              <span className="text-7xl">🔍</span>
              <p className="mt-6 text-2xl text-center text-gray-600">
                No contests found matching your criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedPlatform("All");
                  setSelectedDuration("All");
                }}
                className="px-6 py-3 mt-6 text-lg font-semibold text-white transition-all transform shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl hover:from-blue-500 hover:to-blue-700 hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-6 py-3 text-lg font-medium text-white transition-all shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl disabled:opacity-50 hover:from-gray-600 hover:to-gray-700"
        >
          Previous
        </button>

        <span className="flex items-center px-4 py-2 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow">
          {filteredContests.length === 0
            ? "Loading..."
            : `Page ${currentPage} of ${Math.ceil(
                filteredContests.length / contestsPerPage
              )}`}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredContests.length / contestsPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={
            currentPage >= Math.ceil(filteredContests.length / contestsPerPage)
          }
          className="px-6 py-3 text-lg font-medium text-white transition-all shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl disabled:opacity-50 hover:from-gray-600 hover:to-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PastContests;