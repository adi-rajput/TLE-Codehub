const Contest = require("../models/contest_model.js");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const fetchCodeforces = async (req, res) => {
  try {
    const { data } = await axios.get("https://codeforces.com/api/contest.list");

    if (data.status !== "OK") {
      throw new Error("Failed to fetch Codeforces contests");
    }

    const contests = data.result.map((c) => ({
      title: c.name,
      platform: "Codeforces",
      date: new Date(c.startTimeSeconds * 1000), 
      duration: c.durationSeconds / 60, 
      status:
        c.phase === "BEFORE"
          ? "upcoming"
          : c.phase === "CODING"
          ? "ongoing"
          : "past",
      contest_link: `https://codeforces.com/contest/${c.id}`,
      solutionLink: null,
    }));

    for (const contest of contests) {
      await Contest.findOneAndUpdate(
        { title: contest.title, platform: contest.platform },
        contest,
        { upsert: true, new: true }
      );
    }

    console.log("Codeforces contests updated successfully.");
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error.message);
  }
};
module.exports = fetchCodeforces;