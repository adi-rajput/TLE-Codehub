const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, enum: ['Codeforces', 'CodeChef', 'LeetCode'], required: true },
  date: { type: Date, required: true }, 
  duration: { type: Number, required: true }, 
  status: { type: String, enum: ['upcoming', 'ongoing', 'past'], required: true },
  solutionLink: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contest', contestSchema);
