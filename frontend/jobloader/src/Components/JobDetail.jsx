import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios.js";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/jobs/${id}`);
        setJob(res.data);
        console.log("jobdetail", res.data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold text-blue-600">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        Job not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-xl border border-blue-200">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">{job.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Posted on:{" "}
        <span className="text-gray-700">
          {new Date(job.posting_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        </span>
      </p>

      <p className="text-gray-800 mb-6 text-[17px] leading-relaxed">
        {job.description}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <span className="text-sm font-medium text-gray-500">Company</span>
          <p className="text-lg font-semibold text-blue-700 mt-1">
            {job.company || "N/A"}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <span className="text-sm font-medium text-gray-500">Location</span>
          <p className="text-lg font-semibold text-blue-700 mt-1">
            {job.location}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Tags:</h3>
        <div className="flex flex-wrap gap-3">
          {job.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-200 text-blue-900 px-4 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
