const cron  = require('node-cron');

const fetchContests = require('../controller/Contest_Controller');

const contestCron = () => {
    cron.schedule('0 0 * * *', async () => {
        await fetchContests();
    });
};

module.exports = contestCron;