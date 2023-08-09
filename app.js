const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))



const userRouter = require('./routes/user');
const expenseRouter = require('./routes/expense');
const purchaseRouter = require('./routes/purchase');
const premiumRouter = require('./routes/premium');
const forgetPasswordRouter = require('./routes/forgetpassword');
const User = require('./models/user');
 const Expense = require('./models/expense');
const Order = require('./models/order');
//const ForgetPassword = require('./models/forgetpassword');
// const FilesDownloaded=require('./models/filesdownloaded');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('combined', {stream:accessLogStream}));

app.use(userRouter);
app.use(expenseRouter);
app.use(purchaseRouter);
app.use(premiumRouter);
app.use(forgetPasswordRouter);



mongoose.connect('mongodb+srv://Nirmalya:ZVuBsk9zzZKzjnmU@cluster.gounyfp.mongodb.net/expense?retryWrites=true&w=majority')
.then(result=>{
    app.listen(process.env.PORT||3000, ()=> console.log('connected to Database'));
})
.catch(err=>{
    console.log(err);
})

