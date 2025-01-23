const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

const accountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserModel", // Reference to the User model
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerAccountId: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  access_token: {
    type: String,
    default: null,
  },
  expires_at: {
    type: Date,
    default: null,
  },
  token_type: {
    type: String,
    default: null,
  },
  scope: {
    type: String,
    default: null,
  },
  id_token: {
    type: String,
    default: null,
  },
  session_state: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add compound index to ensure unique provider and providerAccountId per user
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const AccountModel =
  models.AccountModel || model("AccountModel", accountSchema);

module.exports = AccountModel;
