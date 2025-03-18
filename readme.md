# Contest Hub

## Overview
Contest Hub is a web application designed to help competitive programmers track upcoming and past coding contests from platforms like LeetCode, Codeforces, and CodeChef. The platform allows users to bookmark contests, view solutions for past contests, and enables admins to add video solutions.

## Features

### Guest Features (Without Login)
- View upcoming coding contests with details such as title, platform, start time, and duration
- Browse past contests and check available solutions (if added by an admin)
- Filter contests by platform (LeetCode, Codeforces, CodeChef) and duration

### User Features (After Login)
- Bookmark contests for easy access later
- Saved bookmarks persist across multiple sessions
- Access past contests and view available solutions

### Admin Features (Special Privileges)
- Add video solutions to past contests using predefined YouTube playlists
- Select a video from LeetCode, Codeforces, or CodeChef playlists and attach it as a solution to a contest
- Solutions will be visible to all users once added

## Application Screenshots

### Contest Tracker (Home)
![Contest Tracker Home](screenshots/contest-tracker.png)
The main page displays upcoming contests with filtering options by platform (LeetCode, Codeforces, CodeChef).
Each contest shows:
- Contest name and number
- Platform with color coding
- Status (Upcoming)
- Time left until the contest starts
- Contest duration
- Action buttons (Visit, Bookmark)

### Past Contests
![Past Contests](screenshots/past-contests.png)
Displays completed contests with options to:
- Search contests
- Filter by platform and duration
- View contest details (name, platform, start time, duration)
- Visit the contest page
- Access solutions (if available)
- Add solutions (admin only)
- Bookmark contests

### Bookmarks
![Bookmarks](screenshots/bookmarks.png)
Shows all contests bookmarked by the user with:
- Contest details in card format
- Platform and status indicators
- Start time and duration
- Visit and solution availability information

### Solution Management
![Add Solution](screenshots/add-solution.png)
Admins can add video solutions to past contests:
- Modal interface for selecting and previewing YouTube videos
- Embedded video player for previewing content
- Input field for pasting selected video URL
- Add Solution button to confirm and save the solution
- Solutions become immediately available to all users

## Video Demonstration
[Watch the application demo](https://www.loom.com/share/a03de0d7600f46cab3b3b1cdf0452e35?sid=74ec315c-552e-41a1-b9fd-82583da9b87c)

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Icons
- React Router
- React Toastify (for notifications)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- JWT Authentication
- Multer (for file uploads)

### Database
- MongoDB (for storing contests, users, and bookmarks)

## Project Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/adi-rajput/TLE-Codehub.git
   cd contest-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a .env file in the backend directory and add:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

5. **Start the frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

## API Endpoints

### Authentication APIs
- POST /user/register → Register a new user
- POST /user/login → Log in with email & password
- GET /user/me → Get logged-in user details
- GET /user/bookmarks → Get bookmarked contests
- PUT /user/toggle-bookmark/:contestId → Toggle bookmark status for a contest

### Contest APIs
- GET /contests/upcoming → Fetch upcoming contests
- GET /contests/past?page=1&limit=50 → Fetch paginated past contests
- GET /contests/codeforces-contests → Fetch Codeforces contests
- GET /contests/leetcode-contests → Fetch LeetCode contests
- GET /contests/codechef-contests → Fetch CodeChef contests

### Solution APIs (Admin Only)
- PUT /user/add-solution-link/:contestId → Add a solution link to a past contest

## Usage Instructions

### Viewing Contests
- Open the homepage to see upcoming contests
- Go to the Past Contests page to view past contests

### Bookmarking Contests
- Click the star icon to save a contest
- Visit the Bookmarks section to view saved contests

### Adding Solutions (Admin Only)
- Click "ADD SOLUTION" button on a past contest
- Review the embedded YouTube video preview 
- Paste the selected video URL in the input field
- Click "Add Solution" to save and make it available to all users

## Authentication & User Roles
- Users must log in to bookmark contests
- Admins have additional privileges to add solutions
- Authentication is handled via JWT tokens stored in cookies

## UI & Design
- Responsive UI built with Tailwind CSS
- Toast notifications for bookmarks & solution updates
- Modal interfaces for solution management