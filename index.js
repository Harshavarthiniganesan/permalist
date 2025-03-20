import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"Harsha@2004",
  port:5432
  
})

console.log("Connected sucessfully")
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];



app.get("/", async (req, res) => {
  const main = await db.query("SELECT * from items ORDER BY id ASC");
  items=main.rows;

  res.render("index.ejs", {
    listTitle: "Schedule Your Plan 📝",
    listItems: items,
  });
});




app.post("/add", async(req, res) => {
  const item = req.body.newItem;

  // console.log(item);
  
  try{
   await db.query("INSERT INTO items(title) VALUES ($1)", [item]);
   
   res.redirect("/");
  }
 catch(err){
  console.log(err);
 }
  
});

app.post("/edit", async(req, res) => {
  const result=req.body.updatedItemTitle;
  const resultID=req.body.updatedItemId;
  // console.log(result);
  try{
  const updatedTitle=await db.query("UPDATE items SET title=$1 WHERE id=$2",[result,resultID]);
  res.redirect("/")
  }
  catch(err){
    console.log(err);
  }

});




app.post("/delete", (req, res) => {
  const deteledElement=req.body.deleteItemId;
  console.log(deteledElement);
  try{
    db.query("DELETE from items where id =$1",[deteledElement]);
    res.redirect("/")
  }
  catch(err){
    console.log(err);
  }

 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
