import { Company } from "../models/company.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";


const registerCompany = asyncHandler(async (req, res) => {
        const { companyName } = req.body;
        if (!companyName) {
                throw new ApiError(400, "Company name is required.")                
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            throw new ApiError(400, "You can't register same company.")
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
})

const getCompany = asyncHandler(async (req, res) => {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            throw new ApiError(404, "Companies not found")
        }
        return res.status(200).json({
            companies,
            success:true
        })
}) 

// get company by id
const getCompanyById = asyncHandler(async (req, res) => {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            throw new ApiError(404, "Company not found")
        }
        return res.status(200).json({
            company,
            success: true
        })
})
const updateCompany = asyncHandler(async (req, res) => {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        // idhar cloudinary ayega
    
        const updateData = { name, description, website, location};

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            throw new ApiError(404, "Company not found")
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })
})

export {
    registerCompany,
    getCompany,
    getCompanyById,
    updateCompany
}