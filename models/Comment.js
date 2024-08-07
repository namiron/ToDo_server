const { Schema, model, ObjectId } = require('mongoose')

const Comment = new Schema({
    date: { type: Date, default: Date.now() },
    text: { type: String, required: true },
    user: { type: ObjectId, ref: 'User' },
    item: { type: ObjectId, ref: 'Item' }
})



module.exports = model('Comment', Comment)