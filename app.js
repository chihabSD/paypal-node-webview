const express = require("express");
const bodyParser = require("body-parser");
const engines = require("consolidate");
const paypal = require("paypal-rest-sdk");
// const cons = require("consolidate");

const app = express();

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure paypal
paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "AaHPu8bNt31HDrHqMy2mSZM4_7AjsvzTHuRbpHDPdVlS8NYVI21sHT5KLIcTPKR2qMNWOac3nbyK5iIj",
    client_secret:
        "EC4TsrRQkl6SajD1R5BSFZi2dLIE6-r9WjYmuz7cqBMBZtKNROq2U8lbQV4d4eGPxSCSvLFozbSgPCrd"
});

// when user comes to default route, render index file 
app.get("/", (req, res) => {
    res.render("index");
});

// define paypal route and 
app.get('/paypal', (req, res) => {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success", // handle return rul
            "cancel_url": "http://localhost:300/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };
    
    /**
     * Paypal gives u url for payment
     * we login 
     * and click pay
     * then we have execute payment blow in payment execute
     */
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            // redirect user to this payment url
            res.redirect(payment.links[1].href)
        }
    });
})



// handle sucess
app.get('/success', (req, res) => {
    // get payment id 
    var payerId = req.query.PayerID
    var paymentId = req.query.paymentId
   var execute_payment_json = {
       payer_id: payerId,
       transactions: [
           {
               amount: {
                   currency: "USD",
                   total: "1.00"
               }
           }
       ]
   };

   paypal.payment.execute(paymentId, execute_payment_json, function(
       error,
       payment
   ) {
       if (error) {
           console.log(error.response);
           throw error;
       } else {
           console.log("Get Payment Response");
           console.log(JSON.stringify(payment));
           res.render("success");
       }
   });
})
// handle cancel 
app.get('/cancel', (req, res) => {
  res.render('cancel') 
})
app.listen(3000, () => {
    console.log('server is running') 
})