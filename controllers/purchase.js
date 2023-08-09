const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');   
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.purchasepremium = async (req, res, next) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RZP_KEY,
            key_secret: process.env.RZP_SECRET_KEY
        });

        const amount = 9900;
        const order = await rzp.orders.create({ amount, currency: "INR" });

        const newOrder = new Order({
            paymentid: order.id,
            orderid: order.id,
            status: "PENDING"
        });

        await newOrder.save();

        res.status(201).json({ order, key_id: rzp.key_id });
    } catch (err) {
        console.log(err);
    }
};

function generateAccessToken(id, ispremuimuser, name) {
    return jwt.sign({ userId: id, ispremuimuser: ispremuimuser, username: name }, 'secretKey');
}

exports.updateOrder = async (req, res, next) => {
    try {
        const order_id = req.body.order_id;
        const payment_id = req.body.payment_id;
        const userId = req.user.id;

        const order = await Order.findOne({ orderid: order_id });
        order.paymentid = payment_id;
        order.status = "SUCCESS";
        await order.save();

        const user = await User.findById(userId);
        user.premium = true;
        await user.save();

        const token = generateAccessToken(userId, true);
        res.status(201).json({ message: "transition successful", token });
    } catch (err) {
        console.log(err);
    }
};

exports.updateFailure = async (req, res, next) => {
    try {
        const order_id = req.body.order_id;
        const order = await Order.findOne({ orderid: order_id });
        order.status = "FAILURE";
        await order.save();
    } catch (err) {
        console.log(err);
    }
};
