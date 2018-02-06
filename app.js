const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//routes from products and orders
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose
  .connect(
    "mongodb://colinmj:turtle12@node-rest-shop-shard-00-00-qtd0o.mongodb.net:27017,node-rest-shop-shard-00-01-qtd0o.mongodb.net:27017,node-rest-shop-shard-00-02-qtd0o.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin"
  )
  .then(() => {
    console.log("we good");
  })
  .catch(err => {
    console.log(err);
  });

app.use(morgan("dev")); //review
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//this is how we allow other servers access to the api
//these headers goes from server to client and tell client its all good
//we are intentionally doing this before the routes
app.use((req, res, next) => {
  //this gives access to any origin, we could be more specific if you want
  res.header("Access-Control-Allow-Origin", "*");
  //this defines which types of headers we want to access, we could use a * with this too
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Allow",
    "Authorization"
  );
  //method is a prop which gives us access to the http method used on req
  if (req.method === "OPTIONS") {
    // review
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "DELETE",
      "GET"
    );
    return res.status(200).json({});
  }
  next();
});

//this is the middleware method, an incoming request has to go through this and whatever we pass through it
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//I think that we get this extra first parameter because we used the next function in our previous middleware, so it gets passed in as the first arg
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
module.exports = app;
