require("./db/config");
const user = require("./db/user");
const product = require("./db/product");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const connectdb = async () => {
  console.log(user);
  const data = await user.find();
  console.log(data);
};
app.post("/signup", async (req, res) => {
  let data = new user(req.body);
  let result = await data.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});
app.post("/addproduct", async (req, res) => {
  let data = new product(req.body);
  let result = await data.save();
  result = result.toObject();
  res.send(result);
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let data = await user.findOne(req.body).select("-password");
    if (data) {
      res.send(data);
    } else {
      res.send({ result: "No user exist" });
    }
  } else {
    res.send({ result: "Please enter the required field" });
  }
});

app.get("/getproducts", async (req, res) => {
  const data = await product.find();
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

app.delete("/deleteproduct/:id", async (req, res) => {
  id = req.params.id;
  let data = await product.deleteOne({ _id: id });
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
  let result = await product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { catagory: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

app.listen("5000", () => console.log("app is runninig on port 5000...."));
