const mongoose= require('mongoose');
const Schema = mongoose.Schema

const fileDownloadSchema = new Schema({
    filelink: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    collection: 'filesdownloaded' // Specify the collection name
});


module.exports= mongoose.model('Filesdownload',fileDownloadSchema)