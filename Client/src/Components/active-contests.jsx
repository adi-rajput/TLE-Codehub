import { useState, useEffect } from "react";

const ContestTracker = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/contests/active-contests"
        );
        const data = await response.json();

        const filteredContests = data.data
          .filter(
            (contest) =>
              contest.status === "upcoming" || contest.status === "ongoing"
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setContests(filteredContests);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
    const interval = setInterval(fetchContests, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (startTime, status) => {
    if (status === "ongoing") {
      return (
        <span className="text-lg font-semibold text-orange-500">Ongoing</span>
      );
    }

    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0)
      return (
        <span className="text-lg font-semibold text-orange-500">Ongoing</span>
      );

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return (
      <span className="text-lg font-semibold text-green-500">
        {days > 0 ? `${days}d ` : ""}
        {hours}h {minutes}m
      </span>
    );
  };

  return (
    <div className="min-h-screen p-6 text-gray-800 bg-gray-100">
      <h1 className="mb-6 text-4xl font-bold text-center text-blue-600">
        Contest Tracker
      </h1>

      {loading ? (
        <p className="text-lg text-center text-gray-600">Loading contests...</p>
      ) : (
        <div className="max-w-[95%] mx-auto overflow-hidden bg-white rounded-lg shadow-md">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_3fr_1.2fr_1fr_1.2fr_1fr_87px] gap-3 px-8 py-5 text-lg font-semibold text-gray-700 bg-gray-200">
            <span>#</span>
            <span>Contest</span>
            <span>Platform</span>
            <span>Status</span>
            <span>Time Left</span>
            <span>Duration</span>
            <span>Action</span>
          </div>

          {/* Contests List */}
          {contests.length > 0 ? (
            contests.map((contest, index) => (
              <div
                key={index}
                className="grid items-center grid-cols-[50px_3fr_1.2fr_1fr_1.2fr_1fr_110px] gap-3 px-8 py-5 border-b border-gray-300 rounded-lg transition-all shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-[2px]"
              >
                {/* Index */}
                <span className="w-8 text-xl font-medium text-center text-gray-700">
                  {index + 1}
                </span>

                {/* Contest Title */}
                <a
                  href={contest.contest_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {contest.title}
                </a>

                {/* Platform */}
                <span className="text-lg text-gray-700">
                  {contest.platform}
                </span>

                {/* Status Badge (Uneven Text) */}
                <span
                  className={`inline-flex items-center justify-center w-fit px-2.5 py-1 text-sm font-semibold rounded-md ${
                    contest.status === "upcoming"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {contest.status === "upcoming" ? "Upcoming" : "Ongoing"}
                </span>

                {/* Time Left */}
                <span>{getRemainingTime(contest.date, contest.status)}</span>

                {/* Duration */}
                <span className="text-xl text-gray-600">
                  {contest.duration} min
                </span>

                {/* Visit Button (Uneven Text) */}
                <a
                  href={contest.contest_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-1.5 text-lg font-semibold text-center text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Visit
                </a>
              </div>
            ))
          ) : (
            <p className="p-6 text-lg text-center text-gray-600">
              No upcoming or ongoing contests.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContestTracker;
