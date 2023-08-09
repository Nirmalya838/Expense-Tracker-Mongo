const mongoose= require('mongoose');
const Schema = mongoose.Schema

const expenseSchema = new Schema({
  amount:{
    type:Number,
    require:true
},
description:{
    type:String,
    require:true
},
category:{
    type:String,
    require:true
},

  userId: {
    type: Schema.Types.ObjectId,
    ref:'User',
    require:true
  }
})

 

module.exports= mongoose.model('Expense',expenseSchema)