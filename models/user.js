
const mongoose= require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    require:true
  },
  email: {
    type: String,
    require:true
  },
  password: {
    type: String,
    require:true
  },
  premium: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  }
})
  
module.exports= mongoose.model('User',userSchema)

