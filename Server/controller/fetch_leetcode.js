const axios = require("axios");
const dotenv = require("dotenv");
const Contest = require("../models/contest_model.js");

dotenv.config();

const fetchLeetCodePastContests = async () => {
  try {
    let totalStored = 0;
    let pageNo = 1;
    const contestsPerPage = 10;
    const totalPages = 60; 

    while (pageNo <= totalPages) {
      const graphqlQuery = {
        query: `
          query pastContests($pageNo: Int, $numPerPage: Int) {
            pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
              data {
                title
                titleSlug
                startTime
                originStartTime
                cardImg
              }
            }
          }
        `,
        variables: { pageNo, numPerPage: contestsPerPage },
        operationName: "pastContests",
      };

      const response = await axios.post("https://leetcode.com/graphql", graphqlQuery, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const contests = response.data.data.pastContests.data.map((c) => ({
        title: c.title,
        platform: "LeetCode",
        date: new Date(c.startTime * 1000),
        duration: 90,
        status: "past",
        solutionLink: null,
      }));

      for (const contest of contests) {
        await Contest.findOneAndUpdate(
          { title: contest.title, platform: contest.platform },
          contest,
          { upsert: true, new: true }
        );
      }

      totalStored += contests.length;
      console.log(`Stored ${totalStored} contests so far...`);

      pageNo++;
    }

    console.log(`Fetched and stored all ${totalStored} past contests successfully.`);
  } catch (error) {
    console.error("Error fetching LeetCode past contests:", error.message);
  }
};

module.exports = fetchLeetCodePastContests;
