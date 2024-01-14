import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsMockDatabase = [...assignments];
let commentsMockDatabase = [...comments];

const app = express();
const port = 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  if (req.query.limit > 10) {
    return res.json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  return res.json({
    data: assignmentsMockDatabase.slice(0, req.query.limit),
  });
});

app.get("/assignments/:assignmentId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentId);
  const assignmentData = assignmentsMockDatabase.filter((item) => {
    return item.id === assignmentIdFromClient;
  });
  return res.json({ data: assignmentData[0] });
});

app.post("/assignments", (req, res) => {
  let assignmentDataFromClient;
  let newAssignmentId;

  if (!assignmentsMockDatabase.length) {
    newAssignmentId = 1;
  } else {
    newAssignmentId =
      assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1;
  }

  assignmentDataFromClient = {
    id: newAssignmentId,
    ...req.body,
  };

  assignmentsMockDatabase.push(assignmentDataFromClient);

  return res.json({ message: "New assignment has been created successfully" });
});

app.delete("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.json({ message: "No assignment to delete" });
  }

  const newAssignment = assignmentsMockDatabase.filter((item) => {
    return item.id != assignmentIdFromClient;
  });

  assignmentsMockDatabase = newAssignment;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const updateAssignmentData = { ...req.body };

  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.json({
      message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    });
  }
});

app.get("/assignments/:assignmentId/comments", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const assignmentComments = commentsMockDatabase.filter((item) => {
    item.assignmentId == assignmentIdFromClient;
  });

  if (!assignmentComments.length) {
    return res.json({
      message: `No comments available on Assignment Id : ${assignmentIdFromClient}`,
    });
  }

  return res.json({ data: assignmentComments });
});

app.post("/assignments/:assignmentId/comments", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const commentData = {
    id: commentsMockDatabase[commentsMockDatabase.length - 1].id + 1,
    ...req.body,
  };

  const hasAssignment = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasAssignment) {
    return res.json({ message: "No assignment to add comments" });
  }

  commentsMockDatabase.push(commentData);

  return res.json({
    message: `New comment of assignment id ${assignmentIdFromClient} has been created successfully`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
