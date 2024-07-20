const express = require("express");
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const User=require('./models/User');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcryptjs');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials:true,
  origin:process.env.CLIENT_URL,
}
));
dotenv.config();
//const auth=require("./router/auth");
//const list=require("./router/List");
app.use(express.json());
const jwtSecret=process.env.JWT_SECRET;
const bcryptSalt=bcrypt.genSaltSync(10);
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected");
})
.catch((err)=>{
    console.error("Error: " + err);
});
app.get("/",(req,res)=>{
    res.send("hello");
});

app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
      const createdUser = await User.create({
        username:username,
        password:hashedPassword,
      });
      jwt.sign({userId:createdUser._id, username}, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
          id: createdUser._id,
        });
      });
    } catch(err) {
      if (err) throw err;
      res.status(500).json('error');
    }
  });
  app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if(err) throw err;
            res.json(userData);
        });
    }
    else {
        res.status(401).json('no token');
    }
});
app.post("/Login", async (req, res) => {
  const {username, password} = req.body;
  const foundUser = await User.findOne({username});
  if(foundUser) {
    const passOK = bcrypt.compareSync(password, foundUser.password);
    if(passOK) {
      jwt.sign({userId:foundUser._id, username}, jwtSecret, {}, (err, token) => {
        res.cookie('token', token, {sameSite:'none', secure:true}).json({
          id: foundUser._id,
        });
      });
    }
  }

});

app.post('/logout', (req,res) => {
  res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
});
//app.use("/api/v1",auth);
//app.use("/api/v2",list);
app.listen(4000,()=>{
    console.log("Server Started")
});

