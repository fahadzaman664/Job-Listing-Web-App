# 🧾 Job Listing Web App

This is a **Full-Stack Job Listing Web Application** built with:

- **Frontend**: React (with Vite)
- **Backend**: Flask (Python)
- **Database**: SQLAlchemy with PostgreSQL / MySQL
- **Web Scraping**: Selenium (optional)
- **UI Design**: Tailwind CSS , ShadCn

---

## 📦 Folder Structure

frontend/jobloader/
├── src/
│ ├── assets/ # Static assets like logos/images
│ ├── Components/ # All core UI components
│ │ ├── ui/ # Sub-components like JobCard, Navbar, etc.
│ │ │ ├── AddJob.jsx
│ │ │ ├
│ │ │ ├── AllJobs.jsx
│ │ │ ├── FilterSortJob.jsx
│ │ │ ├── JobCard.jsx
│ │ │ ├── JobDetail.jsx
│ │ │ └── Navbar.jsx
│ ├── Context/ # Context API to manage global state
│ ├── lib/
│ │ └── utils.js # Utility functions
│ ├── App.css # Main CSS
│ ├── App.jsx # Main App component
│ ├── axios.js # Axios instance with baseURL
│ ├── index.css # Global styles
│ └── main.jsx # App entry point
├── .env # Environment variables
├── .gitignore # Git ignore file

---

## ✨ Features

- ✅ View all job listings
- ➕ Add new job using a modal form
- ✏️ Edit job data from card/modals
- ❌ Delete job posts
- 🔍 Filter and sort jobs
- 🔗 View job detail
- 📱 Fully responsive UI

---

## 🧠 My Approach

- 🔄 **State Management:** Used **Context API** to manage and propagate job data across components.
- 🧱 **Component Design:** UI is fully modular and follows **reusable** component design (e.g., JobCard, Navbar, FilterSortJob).
- ⚡ **UI Framework:** Used **shadcn/ui** for high-quality, accessible UI components and **lucide-react** for elegant icons.
- 🔌 **API Integration:** All data interactions go through centralized `axios.js` with `.env` base URL config.
- 🧠 **Logic Isolation:** Forms, filters, and state logic are cleanly separated for easy testing and debugging.

---

## 🔧 Features

- ✅ Add, edit, delete jobs
- ✅ Filter and sort jobs
- ✅ Centralized API communication with Axios
- ✅ Global state using React Context API
- ✅ Responsive UI
- ✅ `.env` support for managing environment variables
- ✅ CORS and cookie-based session support
- ✅ Error boundaries for better UX
- 🛠️ Ready to integrate Selenium job scraping (optional enhancement)

---

## 🔗 Libraries and Tools Used

### Frontend (React + Vite)

- `axios` – for API calls
- `react-router-dom` – page routing
- `tailwindcss` – styling
- `shadcn/ui` (Modern UI Components)
- `vite` – fast development server
- `clsx` (optional) – conditional classes
- `dotenv` – for environment variables

### Backend (Flask)

- `Flask` – Python web framework
- `Flask-CORS` – CORS policy handling
- `Flask-SQLAlchemy` – ORM
- `Flask-Migrate` – DB migrations
- `python-dotenv` – to load `.env` variables

---

## 🧠 State Management Approach

- Used **React Context API** (`AppContext.jsx`) to manage:
  - All job data
  - API interactions (GET, POST, PUT, DELETE)
  - Filters & sort state



Error Handling
Used Error Boundaries in React for clean UI even when component crashes.
Backend returns structured JSON errors.

cd backend
pip install -r requirements.txt
python app.py

cd frontend/jobloader
npm install
npm run dev

🧑‍💻 Author
Muhammad Fahad Zaman
Stack: MERN, Flask, React, D365FO, Selenium, Tailwind
Available for full-stack opportunities 🚀
