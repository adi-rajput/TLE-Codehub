import { useState, useEffect } from "react";
import { FaStar, FaSearch, FaFilter, FaClock, FaCode, FaExternalLinkAlt } from "react-icons/fa";

const BookmarkedContests = () => {
  const [bookmarkedContests, setBookmarkedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 50;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");

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

  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = filteredContests.slice(
    indexOfFirstContest,
    indexOfLastContest
  );
  
  const platformColors = {
    LeetCode: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
      icon: "🏆"
    },
    Codeforces: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-300",
      icon: "⚡"
    },
    CodeChef: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
      icon: "🍳"
    }
  };

  const statusStyles = {
    Upcoming: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-300"
    },
    Ongoing: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300"
    },
    Past: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300"
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mt-20 mb-2 text-4xl font-bold text-gray-900">
            Bookmarked Contests
          </h1>
          <p className="text-gray-600">Keep track of your favorite coding competitions</p>
        </div>

        <div className="p-6 mb-8 bg-white shadow-xl rounded-xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative flex-grow w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contests..."
                className="w-full py-3 pl-10 pr-4 transition border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col w-full gap-4 sm:flex-row md:w-auto">
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  className="w-full py-3 pl-10 pr-8 transition border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="All">All Platforms</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="CodeChef">CodeChef</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <select
                  className="w-full py-3 pl-10 pr-8 transition border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="All">All Durations</option>
                  <option value="Short">Short (&lt; 2 hours)</option>
                  <option value="Medium">Medium (2-4 hours)</option>
                  <option value="Long">Long (&gt; 4 hours)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white shadow-lg rounded-xl">
            <div className="inline-block w-8 h-8 mb-4 border-4 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
            <p className="text-lg text-gray-600">Loading your bookmarked contests...</p>
          </div>
        ) : currentContests.length > 0 ? (
          <div className="space-y-4">
            {currentContests.map((contest, index) => {
              const startTime = new Date(contest.date);
              const endTime = new Date(startTime);
              endTime.setMinutes(endTime.getMinutes() + contest.duration);

              let status = "Upcoming";
              if (new Date() >= startTime && new Date() <= endTime) {
                status = "Ongoing";
              } else if (new Date() > endTime) {
                status = "Past";
              }

              const platformStyle = platformColors[contest.platform] || {
                bg: "bg-gray-100",
                text: "text-gray-800",
                border: "border-gray-300",
                icon: "🔗"
              };
              
              const statusStyle = statusStyles[status];

              return (
                <div
                  key={index}
                  className="overflow-hidden transition transform bg-white border border-gray-100 shadow-md rounded-xl hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex-grow p-5 lg:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                            {indexOfFirstContest + index + 1}
                          </span>
                          
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${platformStyle.bg} ${platformStyle.text} border ${platformStyle.border}`}>
                            <span className="mr-1">{platformStyle.icon}</span>
                            {contest.platform}
                          </div>
                          
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                            {status}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleBookmark(contest._id)}
                          className="p-2 text-yellow-500 transition rounded-full hover:text-yellow-600 hover:bg-yellow-50"
                        >
                          <FaStar className="text-2xl drop-shadow-sm" />
                        </button>
                      </div>
                      
                      <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
                        {contest.title}
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Start Time</p>
                            <p className="font-medium">{startTime.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 mr-3 bg-green-100 rounded-full">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">{contest.duration} minutes</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row border-gray-100 divide-x lg:flex-col lg:border-l lg:divide-x-0 lg:divide-y">
                      <a
                        href={contest.contest_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center flex-1 p-4 text-blue-600 transition lg:flex-none hover:bg-blue-50 group"
                      >
                        <FaExternalLinkAlt className="mr-2" />
                        <span className="font-medium">Visit</span>
                      </a>
                      
                      {contest.solutionLink ? (
                        <a
                          href={contest.solutionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center flex-1 p-4 text-green-600 transition lg:flex-none hover:bg-green-50 group"
                        >
                          <FaCode className="mr-2" />
                          <span className="font-medium">Solution</span>
                        </a>
                      ) : (
                        <div className="flex items-center justify-center flex-1 p-4 text-gray-400 lg:flex-none">
                          <FaCode className="mr-2" />
                          <span className="font-medium">No Solution</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredContests.length > contestsPerPage && (
              <div className="flex items-center justify-between p-4 mt-6 bg-white rounded-lg shadow">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredContests.length / contestsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(filteredContests.length / contestsPerPage)
                  }
                  className={`px-4 py-2 rounded ${
                    currentPage === Math.ceil(filteredContests.length / contestsPerPage)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center bg-white shadow-lg rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full">
              <FaStar className="text-2xl text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-900">No bookmarked contests</h3>
            <p className="text-gray-600">You haven't bookmarked any contests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkedContests;