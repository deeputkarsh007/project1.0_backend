require("./db/config");
const user = require("./db/user");
const caption = require("./db/caption");
const express = require("express");
const app = express();
const cors = require("cors");
const Jwt = require("jwtwebtoken");
const key = "utkarsh_deep_project";
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const connectdb = async () => {
  console.log(user);
  const data = await user.find();
  console.log(data);
};
app.post("/signup", async (req, res) => {
  console.log("it is reaching upto the backend");
  let data = new user(req.body);
  let result = await data.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});
app.post("/addproduct", async (req, res) => {
  let data = new caption(req.body);
  let result = await data.save();
  result = result.toObject();
  res.send(result);
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let data = await user.findOne(req.body).select("-password");
    if (data) {
      // Jwt.sign({user},jwtKey,{expiresIn: "4h"}, (err, token) => {
      res.send(data, { auth: token });
      // }
    } else {
      res.send({ result: "No user exist" });
    }
  } else {
    res.send({ result: "Please enter the required field" });
  }
});

app.get("/getcaptions", async (req, res) => {
  const data = await caption.find();
  if (data.length > 0) {
    res.send(data);
  } else {
    res.send({ result: "no data found" });
  }
});
app.get("/product/:id", async (req, res) => {
  let result = await product.findOne({ _id: req.params.id });
  // console.log(result);
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "nothing found" });
  }
});

app.delete("/deletecaption/:id", async (req, res) => {
  id = req.params.id;
  let data = await caption.deleteOne({ _id: id });
  console.log(data);
  res.status(200).send(data);
});

app.put("/update/:id", async (req, res) => {
  let result = await product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

app.get("/search/:key", async (req, res) => {
  let result = await caption.find({
    $or: [
      { name: { $regex: req.params.key } },
      { platform: { $regex: req.params.key } },
      { mood: { $regex: req.params.key } },
      { length: { $regex: req.params.key } },
      { caption: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

app.listen("5000", () => console.log("app is runninig on port 5000...."));
