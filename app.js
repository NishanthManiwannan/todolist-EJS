const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

//--------------- connecting mongoos ---------------------
const mongoos = require("mongoose");
mongoos.connect("mongodb+srv://ManiNishanth:Gaps01MDB@cluster0.ymaer.mongodb.net/ToDoList", {
  useNewUrlParser: true,
});
// --------------------------------------------------------

// let itemArray = [];
// let workItem = [];

const app = express();

//-------------- setup ejs template --------------------
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//------------ items schema -----------------------
const itemListSchema = new mongoos.Schema({
  itemName: {
    type: String,
    required: [true, "item name required"],
  },
});

const ItemList = mongoos.model("items", itemListSchema);

app.get("/", function (req, res) {
  ItemList.find({}, function (err, items) {
    if (err) {
      console.log(err);
    } else {
      // items.forEach(function (item) {
      //   itemArray.push(item.itemName);
      // });

      res.render("list", {
        // listTitle: date.getDay(),
        listTitle: "Today",
        newListItems: items,
        arrayLength: items.length,
      });
    }
  });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  let listName = req.body.list;

  const itemList = new ItemList({
    itemName: item,
  });

  if (listName === "Today") {
    itemList.save();
    res.redirect("/");
  } else {
    routeList.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(itemList);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const selectedId = req.body.selectedItem;
  const hidenListval = req.body.hidenListval;

  if (hidenListval === "Today") {
    ItemList.findByIdAndDelete(selectedId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted succesfully");
        res.redirect("/");
      }
    });
  } else {
    routeList.findOneAndUpdate(
      { name: hidenListval },
      { $pull: { items: { _id: selectedId } } },
      function (err, routlist) {
        if (err) {
          console.log(err);
        } else {
          console.log("deleted succesfully");
          res.redirect("/" + routlist.name);
        }
      }
    );
  }
  // ItemList.deleteOne({ _id: selectedId }, function (err) {
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log("deleted succesfully");
  //     res.redirect("/")
  //   }
  // });
});

//--------- customized list route--------------------

const listSchema = {
  name: String,
  items: [itemListSchema],
};

const routeList = mongoos.model("listRouts", listSchema);

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  routeList.findOne({ name: customListName }, function (err, routList) {
    if (err) {
      console.log(err);
    } else {
      if (!routList) {
        console.log("does not exiest");
        const routlist = new routeList({
          name: customListName,
          items: [],
        });

        routlist.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: routList.name,
          newListItems: routList.items,
          arrayLength: routList.length,
        });
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server started");
});
