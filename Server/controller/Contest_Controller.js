const fetchCodechef = require("./fetch_codechef.js");
const fetchCodeforces = require("./fetch_codeforces.js");
const fetchLeetCodeContests = require("./fetch_leetcode.js");
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
module.exports = fetchContests;