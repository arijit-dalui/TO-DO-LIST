const express = require("express");

const bodyparser = require("body-parser");

const app = express();

const mongoose = require("mongoose");

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemsschema = new mongoose.Schema({
  name:
  {
    type: String,
    required: true
  }
});

const Item = mongoose.model("Item",itemsschema);

 const item1 = new Item({
   name: "Welcome to your todolist"
 });

 const item2 = new Item({
   name: "Hit the + button to add a new item"
 });

 const item3 = new Item({
   name: "<--- Hit this to delete an item"
 });

 const defaultitems = [item1,item2,item3];





app.get("/",function(request,respond){
  Item.find({} , function(err,result){
    if(result.length == 0)
    {
      Item.insertMany(defaultitems,function(err){
        if(err)
        {
          console.log(err);
        }
        else
        {
          console.log("success");
        }
      });
      res.redirect("/");
    }
    else
    {
      respond.render("list",{daytype: today, newlistitem: result});
    }

  });


  var day = new Date();
  var today;

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }



  today = day.toLocaleDateString("en-US",options);

});

app.post("/",function(req,res){
  const itemname = req.body.additem;

   const itemnew = new Item(
     {
        name: itemname
     }
   );

    itemnew.save();


  res.redirect("/");
});

app.post("/delete",function(req,res){
  const idname = req.body.checkbox;
  Item.findByIdAndRemove(idname,function(err){

  });
  res.redirect("/");
});




app.listen(3000,function(request,response){
  console.log("Server running at port 3000");
});
