const axios = require("axios");
const Contest = require("../models/contest_model");

const fetchLeetCodeContests = async () => {
  try {
    let totalStored = 0;
    let pageNo = 1;
    const contestsPerPage = 10;
    const totalPages = 60;

    const upcomingQuery = {
      query: `
        query {
          topTwoContests {
            title
            titleSlug
            startTime
            cardImg
            duration
          }
        }
      `,
    };

    console.log("Fetching upcoming contests...");

    const upcomingResponse = await axios.post("https://leetcode.com/graphql/", upcomingQuery, {
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com/contest/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    console.log("Upcoming Contest API Response:", upcomingResponse.data);

    if (upcomingResponse.data.errors) {
      throw new Error(upcomingResponse.data.errors[0].message);
    }

    const upcomingContests = upcomingResponse.data.data.topTwoContests.map((c) => ({
      title: c.title,
      platform: "LeetCode",
      date: new Date(c.startTime * 1000),
      duration: c.duration/60 || 90,
      status: "upcoming",
      contest_link: `https://leetcode.com/contest/${c.titleSlug}`,
      solutionLink: null,
    }));

    for (const contest of upcomingContests) {
      await Contest.findOneAndUpdate(
        { title: contest.title, platform: contest.platform },
        contest,
        { upsert: true, new: true }
      );
    }

    console.log(`Stored ${upcomingContests.length} upcoming contests.`);

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
      };

      console.log(`Fetching past contests (Page ${pageNo})...`);

      const response = await axios.post("https://leetcode.com/graphql/", graphqlQuery, {
        headers: {
          "Content-Type": "application/json",
          "Referer": "https://leetcode.com/contest/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });

      console.log(`Past Contest API Response (Page ${pageNo}):`, response.data);

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const contests = response.data.data.pastContests.data.map((c) => ({
        title: c.title,
        platform: "LeetCode",
        date: new Date(c.startTime * 1000),
        duration: 90,
        status: "past",
        contest_link: `https://leetcode.com/contest/${c.titleSlug}`,
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
      console.log(`Stored ${totalStored} past contests so far...`);

      pageNo++;
    }

    console.log(`Fetched and stored ${upcomingContests.length} upcoming and ${totalStored} past contests successfully.`);
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error.message);
  }
};

module.exports = fetchLeetCodeContests;
