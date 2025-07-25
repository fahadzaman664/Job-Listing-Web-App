import React, { useEffect, useState } from "react";
import AppContext from "./AppContext.jsx";
import axios from "../axios.js";
const AppState = (props) => {
  const [jobs, setJobs] = useState([]);
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    type: "All",
    location: "All",
    tags: [],
    sort: "date_desc",
  });
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jobFilters");
    if (saved) {
      setFilters(JSON.parse(saved));
    }
    setFiltersLoaded(true); // Load complete
  }, []);

  useEffect(() => {
    if (filtersLoaded) {
      localStorage.setItem("jobFilters", JSON.stringify(filters));
    }
  }, [filters, filtersLoaded]);

// add job
  const addJob = async (jobData) => {
    try {
      const res = await axios.post("/jobs", jobData);
      setJobs((prev) => [res.data.job, ...prev]);
      setReload(true);
      console.log("jobs", res.data);

      return res.data;
    } catch (err) {
      console.error("Add failed", err);
      return { success: false, message: "Job add failed" };
    }
  };

  // deletejob by id
  const deleteJob = async (id) => {
    try {
      const api = await axios.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      return api.data;
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  //updatejob
  const updateJob = async (id, updatedData) => {
    try {
      const res = await axios.put(`/jobs/${id}`, updatedData);
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? res.data.job : job))
      );
      setReload(true);
      return res.data;
    } catch (err) {
      console.error("Update failed", err);
    }
  };


  // filtered jobs and fetchalljobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams();

        if (filters.type !== "All") params.append("job_type", filters.type);
        if (filters.location !== "All")
          params.append("location", filters.location);
        if (filters.tags.length > 0)
          params.append("tag", filters.tags.join(","));
        if (filters.sort === "date_asc")
          params.append("sort", "posting_date_asc");
        else params.append("sort", "posting_date_desc");

        if (filters.keyword) params.append("keyword", filters.keyword);

        const res = await axios.get(`/jobs/all?${params.toString()}`);
        setJobs(res.data);
        setReload(false); // Reset reload flag after fetching
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, [filters, reload]);



  return (
    <AppContext.Provider
      value={{ jobs, deleteJob, updateJob, addJob, filters, setFilters }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
