const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = 3001;

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/save-progress", (req, res) => {
  const data = req.body;

  try {
    fs.writeFileSync("progress.json", JSON.stringify(data));
    console.log("Progress saved successfully");
    res.status(200).send("Progress Saved");
  } catch (err) {
    console.error("Error saving progress: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/get-saved-progress", (req, res) => {
  fs.readFile("progress.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading progress file: ", err);
      return res.status(500).send("Internal Server Error");
    }

    try {
      const parsedData = JSON.parse(data);
      res.status(200).send(parsedData);
    } catch (parseErr) {
      console.error("Error parsing progress data: ", parseErr);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.get("/check", (req, res) => {
  try {
    if (fs.existsSync("progress.json")) {
      const stats = fs.statSync("progress.json");
      if (stats.size > 0) {
        return res.sendStatus(200);
      }
    }
    res.sendStatus(404);
  } catch (err) {
    console.error("Error checking file: ", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
