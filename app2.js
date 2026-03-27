const express=require("express");
const app=express();
// const router = express.Router();
var mongoose = require("./db/config");
var router = require("./router");
const cookieParser=require('cookie-parser');
const session=require("express-session");
app.use(cookieParser());
app.use(session({
  key:"user_sid",
  secret:"somerandomstuffs",
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires:100000,
  }
}))
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use('/uploads', express.static('uploads'));

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use('/',router);
const PORT = 8080;
app.listen(PORT, ()=>{
  console.log(`your server is running at http://localhost:${PORT}`);
});