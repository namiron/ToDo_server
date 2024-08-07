const { Schema, model, ObjectId } = require('mongoose')

const Item = new Schema({
    title: { type: String, unique: true, required: true },
    date: { type: Date, default: Date.now() },
    progress: { type: Number, default: 0 },
    comments: [{ type: ObjectId, ref: 'Comment' }],
    parent: [{ type: ObjectId, ref: "User" }]

})


module.exports = model('Item', Item)