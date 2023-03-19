// server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const jsonFiles = require("./_db");
const router = jsonServer.router(jsonFiles);
const middlewares = jsonServer.defaults();
const axios=require("axios")
const PORT = 3000;
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(
  jsonServer.rewriter({
    "/profiles/:id/taskss": "/profiles/:id?_embed=tasks",
    "/profiles/:id/task": "/profiles/:id/tasks",
    "/profiles/:id/onlinespaces": "/profiles/:id?_embed=onlinespaces",
    "/profiles/:id/onlinespace": "/profiles/:id/onlinespaces",
  })
);

// check task number already exist or not when create task
server.post("/profiles/:id/tasks", (req, res, next) => {
  const { tasks_number } = req.body;
  const isExistTask = router.db.get("tasks").value();
  const isMatchTask = isExistTask.filter(
    (task) => task.tasks_number === tasks_number
  );

  if (isMatchTask.length > 0) {
    res.json({ message: "task number already exist" });
  } else {
    next();
  }
});

//send request method for profiles and tasks 
server.post("/profile", async(req, res, next) => {
  const {name,tasks}=req.body
  const isExistTask = router.db.get("tasks").value();
   //check task_id allready exist or not
  const isMatchTask = isExistTask.filter(
    (task) => task.tasks_number === tasks.tasks_number
  );

  if (isMatchTask.length > 0) {
    res.json({ message: "task number already exist" });
  } else {
    //send request profiles and tasks 
    const {data}= await axios.post("http://localhost:3000/profiles",{name:name})
    const resTask= await axios.post(`http://localhost:3000/profiles/${data.id}/tasks`,tasks) 
    
    res.json({...data,tasks:resTask.data})
  }

    

});


server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server Is Running Port:http://localhost:${PORT}`);
});
