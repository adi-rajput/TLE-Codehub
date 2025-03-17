import { useState, useEffect } from "react";
import AddSolutionButton from "./AddSolution";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//toast.configure();

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

  return (
    <div className="min-h-screen p-6 text-gray-800 bg-gray-100">
      <h1 className="mb-6 text-4xl font-bold text-center text-black">
        Past Contests
      </h1>

      <div className="flex flex-wrap gap-4 mx-auto mb-6 max-w-[95%]">
        <input
          type="text"
          placeholder="Search contests..."
          className="px-4 py-2 border rounded-lg shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg shadow-sm"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          <option value="All">All Platforms</option>
          <option value="LeetCode">LeetCode</option>
          <option value="Codeforces">Codeforces</option>
          <option value="CodeChef">CodeChef</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg shadow-sm"
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
        <p className="text-lg text-center text-gray-600">
          Loading contests and bookmarks...
        </p>
      ) : (
        <div className="max-w-[95%] mx-auto overflow-hidden bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-[50px_2.5fr_1fr_1.3fr_1fr_100px_100px_80px] gap-3 px-8 py-5 text-lg font-semibold text-white bg-gray-700">
            <span>#</span>
            <span>Contest</span>
            <span>Platform</span>
            <span>Start Time</span>
            <span>Duration</span>
            <span>Action</span>
            <span>Solution</span>
            <span>Bookmark</span>
          </div>

          {currentContests.length > 0 ? (
            currentContests.map((contest, index) => (
              <div
                key={index}
                className="grid items-center grid-cols-[50px_2.5fr_1fr_1.3fr_1fr_100px_100px_80px] gap-3 px-8 py-5 border-b border-gray-300 rounded-lg transition-all shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-[2px]"
              >
                <span className="w-8 text-xl font-medium text-center text-gray-700">
                  {indexOfFirstContest + index + 1}
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
                      ? "bg-orange-200"
                      : "bg-gray-50"
                  }`}
                >
                  {contest.platform}
                </span>

                <span className="text-lg text-gray-600">
                  {new Date(contest.date).toLocaleString()}
                </span>

                <span className="text-xl text-gray-600">
                  {contest.duration} min
                </span>

                <a
                  href={contest.contest_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-1.5 text-lg font-semibold text-center text-white transition-all bg-black rounded-lg hover:bg-blue-400"
                >
                  Visit
                </a>

                {contest.solutionLink ? (
                  <a
                    href={contest.solutionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-1.5 text-lg font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Solution
                  </a>
                ) : user?.role?.toLowerCase() === "admin" ? (
                  <AddSolutionButton contest={contest} user={user} />
                ) : (
                  <span className="text-center text-gray-500">N/A</span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(contest._id);
                  }}
                  className={`p-2 text-2xl rounded-md ${
                    isBookmarked(contest._id)
                      ? "text-yellow-500"
                      : "text-gray-400"
                  } hover:scale-110 transition-transform cursor-pointer`}
                  aria-label={
                    isBookmarked(contest._id)
                      ? "Remove bookmark"
                      : "Add bookmark"
                  }
                >
                  ★
                </button>
              </div>
            ))
          ) : (
            <p className="p-6 text-lg text-center text-gray-600">
              No past contests found.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-5 py-2 font-medium text-white bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-800"
        >
          Previous
        </button>

        <span className="text-lg font-semibold">
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
          className="px-5 py-2 font-medium text-white bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PastContests;
