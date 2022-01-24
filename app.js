const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

console.log(date)

let itemArray = [];
let workItem = [];

const app = express();

//setup ejs template
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  /*---------------------
----- explained using if and switch
------------------------------*/

  // var day = "";

  // if (currentDay === 6 || currentDay === 0) {
  //   day = "Weekend";
  // } else {
  //   day = "weekday";
  // }

  res.render("list", {
    listTitle: date.getDay(),
    newListItems: itemArray,
    arrayLength: itemArray.length,
  });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItem.push(item);
    res.redirect("/work");
  } else {
    itemArray.push(item);
    res.redirect("/");
  }
});

//callback functions
app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work list",
    newListItems: workItem,
    arrayLength: workItem.length,
  });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItem.push(item);
  res.redirect("/work");
});

app.listen(3000, function () {
  console.log("Server started");
});
