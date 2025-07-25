import React, { useState, useContext } from "react";
import AppContext from "../Context/AppContext";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Building2,
  MapPin,
  Clock,
  CalendarDays,
} from "lucide-react";

const JobCard = ({ job }) => {
  const { deleteJob, updateJob } = useContext(AppContext);
  const [editedJob, setEditedJob] = useState({ ...job });
  const [open, setOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState(job.tags?.join(", ") || "");

  const navigate = useNavigate();

  const deleteJobById = async (currentJobId) => {
    const response = await deleteJob(currentJobId);
    if (response.success) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleChange = (e) => {
    setEditedJob({ ...editedJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !editedJob.title ||
      !editedJob.company ||
      !editedJob.location ||
      !editedJob.job_type ||
      !Array.isArray(editedJob.tags) ||
      editedJob.tags.length === 0
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    editedJob.tags = editedJob.tags.map((tag) => tag.trim()).filter(Boolean);

    const response = await updateJob(editedJob.id, editedJob);
    if (response.success) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
      setOpen(false);
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.015] transition-all duration-300 cursor-pointer group relative"
      onClick={() => navigate(`/card/${job.id}`)}
    >
      {/* Title */}
      <h2 className="text-xl font-semibold text-blue-800 group-hover:text-blue-900 tracking-tight">
        {job.title}
      </h2>

      {/* Info */}
      <div className="mt-2 space-y-1 text-sm text-gray-700 font-medium">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" />
          {job.company}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-500" />
          {job.location}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          {job.job_type}
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center text-xs text-gray-500 mt-2 gap-1">
        <CalendarDays className="w-4 h-4" />
        Posted on{" "}
        {new Date(job.posting_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {job.tags?.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-200 transition"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div
        className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="destructive"
          size="icon"
          className="w-8 h-8 cursor-pointer"
          onClick={() => deleteJobById(job.id)}
        >
          <Trash2 className="w-4 h-4 " />
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Job</DialogTitle>
                <DialogDescription>
                  Update job information and save changes.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {["title", "company", "location", "job_type"].map((field) => (
                  <div key={field} className="grid gap-2">
                    <Label htmlFor={field}>{field.replace("_", " ")}</Label>
                    <Input
                      id={field}
                      name={field}
                      value={editedJob[field]}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <div className="grid gap-2">
                  <Input
                    id="tags"
                    name="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onBlur={() => {
                      const parsedTags = tagsInput
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== "");
                      setEditedJob({ ...editedJob, tags: parsedTags });
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobCard;
