const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require("./users.js");
var cors = require('cors');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

bodyParser = require('body-parser'),

mongoose.connect('mongodb+srv://akhil:8686Amma@cluster0.9ha2pr2.mongodb.net/cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


mongoose.set('strictQuery', false)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Successfully connected to MongoDB!');
});
app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));


app.post("/register", (req, res) => {
    try {
      if (req.body && req.body.name && req.body.email && req.body.password && req.body.address && req.body.propertyType && req.body.bedrooms && req.body.voucherCode) {
  
        user.find({ email: req.body.email }, (err, data) => {
  
          if (data.length == 0) {
  
            let User = new user({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                address: req.body.address,
                propertyType: req.body.propertyType,
                bedrooms: req.body.bedrooms,
                voucherCode: req.body.voucherCode,
            });
            User.save((err, data) => {
              if (err) {
                res.status(400).json({
                  errorMessage: err,
                  status: false
                });
              } else {
                res.status(200).json({
                  status: true,
                  title: 'Registered Successfully.'
                });
              }
            });
  
          } else {
            res.status(400).json({
              errorMessage: `email ${req.body.email} Already Exist!`,
              status: ture
            });
          }
  
        });
  
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  });
  

 





  app.post("/login", (req, res) => {
    try {
      if (req.body && req.body.email && req.body.password) {
        user.find({ email: req.body.email }, (err, data) => {
          if (data.length > 0) {


            
            if (bcrypt.compareSync(data[0].password, req.body.password)) {
              checkUserAndGenerateToken(data[0], req, res);
            } else {
  
              res.status(400).json({
                errorMessage: 'email or password is incorrect!',
                status: false
              });
            }
  
          } else {
            res.status(400).json({
              errorMessage: 'email or password is incorrect!',
              status: false
            });
          }
        })
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first!',
          status: false
        });
      }
    } catch (e) {
      res.status(400).json({
        errorMessage: 'Something went wrong!',
        status: false
      });
    }
  
  });



  function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ user: data.email, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: 'Login Successfully.',
          token: token,
          status: true
        });
      }
    });
  }

  
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });


app.listen(5000, () => {
    console.log('Server listening on port 5000');
});