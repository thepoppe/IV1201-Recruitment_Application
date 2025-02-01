const express = require("express");
const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Responsed");
});

app.listen(port, () => {
  console.log("Server is running");
});
