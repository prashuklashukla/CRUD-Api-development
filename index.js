const express = require("express");
const app = express();
const studentRouter = require("./Router/student.routes");
const mongoDB = require("./config/databases");
const PORT = process.env.PORT;
const path = require("path");
const cors = require('cors')

mongoDB();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());


app.post("/", (req, res) => {

  res.send(`Hello ${data.name}!`);
});

app.use('/uploads', express.static(path.join(__dirname,'uploads')))

app.use(cors())
app.use("/api/student", studentRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
