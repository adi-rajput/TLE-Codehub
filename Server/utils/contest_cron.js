const cron  = require('node-cron');

const fetchContests = require('../controller/Contest_Controller');
const updateContestStatus = require('../controller/Contest_Controller');
const contestCron = () => {
    cron.schedule('0 * * * *', async () => {
        await fetchContests();
    });
    
};
const contestStatusCron = () => {
    cron.schedule("*/5 * * * *", async () => {
        console.log("Running contest status update...");
        try {
            await updateContestStatus();
            console.log("Contest statuses updated successfully.");
        } catch (error) {
            console.error("Error in contest status update:", error.message);
        }
    });
};
module.exports = { contestCron , contestStatusCron };