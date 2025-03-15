const axios = require("axios");
const Contest = require("../models/contest_model");
const dotenv = require("dotenv");
dotenv.config();

const fetchCodechef = async (req, res) => {
  try {
    const response = await axios.get("https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all");

    const futureContests = response.data.future_contests.map((contest) => ({
      title: contest.contest_name,
      platform: "CodeChef",
      date: new Date(contest.contest_start_date_iso),
      duration: parseInt(contest.contest_duration),
      contest_link: `https://www.codechef.com/${contest.contest_code}`,
      status: "upcoming",
    }));

    const pastContests = response.data.past_contests.map((contest) => ({
      title: contest.contest_name,
      platform: "CodeChef",
      date: new Date(contest.contest_start_date_iso),
      duration: parseInt(contest.contest_duration),
      contest_link: `https://www.codechef.com/${contest.contest_code}`,
      status: "past",
    }));

    await saveContests([...futureContests, ...pastContests]);

    console.log("CodeChef contests updated successfully!");
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
  }
};

const saveContests = async (contests) => {
  for (const contest of contests) {
    const existingContest = await Contest.findOne({
      title: contest.title,
      platform: contest.platform,
    });

    if (!existingContest) {
      await Contest.create(contest);
    }
  }
};
module.exports = fetchCodechef;