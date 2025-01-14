import express from "express";
import { z } from "zod";
import { User, Company} from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

const signupBody = z.object({ 
  username: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  password: z.string().min(6), // Ensure password has a minimum length
});

router.post("/signup", async (req, res) => {
  try {
    // Input validation check
    const result = signupBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Input specified in incorrect format",
      });
    }

    const userCompany = await Company.findOne({companyName:req.body.companyName})
    
    if(!userCompany){
      return res.status(409).json({
        message:"Company not found. Kindly Contact Admin"
      })
    }


    
    // Existing user check only when we want only a signle usename to exist no matter what the company is
    // const existingUser = await User.findOne({ username: req.body.username});
    // if (existingUser) {
    //   return res.status(409).json({
    //     message: "Existing user",
    //   });
    // }

    // Existing user check when we allo a signle user to work with multiple companies
    const existingUser = await User.findOne({ username: req.body.username, companyID:userCompany._id});
    if (existingUser) {
      return res.status(409).json({
        message: "Existing user",
      });
    }

    const hashedpassword = await bcrypt.hash(req.body.password, 10);

    // When both checks are successful, add user to the database
    const user = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedpassword,
      companyName:req.body.companyName,
      companyID:userCompany._id,
      position: "Member",
      positionseniorityindex: 1,
    });

    const userId = user._id;
    const companyId = userCompany._id;
    const token = jwt.sign(
      {
        userId,
        companyId
      }, 
      JWT_SECRET
    );

    // console.log(jwt.decode(token))

    res.status(201).json({
      message: "User created successfully",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        companyName:user.companyName
      },
    }); 
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


//signin route
const signinBody = z.object({
  username: z.string().email(),
  password: z.string().min(1),
  companyName:z.string().min(1)
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Input specified in incorrect format",
    });
  }

  const userCompany = await Company.findOne({companyName:req.body.companyName})
    
  if(!userCompany){
    return res.status(409).json({
      message:"Company not found. Kindly Contact Admin"
    })
  }

  const user = await User.findOne({
    username: req.body.username,
    companyName:req.body.companyName,
    companyID:userCompany._id
  });

  //this method can also be used
  // const test_user = await User.findOne({
  //   $and: [
  //     { username: req.body.username },
  //     { companyName: req.body.companyName },
  //   ],
  // });
  

  if (!user) {
    return res.status(401).json({
      message: "Not a registered user",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        userId: user._id,
        companyId:userCompany._id
      },
      JWT_SECRET
    );

    // console.log(jwt.decode(token))
    return res.status(200).json({
      message: "Welcome user, you are logged in",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        companyName:user.companyName
      },
    });
  }

  res.status(401).json({
    message: "Password incorrect",
  });
});

//update route

// const updateBody = zod.object({
//     password:zod.string().optional(),
//     firstName:zod.string().optional(),
//     lastName:zod.string().optional(),
// })

// router.put("/update",authMiddleware,async(req,res) => {
//     const {success} = updateBody.safeParse(req.body)

//     if(!success){
//         return res.status(411).json({
//              message: "Input specified in wrong format"
//         })
//     }

//     await User.updateOne({_id:req.userId}, req.body);

//     res.json({
//         message:"Details updated successfully"
//     })
// })


router.get("/details", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.companyId;

    console.log(userId,companyId)
    
    const userDetails = await User.findOne(
      {
        _id:userId,
        companyID:companyId,
      });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
     userDetails
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Route to send the details of the users to appear on the user's page according to searching
router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const userPositionIndex = req.query.userPositionIndex;
  const userid = req.userId;
  const companyId = req.companyId;
  


  const users = await User.find({
    $and: [
      {
        $or: [
          {
            firstName: {
              $regex: filter,
            },
          },
          {
            lastName: {
              $regex: filter,
            },
          },
        ],
      },
      {
        positionseniorityindex: { $lte: userPositionIndex },
      },
      {
        _id: { $ne: userid },
      },
      {
        companyID:companyId
      }
    ],
  });

  res.json({
    users
  });
});

router.get("/bulk-for-messaging", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const userid = req.userId;
  const companyId = req.companyId;

  const users = await User.find({
    $and: [
      {
        $or: [
          {
            firstName: {
              $regex: filter,
            },
          },
          {
            lastName: {
              $regex: filter,
            },
          },
        ],
      },
      {
        _id: { $ne: userid },
      },
      {
        companyID:companyId
      }
    ],
  });

  res.json({
    users
  });
});

export default router;