//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogpost",{useNewUrlParser: true, 
useUnifiedTopology: true
}, () => { 
console.log('connected to database myDb ;)') 
});
const postSchema = {
  title: String,
  post: String
}
const Post = mongoose.model("post", postSchema)

// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var postarray = []
var post ={}
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get('/',(req, res)=>{
  Post.find({},function(err, foundlist){
    if(!err){
      if(foundlist!=[]){
        console.log("Found posts")
        postarray=foundlist
        res.render('home', {postarray1:foundlist})
      }
      else{ console.log("No posts yet")}
      postarray=[]
      res.render('home', {postarray1:[{title:"", post:""}]})
    }
  })
  
})

app.get('/contact',(req, res)=>{
  res.render('contact', {contact:contactContent})
})

app.get('/about',(req, res)=>{
  res.render('about', {about:aboutContent})
})

app.get('/compose',(req, res)=>{
  res.render('compose')
})
app.post('/compose',(req, res)=>{
  // post = {title: req.body.Title, post: req.body.post} 
  // postarray.push(post)
  const newpost = new Post({title: req.body.Title, post: req.body.post})
  newpost.save(function(err){

    if (!err){
 
      res.redirect("/");
 
    }})
})

app.get('/home/:url',(req,res)=>{
  var flag=0;

  Post.find({},function(err, foundlist){
    if(!err){
      if(foundlist!=[]){
        console.log(`Found posts for post.ejs: ${foundlist}`)
        for(i=0; i<foundlist.length; i++){
          if (req.params.url== foundlist[i]._id){
            flag=1
            res.render('post', {Title:foundlist[i].title, post: foundlist[i].post})
           }}
      }
      else{ console.log("Not valid request")}
      res.render('failure')
    }
  })

    
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
