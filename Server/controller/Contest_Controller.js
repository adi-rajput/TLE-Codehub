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

const getActiveContests = async (req, res) => {
  try {
    const activeContests = await Contest.find({
      status: { $in: ["upcoming", "ongoing"] },
    }).sort({ date: 1 }); 

    res.status(200).json({ success: true, data: activeContests });
  } catch (error) {
    console.error("Error fetching active contests:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const LeetCodeContest = async (req, res) => {
  try {
    const upcomingContests = await Contest.find({
      platform: "LeetCode",
      status: "upcoming",
    }).sort({ date: 1 }); 

    const pastContests = await Contest.find({
      platform: "LeetCode",
      status: "past",
    }).sort({ date: -1 }); 
    res.status(200).json({
      success: true,
      data: [...upcomingContests, ...pastContests], 
    });
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const CodeforcesContest = async (req, res) => {
  try {
    const upcomingContests = await Contest.find({
      platform: "Codeforces",
      status: "upcoming",
    }).sort({ date: 1 });

    const pastContests = await Contest.find({
      platform: "Codeforces",
      status: "past",
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: [...upcomingContests, ...pastContests],
    });
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const CodechefContest = async (req, res) => {
  try {
    console.log("Fetching Codechef Contests...");

    const upcomingContests = await Contest.find({
      platform: "CodeChef",
      status: "upcoming",
    }).sort({ date: 1 });

    const pastContests = await Contest.find({
      platform: "CodeChef",
      status: "past",
    }).sort({ date: -1 });

    

    res.status(200).json({
      success: true,
      data: [...upcomingContests, ...pastContests],
    });
  } catch (error) {
    console.error("Error fetching Codechef contests:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getPastContests = async (req, res) => {
  try {
    const pastContests = await Contest.find({
      status: "past",
    })
      .sort({ end_time: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Past contests fetched successfully",
      data: pastContests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch past contests",
      error: error.message,
    });
  }
};


setInterval(updateContestStatus, 60 * 5000);
module.exports = {
    fetchContests,
    updateContestStatus,
    getActiveContests,
    LeetCodeContest,
    CodeforcesContest,
    CodechefContest,
    getPastContests,
};
