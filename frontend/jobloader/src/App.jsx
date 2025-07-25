import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AllJobs from "./Components/AllJobs.jsx";
import AddJob from "./Components/AddJob.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterSortJobs from "./Components/FilterSortJob";
import JobDetail from "./Components/JobDetail";

function App() {
  return (
    <Router>
      <Navbar />

      <FilterSortJobs className="mt-10" />

      <div className="container mx-auto px-4 py-6">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg">
                  🚀 All Job Listings
                </h1>
                <AllJobs />
              </>
            }
          />
          <Route path="/add-job" element={<AddJob />} />
          <Route path="/card/:id" element={<JobDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
