import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const applyJob = asyncHandler(async (req, res) => {
  const userId = req.id;
  const jobId = req.params.id;
  if (!jobId) {
    throw new ApiError(400, "Job Id is required");
  }
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this jobs");
  }
  // check if the jobs exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  // create a new application
  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
  });
  job.applications.push(newApplication._id);
  await job.save();
  return res.status(201).json({
    message: "Job applied successfully.",
    success: true,
  });
});

const getAppliedJobs = asyncHandler(async(req, res) => {
    const userId = req.id;
    const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
        path:'job',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'company',
            options:{sort:{createdAt:-1}},
        }
    })
    if(!application){
        throw new ApiError(404, "No Application")
    }
    return res.status(200)
    .json(new ApiResponse(200, application,"These are the applied jobs"));
})

const getApplicants = asyncHandler(async(req, res) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path:"applications",
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant'
        }
    })
    if(!job){
        throw new ApiError(404, "Jobs not found")
    }
    return res.status(200)
    .json(new ApiResponse(200, job, "Applicants found"))
})

const updateStatus = asyncHandler(async(req, res) => {
    const {status} = req.body;
    const applicationId = req.params.id;
    if(!status){
        throw new ApiError(40,"Status is required");
    }
    const application = await Application.findOne({_id:applicationId});
    if(!application){
        throw new ApiError(404,"Application not found.");
    }
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200)
    .json(new ApiResponse(200, "Status  updated"))
})

export {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateStatus
}