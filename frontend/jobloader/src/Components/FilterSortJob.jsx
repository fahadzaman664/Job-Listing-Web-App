import React, { useContext, useState, useEffect, useRef } from "react";
import AppContext from "../Context/AppContext";
import { useLocation } from "react-router-dom";
import { Search, Filter } from "lucide-react"; 

const availableTags = ["React", "Node.js", "Internship"];

const FilterSortJobs = () => {
  const { filters, setFilters } = useContext(AppContext);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false); 
  const location = useLocation();
  const tagsRef = useRef(null);

  useEffect(() => {
    setSearchTerm(filters.keyword);
  }, [filters.keyword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagsRef.current && !tagsRef.current.contains(event.target)) {
        setShowTagsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeFilter = (key, value) => {
    if (key === "tags") {
      setFilters({
        ...filters,
        tags: filters.tags.filter((tag) => tag !== value),
      });
    } else if (key === "keyword") {
      setFilters({ ...filters, keyword: "" });
    } else {
      setFilters({ ...filters, [key]: "All" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, keyword: searchTerm }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "keyword") {
      setSearchTerm(value);
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleTagToggle = (tag) => {
    const updatedTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    setFilters({ ...filters, tags: updatedTags });
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      type: "All",
      location: "All",
      tags: [],
      sort: "date_desc",
    });
  };

  return (
    location.pathname !== "/add-job" && (
      <div className="p-4 bg-white shadow-md rounded-xl mb-6 sticky top-18 z-50">
        {/* Search and Mobile Toggle */}
        <div className="flex justify-between items-center gap-2 mb-2 md:mb-0">
          <div className="relative w-full md:w-80 ">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              name="keyword"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Search job title or keyword"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="md:hidden flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Filter Controls (conditionally shown on mobile) */}
        <div
          className={`${
            showMobileFilters ? "flex" : "hidden"
          } flex-col gap-2 mt-2 md:flex md:flex-row md:flex-wrap md:gap-4 items-center`}
        >
          {/* Type Filter */}
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-40 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>

          {/* Location Filter */}
          <select
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-40 focus:outline-none"
          >
            <option value="All">All Locations</option>
            <option value="Lahore">Lahore</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Tags Filter */}
          <div className="relative w-full md:w-40" ref={tagsRef}>
            <button
              type="button"
              onClick={() => setShowTagsDropdown((prev) => !prev)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full bg-white hover:bg-gray-50 text-left"
            >
              🏷️ Tags ({filters.tags.length})
            </button>
            {showTagsDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {availableTags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="mr-2"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort Filter */}
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-40 focus:outline-none"
          >
            <option value="date_desc">📅 Newest</option>
            <option value="date_asc">📆 Oldest</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full md:w-auto"
          >
            🔄 Clear Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {(filters.keyword ||
          filters.type !== "All" ||
          filters.location !== "All" ||
          filters.tags?.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.keyword && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                <span className="mr-2">🔍 {filters.keyword}</span>
                <button onClick={() => removeFilter("keyword")}>✕</button>
              </span>
            )}
            {filters.type !== "All" && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                <span className="mr-2">📄 {filters.type}</span>
                <button onClick={() => removeFilter("type")}>✕</button>
              </span>
            )}
            {filters.location !== "All" && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center">
                <span className="mr-2">📍 {filters.location}</span>
                <button onClick={() => removeFilter("location")}>✕</button>
              </span>
            )}
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center"
              >
                <span className="mr-2">🏷️ {tag}</span>
                <button onClick={() => removeFilter("tags", tag)}>✕</button>
              </span>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default FilterSortJobs;
