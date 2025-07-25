from flask import Blueprint, jsonify, request
from Models.models import Job, db
from datetime import datetime

api = Blueprint("api", __name__)

# Get all jobs
@api.route("/jobs", methods=["GET"])
def get_jobs():
    jobs = Job.query.all()
    return jsonify([job.to_dict() for job in jobs])

# Get a single job
@api.route("/jobs/<int:id>", methods=["GET"])
def get_job(id):
    job = Job.query.get_or_404(id)
    return jsonify(job.to_dict())

# Create a job
@api.route("/jobs", methods=["POST"])
def create_job():
    data = request.json
    tags = data.get("tags", [])
    
    if isinstance(tags, list):
        tags = ",".join(tag.strip() for tag in tags)

    new_job = Job(
        title=data.get("title"),
        company=data.get("company"),
        location=data.get("location"),
        job_type=data.get("job_type"),
        tags=tags,
        posting_date=datetime.fromisoformat(data.get("posting_date")) if data.get("posting_date") else datetime.utcnow()
    )

    db.session.add(new_job)
    db.session.commit()

    return jsonify({
        "message": "Job added!",
        "success": True,
        "job": {
            "id": new_job.id,
            "title": new_job.title,
            "company": new_job.company,
            "location": new_job.location,
            "job_type": new_job.job_type,
            "tags": new_job.tags.split(","),
            "posting_date": new_job.posting_date.isoformat()
        }
    }), 201

# Update a job
@api.route("/jobs/<int:id>", methods=["PUT"])
def update_job(id):
    job = Job.query.get_or_404(id)
    data = request.json

    job.title = data.get("title", job.title)
    job.company = data.get("company", job.company)
    job.location = data.get("location", job.location)
    job.job_type = data.get("job_type", job.job_type)

    tags = data.get("tags", [])
    if isinstance(tags, list):
        job.tags = ",".join(tag.strip() for tag in tags)
    elif isinstance(tags, str):
        job.tags = tags

    if data.get("posting_date"):
        job.posting_date = datetime.fromisoformat(data["posting_date"])

    db.session.commit()
    return jsonify({"message": "Job updated!", "success": True, "job": job.to_dict()})

# Delete a job
@api.route("/jobs/<int:id>", methods=["DELETE"])
def delete_job(id):
    job = Job.query.get_or_404(id)
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted!", "success": True})

# Get jobs with filter and sort
@api.route("/jobs/all", methods=["GET"])
def get_filter_jobs():
    query = Job.query

    job_type = request.args.get("job_type")
    location = request.args.get("location")
    tag = request.args.get("tag")
    sort = request.args.get("sort")
    keyword = request.args.get("keyword")  

    if job_type and job_type.lower() != "all":
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if location and location.lower() != "all":
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if tag:
        query = query.filter(Job.tags.ilike(f"%{tag}%"))

    # 🔍 Add keyword search logic
    if keyword:
        keyword_pattern = f"%{keyword}%"
        query = query.filter(
            Job.title.ilike(keyword_pattern) |
            Job.company.ilike(keyword_pattern)         )

    if sort == "posting_date_asc":
        query = query.order_by(Job.posting_date.asc())
    else:
        query = query.order_by(Job.posting_date.desc())

    jobs = query.all()
    return jsonify([job.to_dict() for job in jobs])

