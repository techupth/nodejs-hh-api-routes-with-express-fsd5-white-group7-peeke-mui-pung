import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = express();
const port = 4000;

let assignmentData = assignments;
let commentData = comments;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentDataWithLimit = assignmentData.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentDataWithLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let assignmentDataById = assignmentData.filter(
    (item) => item.id === assignmentIdFromClient
  );
  if (!assignmentDataById[0]) {
    return res.status(404).json({
      message: "Assignment Not Found",
    });
  }
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentDataById[0],
  });
});

app.post("/assignments", (req, res) => {
  if (
    !req.body ||
    !req.body.hasOwnProperty("title") ||
    !req.body.hasOwnProperty("categories") ||
    !req.body.hasOwnProperty("description")
  ) {
    return res.status(400).json({
      message: "Invalid assignment data",
    });
  }
  assignmentData.push({
    id: assignmentData[assignmentData.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  const assignmentToDelete = assignmentData.filter((item) => {
    return item.id === assignmentIdFromClient;
  });
  if (assignmentToDelete.length === 0) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }
  const newAssignmentData = assignmentData.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });
  assignmentData = newAssignmentData;
  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  const assignmentToUpdate = assignmentData.filter((item) => {
    return item.id === assignmentIdFromClient;
  });
  if (assignmentToUpdate.length === 0) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }
  if (
    !req.body ||
    !req.body.hasOwnProperty("title") ||
    !req.body.hasOwnProperty("categories") ||
    !req.body.hasOwnProperty("description")
  ) {
    return res.status(400).json({
      message: "Invalid assignment data",
    });
  }
  const assignmentIndex = assignmentData.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });
  assignmentData[assignmentIndex] = { id: assignmentIdFromClient, ...req.body };
  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
  });
});

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let assignmentDataById = assignmentData.filter(
    (item) => item.id === assignmentIdFromClient
  );
  if (!assignmentDataById[0]) {
    return res.status(404).json({
      message: "Assignment Not Found",
    });
  }
  let commentsForAssignment = commentData.filter(
    (comment) => comment.assignmentId === assignmentIdFromClient
  );
  if (commentsForAssignment.length === 0) {
    return res.json({
      message: "No Comments Found",
    });
  }
  if (commentsForAssignment.length >= 1) {
    return res.json({
      message: "Complete fetching comments",
      data: commentsForAssignment,
    });
  }
});

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  const newCommentData = {
    id: commentData[commentData.length - 1].id + 1,
    assignmentId: assignmentIdFromClient,
    content: req.body.content,
  };

  const hasAssignment = assignmentData.find((item) => {
    return item.id === assignmentIdFromClient;
  });
  if (!hasAssignment) {
    return res.status(404).json({
      message: "Assignment Not Found",
    });
  }

  commentData.push(newCommentData);
  return res.json({
    message: `New comment of assignment id ${assignmentIdFromClient} has been created successfully`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
