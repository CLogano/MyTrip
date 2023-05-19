const express = require("express");
const cors = require("cors");
const googleImagesRouter = require("./routes/googleImages");
const googleRatingsRouter = require("./routes/googleRatings");
const chatGPTRouter = require("./routes/chatgpt");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use("/", chatGPTRouter);
app.use("/googleImages", googleImagesRouter);
app.use("/googleRatings", googleRatingsRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server started on port ${port}`));


