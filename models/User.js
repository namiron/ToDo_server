const { Schema, model, ObjectId } = require("mongoose");

const User = new Schema({
  name: { type: String },
  surname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  item: [{ type: ObjectId, ref: "Item" }],
});

module.exports = model("User", User);
