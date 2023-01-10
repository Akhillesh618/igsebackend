const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require("./users.js");
const userbills = require("./userbills.js");
const prices = require("./prices.js");
const vouchers =require("./vouchers.js");

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
/////////////////////////REGISTER API////////////////////////////////

app.post("/register", (req, res) => {
    try {
      if (req.body && req.body.name && req.body.email && req.body.password && req.body.address && req.body.propertyType && req.body.bedrooms && req.body.voucherCode) {
  

        const UserCredits = 200;
        // const existigUserwithsamevoucher = await userbills.findOne({ email: req.body.email });

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
                        credits: UserCredits
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
              const token = jwt.sign(payload, JWT_SECRET);
              res.send({ success: 'Login successful', token , data });
  
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

//////////SUBMIT USER BILLS API////////////////////////
app.post('/submitbill', async (req, res) => {
  try {
    // Validate the input data
    if (!req.body.email || !req.body.credit || !req.body.submission_date || !req.body.electricity_reading_Day || !req.body.electricity_reading_Night || !req.body.gas_reading) {
      return res.status(400).json({
        errorMessage: 'Missing required fields',
        status: false
      });
    }

    // // Check if the user already has a bill with the same email and same date bil
    const existingBill = await userbills.findOne({ submission_date: req.body.submission_date });
    const existinguser = await userbills.findOne({ email: req.body.email });
    if (existinguser) {
      if(existingBill){
        return res.status(200).json({
          status: true,
          title: 'Same date bill alrdy submited'
        });
      }

    }

    // Create a new bill object
    const newBill = new userbills({
      email: req.body.email,
      credit: req.body.credit,
      submission_date: req.body.submission_date,
      electricity_reading_Day: req.body.electricity_reading_Day,
      electricity_reading_Night: req.body.electricity_reading_Night,
      gas_reading: req.body.gas_reading
    });
    

    // Save the bill to the database
    await newBill.save();

    // Send a response to the client
    res.status(200).json({
      status: true,
      title: 'Bill submitted successfully.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorMessage: 'Error submitting bill',
      status: false
    });
  }
});

////////////////////////// GET USERBILLS API//////////////////////////////
  
app.get('/userbills', (req, res) => {
  const collection = client.db("igse").collection("userbills");
  collection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
    
  });


//////////////GET PRICES //////////////////////////////////

app.get('/getprices', (req, res) => {
  const collection =client.db("igse").collection("prices");
  collection.find({}).toArray((err, documents) => {
    res.send(documents);
  })

});

////////////////SAVE AND UPDATES BILL RATES API////////////////////////////////////////////////

app.post('/updaterates', async (req, res) => {
  try {
    const updatedPrices = await prices.findOneAndUpdate(
      {}, // query
      {
        electricityDay: req.body.electricityDay,
        electricityNight: req.body.electricityNight,
        gas: req.body.gas
      }, // updated data
      { upsert: true, new: true } // options
    );
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});


/////////////////////ADD NEW VOUCHERS////////////////////////////////////////////////

app.post('/addvoucher', async (req, res) => {
  try {
    const existingVoucher = await vouchers.findOne({ voucherCode: req.body.voucherCode });
    if (existingVoucher) {
      return  res.status(200).send({ message: 'Voucher Exist in Databse' });
    }
    // Extract the voucher code from the request body
    const addVoucher = new vouchers({
      voucherCode: req.body.voucherCode,
      detailsOfVoucher: "Un-Used Voucher"
    })
    await addVoucher.save();
    // Send a response to the client indicating that the voucher was successfully added
    res.status(200).send({ message: 'Voucher added successfully' });
  } catch (error) {
    // Send an error response if something went wrong
    res.status(500).send({ message: 'Error adding voucher', error });
  }
});












////////////////////////////////////////////////////////////////////////////////////
app.listen(5000, () => {
    console.log('Server listening on port 5000');
});