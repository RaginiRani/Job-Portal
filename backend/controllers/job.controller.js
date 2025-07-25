import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

// admin post krega job
const postJob = asyncHandler(async (req, res) => {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            throw new ApiError(400, "Something is Missing");
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
})
// student k liye
const getAllJobs = asyncHandler(async (req, res) => {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            throw new ApiError(404, "Jobs not found")
        };
        return res.status(200).json({
            jobs,
            success: true
        })
}

)
// student
const getJobById = asyncHandler(async (req, res) => {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
        if (!job) {
            throw new ApiError(404, "Jobs not found.")
        };
        return res.status(200).json({ job, success: true });
})
// admin kitne job create kra hai abhi tk
const getAdminJobs = asyncHandler(async (req, res) => {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            throw new ApiError(404, "Jobs not found")
        };
        return res.status(200).json({
            jobs,
            success: true
        })
})
export{
    postJob,
    getAllJobs,
    getAdminJobs,
    getJobById
}