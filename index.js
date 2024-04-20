const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const dotenv = require("dotenv");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
dotenv.config();
const app = express();
const PORT = process.env.port

connectToMongoDB(process.env.mongo_url).then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if(entry){
    res.redirect(entry.redirectURL);
  }
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
