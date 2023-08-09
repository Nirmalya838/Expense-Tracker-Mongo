const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema( {
    
    active: {
        type: Boolean,
        default: true,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
      }
})

module.exports = mongoose.model('Forgotpassword', forgotPasswordSchema);