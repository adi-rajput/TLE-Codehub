const axios = require("axios");
const dotenv = require("dotenv");
const Contest = require("../models/contest_model.js"); 
dotenv.config();

const fetchLeetCodeContests = async () => {
  try {
    console.log("Fetching LeetCode contests...");

    const graphqlQuery = {
      query: `
        query {
          upcomingContests {
            title
            titleSlug
            startTime
            duration
          }
        }
      `,
      variables: {},
    };

    const response = await axios.post("https://leetcode.com/graphql", graphqlQuery, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const contests = response.data.data.upcomingContests.map((c) => ({
      title: c.title,
      platform: "LeetCode",
      date: new Date(c.startTime * 1000),
      duration: c.duration / 60,
      status: "upcoming",
      solutionLink: null,
    }));

    for (const contest of contests) {
      const updatedContest = await Contest.findOneAndUpdate(
        { title: contest.title, platform: contest.platform },
        contest,
        { upsert: true, new: true }
      );
      console.log(`Contest added/updated: ${updatedContest.title}`);
    }

    console.log("LeetCode contests updated successfully.");
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error.message);
  }
};

module.exports = fetchLeetCodeContests;
