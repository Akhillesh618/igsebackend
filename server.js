const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require("./users.js");
const userbills = require("./userbills.js");
var cors = require('cors');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'my-secret-key';
const uri = "mongodb+srv://akhil:8686Amma@igse.9ha2pr2.mongodb.net/igse?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;


bodyParser = require('body-parser'),
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const client = new MongoClient(uri, { useNewUrlParser: true });

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
                        //   res.status(400).json({
                        //     errorMessage: `email ${req.body.email} Already Exist!`,
                        //     status: false
                        //   });
                          res.status(200).json({
                            status: true,
                            title: 'email  Already Exist!.'
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

///LOGIN API///////
  app.post("/login", (req, res) => {
    try {

      if (req.body && req.body.email && req.body.password) {
        user.find({ email: req.body.email, password: req.body.password}, (err, data) => {
            
          if (data.length > 0) {

              const payload = {
                email: req.body.email,
                password: req.body.password,
              };
              const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
              res.send({ success: 'Login successful', token , name: data.toString() });
  
          } else {
            res.status(200).json({
              errorMessage: 'incorrect! email or password',
              status: false
            });
          }
        })
      } else {
        res.status(400).json({
          errorMessage: 'Add proper parameter first! 3',
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

//////////POST USER BILLS API////////////////////////
app.post("/submitbill", (req, res) => {
  try {
    if (req.body && req.body.credit && req.body.submission_date && req.body.electricity_reading_Day && req.body.electricity_reading_Night && req.body.gas_reading) {

      userbills.find({ email: req.body.email }, (err, data) => {

        if (data.length == 0) {

           let Userbills = new userbills({
                    credit: req.body.credit,
                    // email: req.body.email,
                    submission_date: req.body.submission_date,
                    electricity_reading_Day: req.body.electricity_reading_Day,
                    electricity_reading_Night: req.body.electricity_reading_Night,
                    gas_reading: req.body.gas_reading,
                      });
                      Userbills.save((err, data) => {
                          if (err) {
                            res.status(400).json({
                              errorMessage: err,
                              status: false
                            });
                          } else {
                            res.status(200).json({
                              status: true,
                              title: 'Data subbmitted Successfully.'
                            });
                          }
                        });
              
                      } else {  //If Same user submits his bill again with same email youll come here  
                           res.status(200).json({
                            status: true,
                            title: 'Same email id.'
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
  
app.get('/userbills', (req, res) => {
  const collection = client.db("igse").collection("userbills");
  collection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
    
    
  });


app.listen(5000, () => {
    console.log('Server listening on port 5000');
});