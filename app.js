// Start coding here
import Express from "express";
import { assignments } from "./data/assignments.js";

let assignmentMockDatabase = assignments;

const app = Express();
const port = 4000;

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
/* 1 */
app.get("/assignments", (req, res) => {
  if (req.query.limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentsWithLimit = assignmentMockDatabase.slice(0, req.query.limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsWithLimit,
  });
});
/* 2 */
app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromData = Number(req.params.assignmentsId);
  let findAssignmentsById = assignmentMockDatabase.filter(
    (assignments) => assignments.id === assignmentsIdFromData
  );
  if (!findAssignmentsById[0]) {
    return res.json({
      message: `Assignments not found for ID: ${assignmentsIdFromData}`,
    });
  }
  res.json({
    message: "Complete Fetching assignments",
    data: findAssignmentsById[0],
  });
});
/* 3 */
app.post("/assignments", (req, res) => {
  const newAssignmentId = assignmentMockDatabase.length + 1;
  const newAssignment = {
    id: newAssignmentId,
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
  };

  assignmentMockDatabase.push(newAssignment);
  return res.json({
    message: "New assignment has been created successfully",
    data: newAssignment,
  });
});

/* 4 */
app.delete("/assignments/:assignmentsId", (req, res) => {
  const assignmentsIdFromData = Number(req.params.assignmentsId);
  const assignmentToDeleteIndex = assignmentMockDatabase.findIndex(
    (assignments) => assignments.id === assignmentsIdFromData
  );
  if (assignmentToDeleteIndex === -1) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }
  assignmentMockDatabase.splice(assignmentToDeleteIndex, 1);

  return res.json({
    message: `Assignments Id : ${assignmentsIdFromData} has been deleted successfully`,
  });
});

/* 5 */
app.put("/assignments/:assignmentsId", (req, res) => {
  const assignmentsIdFromData = Number(req.params.assignmentsId);
  const assignmentIndex = assignmentMockDatabase.findIndex(
    (assignments) => assignments.id === assignmentsIdFromData
  );

  if (assignmentIndex === -1) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }
  assignmentMockDatabase[assignmentIndex] = {
    id: assignmentsIdFromData,
    ...req.body,
  };

  return res.json({
    message: `Assignment Id: ${assignmentsIdFromData} has been updated successfully`,
    data: assignmentMockDatabase[assignmentIndex],
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
