import express from "express";
import { z } from "zod";
import Task from "../models/taskModel.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

const taskBody = z.object({
  subordinateid: z.string().min(1),
  name: z.string().min(1),
  taskassigneename:z.string().min(1),
  task: z.string().min(1),
  submissiondate: z.string().min(1),
});

router.post("/assigntask", authMiddleware, async (req, res) => {
  // const { subordinateid, name,taskassigneename, task, submissiondateandtime } = req.body;

  const result = taskBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Input specified in incorrect format" });
  }

  try {
    await Task.create({
      userId: req.userId,
      subordinateId: req.body.subordinateid,
      companyId:req.companyId,
      name:req.body.name,
      taskassigneename:req.body.taskassigneename,
      task:req.body.task,
      submissiondateandtime:req.bosy.submissiondate,
      timestamp:new Date(),
      status: 0,
      completedtaskmessage: "",
    });

    res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/ongoingtaskdetails", authMiddleware, async (req, res) => {
  try {
    const userId  = req.userId;
    const now = new Date();

    const taskDetails = await Task.find({
      subordinateid: userId,
      companyId:req.companyId,
      submissiondateandtime: { $gte: now },
      status: 0,
    });

    if (!taskDetails.length) {
      return res.status(404).json({ message: "No ongoing tasks found" });
    }

    const formattedTasks = taskDetails.map((task) => ({
      taskid: task._id,
      taskassignedby: task.userId,
      taskassignedto: task.subordinateId,
      companyId: task.companyId,
      taskassignedtoname: task.name,
      taskassignedbyname: task.taskassigneename,
      task: task.task,
      submissiondateandtime: task.submissiondateandtime,
      status:task.status
    }));

    res.status(200).json({ tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching ongoing tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/missedtaskdetails", authMiddleware, async (req, res) => {
  try {
    const userId  = req.userId;
    const now = new Date();

    const taskDetails = await Task.find({
      subordinateid: userId,
      companyId:req.companyId,
      submissiondateandtime: { $lt: now },
    });

    if (!taskDetails.length) {
      return res.status(404).json({ message: "No missed tasks found" });
    }

    const formattedTasks = taskDetails.map((task) => ({
      taskid: task._id,
      taskassignedby: task.userId,
      taskassignedto: task.subordinateId,
      companyId: task.companyId,
      taskassignedtoname: task.name,
      taskassignedbyname: task.taskassigneename,
      task: task.task,
      submissiondateandtime: task.submissiondateandtime,
      status:task.status
    }));

    res.status(200).json({ tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching missed tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/totaltasksassigned", authMiddleware, async (req, res) => {
  try {
    const userId  = req.userId;
    const taskDetails = await Task.find({
      subordinateid: userId,
      companyId:req.companyId,
    });

    if (!taskDetails.length) {
      return res.status(404).json({ message: "No tasks assigned yet" });
    }

    const formattedTasks = taskDetails.map((task) => ({
      taskid: task._id,
      taskassignedby: task.userId,
      taskassignedto: task.subordinateId,
      companyId: task.companyId,
      taskassignedtoname: task.name,
      taskassignedbyname: task.taskassigneename,
      task: task.task,
      submissiondateandtime: task.submissiondateandtime,
      status:task.status
    }));

    res.status(200).json({ tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching assugned tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/totaltasksdetails", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const taskDetails = await Task.find({ userid: userId });

    if (!taskDetails.length) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    const formattedTasks = taskDetails.map((task) => ({
      taskid: task._id,
      taskassignedby: task.userid,
      taskassignedto: task.subordinateid,
      taskassignedtoname: task.name,
      task: task.task,
      submissiondate: task.submissiondate,
      status: task.status,
      message: task.completedtaskmessage,
    }));

    res.json({ tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching total task details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const taskDetailsBody = z.object({
  taskid: z.string().min(1),
  completedTaskDetails: z.string().min(1),
});

router.put("/submittask", authMiddleware, async (req, res) => {
  try {
    const { taskid, completedTaskDetails } = req.body;

    const result = taskDetailsBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Input specified in incorrect format" });
    }

    const taskDetails = await Task.findById(taskid);

    if (!taskDetails) {
      return res.status(404).json({ message: "Task not found" });
    }

    taskDetails.status = 1;
    taskDetails.completedtaskmessage = completedTaskDetails;

    await taskDetails.save();

    res.json({ message: "Task submitted successfully" });
  } catch (error) {
    console.error("Error submitting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const missedtaskDetailsBody = z.object({
  taskid: z.string().min(1),
  missedTaskDetails: z.string().min(1),
});

router.put("/submitreason", authMiddleware, async (req, res) => {
  try {
    const { taskid, missedTaskDetails } = req.body;

    const result = missedtaskDetailsBody.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Input specified in incorrect format" });
    }

    const taskDetails = await Task.findById(taskid);

    if (!taskDetails) {
      return res.status(404).json({ message: "Task not found" });
    }

    taskDetails.status = 2;
    taskDetails.completedtaskmessage = missedTaskDetails;

    await taskDetails.save();

    res.json({ message: "Reason for missed task submitted" });
  } catch (error) {
    console.error("Error submitting missed task reason:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;