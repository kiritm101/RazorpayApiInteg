const express = require('express')
const app = express();
var path    = require("path");
var bodyParser = require('body-parser');
const Razorpay = require('razorpay');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
//   res.send('hello world')
//   res.status(200).json({user:"kishore"});
res.sendFile(path.join(__dirname+'/index.html'));
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.send('POST request to homepage')
  })
app.post('/create/orderId', (req, res) => {
    var instance = new Razorpay({
        key_id: 'rzp_test_KWx1IJF8tH2nDk',
        key_secret: 'HRar9rX6tiQXFY1TBwtcGs5E',
      });
      //orders api serverside api call
      var options = {
        amount: 50000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send(order)
      });

  })
  


  //payment signature verification route
  app.post("/api/payment/verify",(req,res)=>{
console.log(req.body)
    let body=req.body.razorpay_order_id+ "|" + req.body.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', 'HRar9rX6tiQXFY1TBwtcGs5E')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });
app.listen(3000,()=>{
    console.log("Server now listening on port 3000")
})
