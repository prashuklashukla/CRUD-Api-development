const express = require("express");
const app = express();
const studentRouter = require("./Router/student.routes");
const mongoDB = require("./config/databases");
const PORT = process.env.PORT;

mongoDB();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());


app.post("/", (req, res) => {

  res.send(`Hello ${data.name}!`);
});


app.use("/api/student", studentRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
