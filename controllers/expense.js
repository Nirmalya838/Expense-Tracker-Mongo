const path = require("path");
const AWS = require("aws-sdk");
const S3Services = require("../services/S3services");
const Expense = require("../models/expense");
const User = require("../models/user");
const FilesDownload = require("../models/filesdownloaded");
const mongoose = require('mongoose');

exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views/expense.html"));
};

exports.download = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const strinfiyExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `expenses${userId}/${new Date()}.txt`;
    const fileUrl = await S3Services.uploadToS3(strinfiyExpenses, filename);
    const filesDownload = new FilesDownload({
      filelink: fileUrl,
      userId,
    });
    await filesDownload.save();
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    res.status(500).json({ fileUrl: "" });
  }
};

exports.postAddExpense = async (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const userId = req.query.userId;

  const session = await User.startSession();
  session.startTransaction();

  try {
    const result = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
      }
    );
    const oldamount = req.user.total;
    const newamount = Number(oldamount) + Number(amount);
    await User.updateOne(
      { _id: req.user.id },
      { total: newamount },
      //{ session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ newexpense: result });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

exports.sendExpenses = async (req, res, next) => {
  try {
    let page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || 5;
    const totalexpense = await Expense.countDocuments();
    console.log(totalexpense);
    const expenses = await Expense.find({ userId: req.user.id })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(201).json({
      expenses: expenses,
      currentPage: page,
      hasNextPage: page * pageSize < totalexpense,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalexpense / pageSize),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const eId = req.params.id;
    const expense = await Expense.findById(eId);
    const user = await User.findById(expense.userId);
    user.totalamount = Number(user.totalamount) - Number(expense.amount);
    await user.save({ session });
    await Expense.deleteOne({ _id: eId }, { session });
    await session.commitTransaction();
    session.endSession();
    res.sendStatus(201);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};

exports.downloadLinks = async (req, res) => {
  try {
    const url = await FilesDownload.find({ userId: req.user._id });
    res.status(200).json({ success: "true", url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: "false", error: err });
  }
};
