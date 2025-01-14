import express from "express";
import { z } from "zod";
import { Company } from "../db.js";

const router = express.Router();

const company = z.object({
  companyName: z.string().min(1),
  ownerName: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  location: z.string(),
});

router.post("/create-company", async (req, res) => {
  const result = company.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Input specified in incorrect format",
    });
  }

  const existingCompany = await Company.findOne({
    companyName:req.body.companyName
  });

  if(existingCompany){
    return res.status(409).json({
        message:"Existing Company"
    })
  }

  const newCompany = await Company.create({
    companyName: req.body.companyName,
    ownerName: req.body.ownerName,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    location: req.body.location,
  });

  res.json({
    message: "Company created Successfully",
    newCompany
  });
});

router.get("/get-companies", async (req, res) => {
    const { companyName } = req.query;
  
    try {
      // If no companyName is provided, return all companies
      const query = companyName ? { companyName } : {};
  
      const companies = await Company.find(query);
      if (companies.length === 0) {
        return res.status(404).json({ message: "No companies found" });
      }
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  

export default router;