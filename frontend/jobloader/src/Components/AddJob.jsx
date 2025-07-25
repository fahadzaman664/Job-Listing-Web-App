import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import AppContext from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const navigate = useNavigate();
  const { addJob } = useContext(AppContext);

  // States for input values
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.job_type.trim()) newErrors.job_type = "Job type is required";
    if (!formData.tags.trim()) newErrors.tags = "At least one tag is required";
    return newErrors;
  };

  const handleAdd = async () => {
    if (loading) return;
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const cleanedTags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newJob = {
      ...formData,
      tags: cleanedTags,
    };

    try {
      setLoading(true); // start loading
      const res = await addJob(newJob);

      if (res.success) {
        toast.success("Job added successfully!");
        setFormData({
          // ✅ reset the form fields
          title: "",
          company: "",
          location: "",
          job_type: "",
          tags: "",
        });
        navigate("/");
      } else {
        toast.error("Failed to add job.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Add New Job</h2>

      <div>
        <Input
          name="title"
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <Input
          name="company"
          type="text"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        {errors.company && (
          <p className="text-red-500 text-sm">{errors.company}</p>
        )}
      </div>

      <div>
        <Input
          name="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}
      </div>

      <div>
        <Input
          name="job_type"
          type="text"
          placeholder="Job Type (e.g. Full-time)"
          value={formData.job_type}
          onChange={handleChange}
        />
        {errors.job_type && (
          <p className="text-red-500 text-sm">{errors.job_type}</p>
        )}
      </div>

      <div>
        <Input
          name="tags"
          type="text"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
      </div>

      <Button onClick={handleAdd} disabled={loading}>
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 mr-2 text-white inline-block"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Adding...
          </>
        ) : (
          "Add Job"
        )}
      </Button>
    </div>
  );
};

export default AddJob;
