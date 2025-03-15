const fetchCodechef = require("./fetch_codechef.js");
const fetchCodeforces = require("./fetch_codeforces.js");
const fetchLeetCodeContests = require("./fetch_leetcode.js");
const Contest = require("../models/contest_model.js");
const fetchContests = async (req, res) => {
  try {
    await fetchCodechef();
    await fetchCodeforces();
    await fetchLeetCodeContests();
    res.status(200).json({ message: "Contests updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update contests" });
  }
};

const updateContestStatus = async () => {
  try {
    const now = new Date();

    await Contest.updateMany(
      { status: "upcoming", date: { $lte: now } },
      { $set: { status: "ongoing" } }
    );

    await Contest.updateMany(
      { status: "ongoing" },
      { $set: { status: "past" } },
      {
        arrayFilters: [
          { "contest.date": { $lte: new Date(now - 90 * 60 * 1000) } },
        ],
      } 
    );

    console.log("Contest statuses updated successfully.");
  } catch (error) {
    console.error("Error updating contest status:", error.message);
  }
};

setInterval(updateContestStatus, 60 * 1000);
module.exports = {
    fetchContests,
    updateContestStatus,
};
