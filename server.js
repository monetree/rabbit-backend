require("dotenv").config();
const port = process.env.PORT;

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

// routes
const user = require("./routes/userRoute");
const ImageUpload = require("./controllers/mediaController");

app.use(express.json());

// modules
app.use("/api/user", user);
app.post("/api/media/image-upload", ImageUpload.single("file"), (req, res) => {
  res.send({
    imageUrl: req.file.location,
  });
});

app.listen(port, () => {
  console.log(`Potential app listening on port ${port}`);
});

module.exports = app;
