const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let users = [
  { email: "student@test.com", password: "123", role: "student" },
  { email: "teacher@test.com", password: "123", role: "teacher" }
];

let assignments = [];
let submissions = [];

// signup
app.post("/api/signup",(req,res)=>{
  const {email,password,role}=req.body;
  if(users.find(u=>u.email===email)) return res.json({success:false});
  users.push({email,password,role});
  res.json({success:true});
});

// login
app.post("/api/login",(req,res)=>{
  const {email,password}=req.body;
  const u=users.find(x=>x.email===email && x.password===password);
  if(u) return res.json({success:true,email:u.email,role:u.role});
  res.json({success:false});
});

// create assignment
app.post("/api/assignment",(req,res)=>{
  const {title,deadline,numQuestions}=req.body;
  const id=assignments.length+1;
  assignments.push({id,title,deadline,numQuestions});
  res.json({success:true});
});

// list assignments
app.get("/api/assignments",(req,res)=>res.json(assignments));

// upload (simulated)
app.post("/api/upload",(req,res)=>{
  const {student,assignmentId,filename}=req.body;
  submissions.push({
    student,assignmentId,filename,
    submittedAt:new Date().toISOString(),
    marks:{},grade:"Pending",feedback:""
  });
  res.json({success:true});
});

// list submissions
app.get("/api/submissions",(req,res)=>res.json(submissions));

// grade + feedback
app.post("/api/grade",(req,res)=>{
  const {student,assignmentId,marks,grade,feedback}=req.body;
  const sub=submissions.find(s=>s.student===student && s.assignmentId===assignmentId);
  if(sub){
    sub.marks=marks;
    sub.grade=grade;
    sub.feedback=feedback || "";
    return res.json({success:true});
  }
  res.json({success:false});
});

app.listen(4000,()=>console.log("Backend running on 4000"));
