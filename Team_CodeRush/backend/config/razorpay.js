//razorpay Payment Gateway configurations 
const Razorpay = require('razorpay');


let razorpayInstance = null;
//Featch Razorpay credntials From .env files
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('Razorpay initialized successfully');
} else {
  console.log('Razorpay credentials not configured - payments disabled');
}

module.exports = razorpayInstance;