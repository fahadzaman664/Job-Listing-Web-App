import React, { useContext } from "react";
import AppContext from "../Context/AppContext.jsx";
import JobCard from "./JobCard";

const AllJobs = () => {
  const { jobs } = useContext(AppContext);
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {jobs.length > 0 ? (
        jobs.map((job) => (
            
          <JobCard key={job.id} job={job} />
        ))
      ) : (
        <p>No jobs to show.</p>
      )}
    </div>
  );
};

export default AllJobs;
