import { useState, useEffect } from "react";

const BookmarkedContests = () => {
  const [bookmarkedContests, setBookmarkedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 50;

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");

  // Fetch Bookmarked Contests
  useEffect(() => {
    const fetchBookmarkedContests = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/user/bookmarks", {
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok && data.bookmarks) {
          setBookmarkedContests(data.bookmarks);
        } else {
          console.error("Error fetching bookmarks:", data.message);
        }
      } catch (error) {
        console.error("Error fetching bookmarked contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedContests();
  }, []);

  // Handle Unbookmarking
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
        setBookmarkedContests((prevContests) =>
          prevContests.filter((contest) => contest._id !== contestId)
        );
      } else {
        const data = await response.json();
        console.error("Error toggling bookmark:", data.message);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Apply Filters
  const filteredContests = bookmarkedContests.filter((contest) => {
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

  // Get current page contests
  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = filteredContests.slice(
    indexOfFirstContest,
    indexOfLastContest
  );

  return (
    <div className="min-h-screen p-6 text-gray-800 bg-gray-100">
      <h1 className="mb-6 text-4xl font-bold text-center text-black">
        Bookmarked Contests
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mx-auto mb-6 max-w-[95%]">
        {/* Search */}
        <input
          type="text"
          placeholder="Search contests..."
          className="px-4 py-2 border rounded-lg shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Platform Filter */}
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

        {/* Duration Filter */}
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
          Loading bookmarked contests...
        </p>
      ) : (
        <div className="max-w-[95%] mx-auto overflow-hidden bg-white rounded-lg shadow-md">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_2.5fr_0.9fr_1fr_1fr_120px_80px_100px_80px] gap-3 px-8 py-5 text-lg font-semibold text-white bg-gray-700">
            <span>#</span>
            <span>Contest</span>
            <span>Platform</span>
            <span>Start Time</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Action</span>
            <span>Solution</span>
            <span>Bookmark</span>
            
          </div>

          {/* Bookmarked Contests List */}
          {currentContests.length > 0 ? (
            currentContests.map((contest, index) => {
              const startTime = new Date(contest.date);
              const endTime = new Date(startTime);
              endTime.setMinutes(endTime.getMinutes() + contest.duration);

              let status = "Upcoming";
              if (new Date() >= startTime && new Date() <= endTime) {
                status = "Ongoing";
              } else if (new Date() > endTime) {
                status = "Past";
              }

              return (
                <div
                  key={index}
                  className="grid items-center grid-cols-[50px_2.5fr_1fr_1.2fr_1.1fr_120px_100px_100px_80px] gap-3 px-8 py-5 border-b border-gray-300 rounded-lg transition-all shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-[2px]"
                >
                  {/* Index */}
                  <span className="w-8 text-xl font-medium text-center text-gray-700">
                    {indexOfFirstContest + index + 1}
                  </span>

                  {/* Contest Title */}
                  <a
                    href={contest.contest_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-black hover:underline"
                  >
                    {contest.title}
                  </a>

                  <span
                    className={`w-28 py-1 text-lg font-medium rounded-md text-black text-center ${
                      contest.platform === "LeetCode"
                        ? "bg-yellow-300"
                        : contest.platform === "Codeforces"
                        ? "bg-purple-300"
                        : contest.platform === "CodeChef"
                        ? "bg-orange-300"
                        : "bg-gray-400"
                    }`}
                  >
                    {contest.platform}
                  </span>

                  {/* Start Time */}
                  <span className="text-lg text-gray-600">
                    {startTime.toLocaleString()}
                  </span>

                  {/* Duration */}
                  <span className="text-xl text-gray-600">
                    {contest.duration} min
                  </span>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 text-lg font-medium rounded-md text-center ${
                      status === "Upcoming"
                        ? "bg-green-200 text-green-800"
                        : status === "Ongoing"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {status}
                  </span>

                  {/* Visit Button */}
                  <a
                    href={contest.contest_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-1.5 text-lg font-semibold text-white bg-black rounded-lg hover:bg-blue-400"
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
                  ) : (
                    <span className="text-center text-gray-500">N/A</span>
                  )}

                  {/* Unbookmark Button */}
                  <button onClick={() => toggleBookmark(contest._id)}>★</button>
                </div>
              );
            })
          ) : (
            <p className="p-6 text-lg text-center text-gray-600">
              No bookmarked contests found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarkedContests;
